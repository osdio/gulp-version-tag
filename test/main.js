/*global describe, it*/
"use strict";

var fs = require("fs"),
	es = require("event-stream"),
	should = require("should"),
	Path = require("path"),
	fs = require('fs');

require("mocha");

delete require.cache[require.resolve("../")];

var gutil = require("gulp-util"),
	gulpVersionTag = require("../");

describe("gulp-version-tag", function () {

	var expectedFile = new gutil.File({
		path: "test/expected/hello.txt",
		cwd: "test/",
		base: "test/expected",
		contents: fs.readFileSync("test/expected/hello.txt")
	});

	var srcFile = new gutil.File({
		path: "test/fixtures/hello.txt",
		cwd: "test/",
		base: "test/fixtures",
		contents: fs.readFileSync("test/fixtures/hello.txt")
	});

	var packagePath = Path.resolve(__dirname, './package.json');
	var packageObject = {};

	function setVersion(version) {
		var data = fs.readFileSync(packagePath);
		packageObject = JSON.parse(data.toString());
		packageObject.version = version;
		fs.writeFileSync(packagePath, JSON.stringify(packageObject, null, 4));
	}

	function readVersion() {
		var data = fs.readFileSync(packagePath);
		try {
			packageObject = JSON.parse(data.toString());
		}
		catch (e) {

		}
		return packageObject.version;
	}

	describe('#wrong version format', function () {
		var stream;

		it('should throw err: Version is ad.0.1', function (done) {
			setVersion('ad.0.1');
			try {
				stream = gulpVersionTag(__dirname, './package.json');
				stream.on("error", function (err) {
					done();
				});
				stream.write(srcFile);
				stream.end();
			}
			catch (err) {
				should.exist(err);
				err.message.should.equal('Version format is wrong');
				done();
			}
		});


	});

	describe('#right version format', function () {

		beforeEach(function (done) {
			setVersion('0.0.1');
			done();
		});

		it("should produce expected file via buffer", function (done) {
			var stream = gulpVersionTag(__dirname, './package.json');

			stream.on("error", function (err) {
				done(err);
			});
			stream.on("data", function (newFile) {
				should.exist(newFile);
				should.exist(newFile.contents);
				Path.basename(newFile.path, '.txt').should.equal('hello-v0.0.2');
				readVersion().should.equal('0.0.2');
				done();
			});
			stream.write(srcFile);
			stream.end();
		});


		it("should produce expected file via stream", function (done) {

			var srcFile = new gutil.File({
				path: "test/fixtures/hello.txt",
				cwd: "test/",
				base: "test/fixtures",
				contents: fs.createReadStream("test/fixtures/hello.txt")
			});

			var stream = gulpVersionTag(__dirname, './package.json');

			stream.on("error", function (err) {
				done(err);
			});

			stream.on("data", function (newFile) {

				should.exist(newFile);
				should.exist(newFile.contents);
				Path.basename(newFile.path, '.txt').should.equal('hello-v0.0.2');
				readVersion().should.equal('0.0.2');
				done();

			});

			stream.write(srcFile);
			stream.end();
		});

		it("should make sense when set the beforeText or afterText", function (done) {

			var srcFile = new gutil.File({
				path: "test/fixtures/hello.txt",
				cwd: "test/",
				base: "test/fixtures",
				contents: fs.createReadStream("test/fixtures/hello.txt")
			});

			var stream = gulpVersionTag(__dirname, './package.json', {
				beforeText: '--',
				afterText: '11'
			});

			stream.on("error", function (err) {
				done(err);
			});

			stream.on("data", function (newFile) {

				should.exist(newFile);
				should.exist(newFile.contents);
				Path.basename(newFile.path, '.txt').should.equal('hello--0.0.211');
				readVersion().should.equal('0.0.2');
				done();

			});

			stream.write(srcFile);
			stream.end();
		});

		it("should be ok when set reuse to true", function (done) {

			var srcFile, srcFile2, count = 0;
			srcFile = new gutil.File({
				path: "test/fixtures/hello.txt",
				cwd: "test/",
				base: "test/fixtures",
				contents: fs.createReadStream("test/fixtures/hello.txt")
			});

			srcFile2 = new gutil.File({
				path: "test/fixtures/hello2.txt",
				cwd: "test/",
				base: "test/fixtures",
				contents: fs.createReadStream("test/fixtures/hello2.txt")
			});


			var stream = gulpVersionTag(__dirname, './package.json');
			var stream2 = gulpVersionTag(__dirname, './package.json', {
				reuse: true
			});


			stream.on("error", function (err) {
				done(err);
			});

			stream2.on("error", function (err) {
				done(err);
			});


			stream.on("data", function (newFile) {

				should.exist(newFile);
				should.exist(newFile.contents);
				Path.basename(newFile.path, '.txt').should.equal('hello-v0.0.2');
				readVersion().should.equal('0.0.2');
				count++;
				if (count == 2) {
					done();
				}
			});

			stream2.on("data", function (newFile) {

				should.exist(newFile);
				should.exist(newFile.contents);
				Path.basename(newFile.path, '.txt').should.equal('hello2-v0.0.2');
				readVersion().should.equal('0.0.2');
				count++;
				if (count == 2) {
					done();
				}

			});


			stream.write(srcFile);
			stream2.write(srcFile2);

			stream.end();
			stream2.end();
		});


	});


});
