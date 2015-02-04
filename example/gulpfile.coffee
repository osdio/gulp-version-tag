gulp = require 'gulp'
versionTag = require '../index'


gulp.task 'default', ->
	gulp.src '../test/**/**.txt'
	.pipe versionTag __dirname, '../test/package.json',
		reuse: false
		beforeText: '-v'
		afterText: ''
#		autoSave:false
#		autoTagVersion: false
	.pipe gulp.dest './dest'

setTimeout ()->
	console.log global.versionTag
, 100
