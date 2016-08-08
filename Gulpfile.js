var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var watch = require('gulp-watch');
var webserver = require('gulp-webserver');
var browserify = require('gulp-browserify');
var less = require('gulp-less');
var path = require('path');
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ['last 2 versions'] });


// DEV

gulp.task('javascript', function () {
  return gulp.src('service/lib/service.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(browserify({
        insertGlobals : true,
        debug : !gulp.env.production
      }))
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task('html', function () {
  return gulp.src('service/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('less', function () {
  return gulp.src('./service/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/styles'));
});

// PROD

gulp.task('javascriptProd', function () {
  return gulp.src('service/lib/service.js')
    .pipe(babel())
    .pipe(browserify({
        insertGlobals : true
      }))
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('prod/scripts'));
});

gulp.task('htmlProd', function () {
  return gulp.src('service/index.html')
    .pipe(gulp.dest('prod'));
});

gulp.task('lessProd', function () {
  return gulp.src('./service/**/*.less')
    .pipe(less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('./prod/styles'));
});

// ENV

gulp.task('watch', function () {
    gulp.watch('service/**/**.*', ['build']);
});

gulp.task('webserver', function() {
  gulp.src('./dist')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('build', ['javascript', 'html', 'less']);
gulp.task('prod', ['javascriptProd', 'htmlProd', 'lessProd']);
gulp.task('default', ['build', 'watch', 'webserver']);
