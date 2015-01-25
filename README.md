
# gulp-version-tag
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url]  [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

> gulp-version-tag plugin for [gulp](https://github.com/wearefractal/gulp).
> 
> Just for attach versionTag to your file. And it can auto gain the version number.

## Usage

First, install `gulp-version-tag` as a development dependency:

```
npm install --save-dev gulp-version-tag
```

Then, add it to your `gulpfile.js`:

```
var gulp-version-tag = require("gulp-version-tag");

gulp.src("./src/*.js")
	.pipe(gulp-version-tag(__dirname,'./package.json'))
	.pipe(gulp.dest("./dist"));
```

## API

### gulp-version-tag(__dirname, packagejsonPath, [options])

#### __dirname
Type: `String` 

Required: `true`

When using, just set the this param to `__dirname`.

Example:

```
gulp.task 'default', ->
	gulp.src '../test/**/**.txt'
	.pipe versionTag __dirname, '../test/package.json'
	.pipe gulp.dest './dest'
```

#### packagejsonPath
Type: `String`  

Required: `true`

This is the relative path from where you use gulp-version-tag to the `package.json`.

Example:

Just see above example. And the file structrue for the example is :

```
example
    gulpfile.coffee
test
    package.json
```

And the `gulp file.coffee` is the example file.

#### options

Type: `Object`

Required: `false`

##### options.global

Type: `Bool`

Required: `false`

Default: `true`

If you set this value to `true`, when run `gulp-version-tag`, it will set the `global.versionTag` to the version of package.son now. So that you can use this version value to do another thing.

For example:

```
gulp = require 'gulp'
versionTag = require '../index'


gulp.task 'default', ->
	gulp.src '../test/**/**.txt'
	.pipe versionTag __dirname, '../test/package.json',
		global: true
	.pipe gulp.dest './dest'


setTimeout ()->
	console.log global.versionTag
, 2000
#    you will get the version Tag

```

A file(for example : hello.txt), if your current version is `0.0.0`, after running gulp-version-tag, it will change to `0.0.1`, 
and file name will change to `hello-v0.0.1.txt`.

#### options.beforeText

Type: `String`
Default: '-v'

The text to add before version num.

#### options.afterText

Type: `String`
Default: ''

The text to add after version num.

Example:

```
gulp.task 'default', ->
	gulp.src '../test/**/**.txt'
	.pipe versionTag __dirname, '../test/package.json',
		global: true
		beforeText: '---v'
		afterText: '---'
	.pipe gulp.dest './dest'
```

### Another use

You can also 



## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

[npm-url]: https://npmjs.org/package/gulp-version-tag
[npm-image]: https://badge.fury.io/js/gulp-version-tag.png

[travis-url]: http://travis-ci.org/soliury/gulp-version-tag
[travis-image]: https://secure.travis-ci.org/soliury/gulp-version-tag.png?branch=master

[coveralls-url]: https://coveralls.io/r/soliury/gulp-version-tag
[coveralls-image]: https://coveralls.io/repos/soliury/gulp-version-tag/badge.png

[depstat-url]: https://david-dm.org/soliury/gulp-version-tag
[depstat-image]: https://david-dm.org/soliury/gulp-version-tag.png
