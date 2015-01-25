var Path = require("path"),
	fs = require('fs'),
	through = require("through2"),
	gutil = require("gulp-util");


const PLUGIN_NAME = 'gulp-version-tag';

module.exports = function (dirname, packageRelativePath, options) {
	"use strict";
	var packagejson = {},
		version,
		packageAbsolutPath;

	if (options == null) {
		options = {}
	}
	if (!options.beforeText) {
		options.beforeText = '-v';
	}
	if (!options.afterText) {
		options.afterText = '';
	}

	var readPackageJson = function (path) {
		var data = fs.readFileSync(path);
		try {
			return JSON.parse(data.toString());
		}
		catch (e) {
			throw new gutil.PluginError(PLUGIN_NAME, 'Package.json parse failed');
		}
	};
	var savePackageJson = function (version) {
		packagejson.version = version;
		try {
			fs.writeFileSync(packageAbsolutPath, JSON.stringify(packagejson, null, 4));
		}
		catch (e) {
			throw new gutil.PluginError(PLUGIN_NAME, 'Package.json stringify failed');
		}
	};

	packageAbsolutPath = Path.resolve(dirname, packageRelativePath);

	packagejson = readPackageJson(packageAbsolutPath);
	version = packagejson.version;


	if (!packageRelativePath) {
		throw new gutil.PluginError(PLUGIN_NAME, "Package.json path is empty");
	}


	if (version == null) {
		throw new gutil.PluginError(PLUGIN_NAME, "Version is null");
	}

	var reg = /^\d{1,2}\.\d{1,2}\.\d{1,2}$/;


	if (!reg.test(version)) {
		throw new gutil.PluginError(PLUGIN_NAME, "Version format is wrong");
	}

	var versionNums = version.split('.');

	versionNums.forEach(function (item, index, arr) {
		arr[index] = parseInt(item);
	});

	checkVersion(versionNums, 2);

	function checkVersion(versionNums, i) {
		versionNums[i] += 1;
		if (i == 0) {
			if (versionNums[i] > 99) {
				throw new gutil.PluginError(PLUGIN_NAME, "Version have gone beyond");
			}
		}
		if (versionNums[i] > 99) {
			versionNums[i] = Math.floor(versionNums[i] / 99);
			checkVersion(versionNums, --i);
		}
	}

	function gulpVersionTag(file, enc, callback) {
		if (file.isNull()) {
			this.push(file);
			savePackageJson(versionNums.join('.'));
			return callback();
		}

		if (file.isBuffer()) {

			setVersionTag(file);
			this.push(file);

		}

		if (file.isStream()) {
			setVersionTag(file);
			this.push(file);
		}

		function setVersionTag(file) {
			var extname = Path.extname(file.path);
			var basename = Path.basename(file.path, extname);
			var dirname = Path.dirname(file.path);
			basename += options.beforeText + versionNums.join('.') + options.afterText;
			file.path = Path.join(dirname, basename + extname);

			savePackageJson(versionNums.join('.'));
			if (options.global) {
				global.versionTag = versionNums.join('.');
			}
		}

		return callback();
	}

	return through.obj(gulpVersionTag);
};
