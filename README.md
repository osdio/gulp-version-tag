
# gulp-version-tag
[![NPM version][npm-image]][npm-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url]

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

##### options.reuse

Type: `Bool`

Required: `false`

Default: `true`

If you set this value to `true`, when run `gulp-version-tag`, if `global.versionTag` have value, it will use the value of it as version. And once you run a task, it will set `global.versionTag` to the version read from `package.json`.

If you set this value to `false`, it won't check the value of `global.versionTag` every time you run a gulp task.

For example:

```
gulp.task 'task1', ->
	gulp.src '../test/expected/**.txt'
	.pipe versionTag __dirname, '../test/package.json',
#		reuse: false
		prefix: '-v'
		suffix: ''
#		autoSave:false
#		autoTagVersion: false
	.pipe gulp.dest './dest'

gulp.task 'task2', ->
	gulp.src '../test/fixtures/**.txt'
	.pipe versionTag __dirname, '../test/package.json',
#		reuse: false
		prefix: '-v'
		suffix: ''
#		autoSave:false
#		autoTagVersion: false
	.pipe gulp.dest './dest'


gulp.task 'default', ['task1', 'task2']

```

When you running many tasks, and you want to use the same version, you should not set reuse to `false`.Just like the example above, `task1` and `task2` can use the same version, it only auto gain version once, and save once. 

For more example, just see my another project: [ngFast](https://github.com/soliury/ngFast).

#### options.prefix

Type: `String`

Default: `'-v'`

The text to add before version num.

#### options.suffix

Type: `String`

Default: `''`

The text to add after version num.

Example:

```
gulp.task 'default', ->
	gulp.src '../test/**/**.txt'
	.pipe versionTag __dirname, '../test/package.json',
		global: true
		prefix: '---v'
		suffix: '---'
	.pipe gulp.dest './dest'
```

#### options.autoSave

Type: `Bool`

Default: `true`

If the value is `true`, When running `gulp-version-tag`, it will auto save the version change to `package.json`.

#### options.autoTagVersion

Type: `Bool`

Default: `true`

If the value is `true`, it will auto change the version number, if the version in your package.json is `0.0.1`, a file `file01` will be changed to `file01-v0.0.02` after running.

For more example, just [see](https://github.com/soliury/gulp-version-tag/blob/master/example/gulpfile.coffee).

#### options.type

Type: `String`

Default: `patch`

**patch**: v0.0.1    -->    v0.0.2

**feature**: v0.0.1    -->    v0.1.1

**release**: v0.0.1    -->    v1.0.1

### Another use

```
gulp = require 'gulp'
versionTag = require '../index'
Version = require '../util'


version = new Version __dirname, '../test/package.json',
	autoSave: true


gulp.task 'patch', ->
	version.patch()
	console.log "version changed to #{version.version}"

gulp.task 'feature', ->
	version.feature()
	console.log "version changed to #{version.version}"

gulp.task 'release', ->
	version.release()
	console.log "version changed to #{version.version}"

```

This can ease to update the package version. More details focus on [gulpfile](https://github.com/soliury/gulp-version-tag/blob/master/gulpfile.coffee)




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
