gulp = require 'gulp'
git = require 'gulp-git'
versionTag = require './index'
Version = require './util'

version = new Version __dirname, './package.json',
	autoSave: true
versionInfo = ''

gulp.task 'patch', ->
	version.patch()
	console.log "version changed to #{version.version}"

gulp.task 'addAndCommit', ->
	versionInfo = "version: #{version.version}"
	gulp.src 'package.json'
	.pipe git.add()
	.pipe git.commit(versionInfo)

gulp.task 'tag', ['patch', 'addAndCommit'], ->
	git.tag 'v' + version.version, versionInfo, (err)->
		console.log err




