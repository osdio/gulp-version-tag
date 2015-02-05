gulp = require 'gulp'
versionTag = require '../index'


gulp.task 'task1', ->
	gulp.src '../test/expected/**.txt'
	.pipe versionTag __dirname, '../test/package.json',
#		reuse: false
		beforeText: '-v'
		afterText: ''
#		autoSave:false
#		autoTagVersion: false
	.pipe gulp.dest './dest'

gulp.task 'task2', ->
	gulp.src '../test/fixtures/**.txt'
	.pipe versionTag __dirname, '../test/package.json',
#		reuse: false
		beforeText: '-v'
		afterText: ''
#		autoSave:false
#		autoTagVersion: false
	.pipe gulp.dest './dest'


gulp.task 'default', ['task1', 'task2']


setTimeout ()->
	console.log global.versionTag
, 100
