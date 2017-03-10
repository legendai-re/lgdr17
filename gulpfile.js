// Include gulp @ puglins
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');
    pug = require('gulp-pug');
    // plugins = require('gulp-load-plugins')();

// Define base folders
var src = 'src/',
    dist = 'dist/';

// Lint Task
gulp.task('lint', function() {
  return gulp.src(src + 'assets/javascripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src(src + 'assets/stylesheets/*.scss')
    .pipe(sass())
    .pipe(gulp.dest(dist + 'css'))
    .pipe(browserSync.stream())
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
  return gulp.src(src + 'assets/javascripts/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dist))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist + 'js'))
    .pipe(browserSync.stream())
});

gulp.task('pug', function() {
  return gulp.src(src + 'views/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
});

// Watch Files For Changes
gulp.task('watch', ['browserSync', 'compile'], function() {
  gulp.watch(src + 'assets/javascripts/**/*.js', ['lint', 'scripts']);
  gulp.watch(src + 'assets/stylesheets/**/*.scss', ['sass']);
  gulp.watch(src + 'views/**/*.pug', ['pug']);
});

// Sync Browser on Change
gulp.task('browserSync', function() {
  browserSync({
    ui: {
      port: 2016
    },
    port: 2017,
    // Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
    ghostMode: true,
    server: {
      baseDir: dist
    },
  })
})

// Default Task
gulp.task('compile', ['pug', 'lint', 'sass', 'scripts']);
gulp.task('default', ['pug', 'lint', 'sass', 'scripts', 'watch']);
