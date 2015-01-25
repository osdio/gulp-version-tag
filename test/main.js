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

		it('should throw err: Version is 100.0.1', function (done) {
			setVersion('100.0.1');
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


		it('should throw err: Version format is a.2.4', function (done) {
			setVersion('a.2.4');
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

		it('should throw err: Version format is 99.99.99', function (done) {
			setVersion('99.99.99');
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
				err.message.should.equal('Version have gone beyond');
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

		it('should gain version num when version num is 99', function (done) {
			setVersion('0.0.99');
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
				Path.basename(newFile.path, '.txt').should.equal('hello-v0.1.1');
				readVersion().should.equal('0.1.1');
				done();
			});
			stream.write(srcFile);
			stream.end();
		});

	});


});
