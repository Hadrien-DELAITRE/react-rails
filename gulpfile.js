require('babel/polyfill');
var _ = require('lodash');
var should = require('should');
var Promise = (global || window).Promise = require('bluebird');
var __DEV__ = (process.env.NODE_ENV !== 'production');
var __PROD__ = !__DEV__;
var __BROWSER__ = (typeof window === 'object');
var __NODE__ = !__BROWSER__;
if(__DEV__) {
  Promise.longStackTraces();
}

var del = require('del');
var babel = require('gulp-babel');
var fs = Promise.promisifyAll(require('fs'));
var gulp = require('gulp');
var exec = require('gulp-exec');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');
var prepend = require('gulp-insert').prepend;
var sourcemaps = require('gulp-sourcemaps');
var stylish = require('jshint-stylish');

var readPrelude = fs.readFileAsync('./__prelude.js');

function lint() {
  return gulp.src('src/**/*.js')
  .pipe(plumber())
  .pipe(exec('eslint <%= file.path %>'))
  .pipe(exec.reporter())
  .pipe(jshint())
  .pipe(jshint.reporter(stylish));
}

function build() {
  return readPrelude.then(function(prelude) {
    return gulp.src('src/**/*.js')
    .pipe(plumber())
    .pipe(prepend(prelude))
    .pipe(babel({
      modules: 'common',
    }))
    .pipe(gulp.dest('dist'));
  });
}

function clean() {
  del(['dist']);
}

gulp.task('lint', lint);
gulp.task('clean', clean);
gulp.task('build', ['lint', 'clean'], build);
gulp.task('default', ['build']);
