var Path = require("path"),
	through = require("through2"),
	gutil = require("gulp-util"),
	VersionTag = require('./util');


const PLUGIN_NAME = 'gulp-version-tag';

module.exports = function (dirname, packageRelativePath, options) {
	"use strict";
	var flag = 0,
		versionTag,
		type;

	options = options || {};
	options.beforeText = options.beforeText || '-v';
	options.afterText = options.afterText || '';
	if (options.autoTagVersion === undefined)
		options.autoTagVersion = true;
	if (options.autoSave === undefined)
		options.autoSave = true;

	if (options.type != 'feature' && options.type != 'release') {
		options.type = 'patch';
	}
	type = options.type;


	if (!packageRelativePath) {
		throw new gutil.PluginError(PLUGIN_NAME, "Package.json path is empty");
	}

	var errorHandle = function (err) {
		throw new gutil.PluginError(PLUGIN_NAME, err);
	};
	versionTag = new VersionTag(dirname, packageRelativePath, options, errorHandle);


	function gulpVersionTag(file, enc, callback) {
		if (file.isNull()) {
			if (flag == 0) {
				versionTag[type]();
				flag++;
			}
			this.push(file);

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
		console.log(options);
		function setVersionTag(file) {
			var extname = Path.extname(file.path);
			var basename = Path.basename(file.path, extname);
			var dirname = Path.dirname(file.path);
			if (options.reuse && global.versionTag) {
				basename += options.beforeText + global.versionTag + options.afterText;
				file.path = Path.join(dirname, basename + extname);
			}
			else {
				if (flag == 0 && options.autoTagVersion) {
					versionTag[type]();
					flag++;
				}
				global.versionTag = versionTag.version;
				basename += options.beforeText + versionTag.version + options.afterText;
				file.path = Path.join(dirname, basename + extname);
			}
		}

		return callback();
	}

	return through.obj(gulpVersionTag);
};
