var gulp = require('gulp'),
  less = require('gulp-less'),
  prefixer = require('gulp-autoprefixer'),
  reloader = require('gulp-livereload'),
  minify = require('gulp-minify-css'),
  clean = require('gulp-clean'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  fs = require('fs'),
  browserify = require('browserify'),
  connect = require('gulp-connect');

var filename = [];
//扫描src底下有哪些文件夹，创建一个文件夹列表
gulp.task('readdir', function() {
  filename.splice(0, filename.length);
  var tmp = fs.readdirSync('./src');
  tmp.forEach(function(e) {
    var stat = fs.statSync('./src/' + e);
    if (stat.isDirectory()) {
      filename.push('src/' + e + '/index.js');
    }
  });
});

gulp.task('style', function() {
  gulp.src('src/*/index.less')
    .pipe(less())
    .pipe(prefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minify())
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('../css'));
});

gulp.task('reload-1', ['style'], function() {
  gulp.src('./src/*/*.html')
    .pipe(connect.reload());
});

//使用broserify并且定义多个入口文件和对应的出口
gulp.task('script', function() {
  var files = filename;
  var tasks = files.map(function(file) {
    var dir = file.split('/')[1];
    return browserify({
      entries: file
    }).bundle()
      .pipe(source('index.js'))
      .pipe(buffer())
      .pipe(rename({
        suffix: '.min',
        dirname: dir
      }))
      .pipe(uglify())
      .pipe(gulp.dest('./dist'))
      .pipe(gulp.dest('../js'));
  });
  return tasks;
});

gulp.task('reload-2', ['script'], function() {
  gulp.src('./src/*/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('./src/*/*.less', ['style', 'reload-1']);
  gulp.watch('./src/*/*.js', ['script', 'reload-2']);
  gulp.watch('./src/*/*.html', ['html']);
});

gulp.task('clean', function() {
  return gulp.src(['./dist',])
    .pipe(clean());
});

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('./src/*/*.html')
    .pipe(connect.reload());
});

gulp.task('default', ['clean', 'readdir'], function() {
  gulp.start('connect', 'watch', 'style', 'script', 'html');
});
