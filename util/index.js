var Path = require('path'),
	fs = require('fs');

var versionReg = /^\d*\.\d*\.\d*$/;


function checkVersion(version) {
	if (!versionReg.test(version)) {
		return false
	}
	return true
}

function VersionTag(dirname, packagejsonRelativePath, options, errorHandle) {
	this.path = Path.resolve(dirname, packagejsonRelativePath);
	this.errorHandle = errorHandle || new Function();
	this.versionNums = [];
	this.packagejson = {};
	this.autoSave = options.autoSave;
	this.autoTagVersion = options.autoTagVersion;
	this.read();
}

VersionTag.prototype.read = function () {
	try {
		this.packagejson = JSON.parse(fs.readFileSync(this.path).toString());
	}
	catch (e) {
		this.errorHandle('Package.json parse failed');
	}
	if (checkVersion(this.packagejson.version)) {
		this.version = this.packagejson.version;
		this.versionNums = this.version.split('.');
		this.versionNums.forEach(function (item, index, arr) {
			arr[index] = parseInt(item);
		});
	}
	else {
		this.errorHandle('Version format is wrong');
	}
};

VersionTag.prototype.save = function () {
	this.packagejson.version = this.version;
	try {
		fs.writeFileSync(this.path, JSON.stringify(this.packagejson, null, 4));
	}
	catch (e) {
		this.errorHandle('Package.json stringify failed');
	}
};

VersionTag.prototype.patch = function () {
	this.versionNums[2] += 1;
	this.version = this.versionNums.join('.');
	if (this.autoSave)
		this.save();
};

VersionTag.prototype.feature = function () {
	this.versionNums[1] += 1;
	this.versionNums[2] = 0;
	this.version = this.versionNums.join('.');
	if (this.autoSave)
		this.save();
};

VersionTag.prototype.release = function () {
	this.versionNums[1] = this.versionNums[2] = 0;
	this.versionNums[0] += 1;
	this.version = this.versionNums.join('.');
	if (this.autoSave)
		this.save();
};

module.exports = VersionTag;
