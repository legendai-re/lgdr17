// Include gulp plugins
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    pug = require('gulp-pug'),
    del = require('del'),
    watch = require('gulp-watch'),
    imagemin = require('gulp-imagemin'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    plumber = require('gulp-plumber');

// Define base folders
var src = 'src/',
    dist = 'dist/';

// Lint Task
gulp.task('lint', function() {
  return gulp.src(src + 'assets/javascripts/**/*.js')
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src(src + 'assets/stylesheets/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest(dist + 'css'))
    .pipe(browserSync.stream())
});

// Concatenate & Minify JS
gulp.task('scripts', ['lint', 'copy:vendors'], function() {
  return gulp.src([src + 'assets/javascripts/**/*.js', !src + 'assets/javascripts/vendors/*.js'])
    .pipe(concat('js/main.js'))
    .pipe(gulp.dest(dist))
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dist + 'js'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Scripts task complete' }))
});

gulp.task('pug', function() {
  return gulp.src(src + 'views/*.pug')
    .pipe(plumber())
    .pipe(pug())
    .pipe(gulp.dest(dist))
    .pipe(browserSync.stream())
});

// Copy vendors/libs
gulp.task('copy:vendors', function() {
  return gulp.src(src + 'assets/javascripts/vendors/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(dist + 'js/vendors'))
    .pipe(browserSync.stream())
});

// Copy images
gulp.task('copy:images', function() {
  return gulp.src(src + 'assets/images/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest(dist + 'img'))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Images task complete' }))
});

// Copy videos
gulp.task('copy:videos', ['copy:subtitles'], function() {
  return gulp.src(src + 'assets/videos/**/*.{mp4,mov}')
    .pipe(gulp.dest(dist + 'videos'))
    .pipe(browserSync.stream())
});

// Copy subtitles
gulp.task('copy:subtitles', function() {
  return gulp.src(src + 'assets/videos/subtitles/**/*.vtt')
    .pipe(gulp.dest(dist + 'videos/subtitles'))
    .pipe(browserSync.stream())
});

// Copy fonts
gulp.task('copy:fonts', function() {
  return gulp.src(src + 'assets/fonts/**/*.{ttf,woff,eof,svg,otf}')
    .pipe(gulp.dest(dist + 'fonts'))
    .pipe(browserSync.stream())
});

// Clean folders
gulp.task('clean', function() {
  return del([dist + 'css', dist + 'js', dist + 'img', dist + 'videos'])
});

// Watch Files For Changes
gulp.task('watch', ['clean', 'build', 'browserSync'], function() {
  gulp.watch('./' + src + 'assets/javascripts/**/*.js', ['scripts']);
  gulp.watch('./' + src + 'assets/stylesheets/**/*.scss', ['sass']);
  gulp.watch('./' + src + 'assets/images/**/*.{png,jpg,jpeg,gif,svg}', ['copy:images']);
  gulp.watch('./' + src + 'assets/fonts/**/*.{ttf,woff,eof,svg}', ['copy:fonts']);
  gulp.watch('./' + src + 'assets/videos/**/*.{mp4,mov}', ['copy:videos']);
  gulp.watch('./' + src + 'assets/videos/subtitles/**/*.vtt', ['copy:subtitles']);
  gulp.watch('./' + src + 'views/**/*.pug', ['pug']);
});

// Sync Browser on Change
gulp.task('browserSync', function() {
  browserSync({
    // Decide which URL to open automatically when Browsersync starts.
    //Defaults to "local" if none set. Can be true, local, external, ui, ui-external, tunnel or false
    open: true,
    // Open the first browser window at URL + "/info.php"
    startPath: null,
    // Choose in wich browser open the project
    browser: ["google chrome"],
    // Browsersync includes a user-interface that is accessed via a separate port.
    // The UI allows to controls all devices, push sync updates and much more.
    ui: {
      port: 2016
    },
    // Use a specific port (instead of the one auto-detected by Browsersync)
    port: 2017,
    // Use the built-in static server for basic HTML/JS/CSS websites.
    server: {
      baseDir: dist
    },
    // Clicks, Scrolls & Form inputs on any device will be mirrored to all others.
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: false
    },
    // Inject CSS changes or just do a page refresh
    injectChanges: true,
    // The small pop-over notifications in the browser are not always needed/wanted.
    notify: true,
    // Change the console logging prefix.
    // Useful if you're creating your own project based on Browsersync
    logPrefix: "static_website",
    // Can be either "info", "debug", "warn", or "silent"
    logLevel: "info",
    // Log information about changed files
    logFileChanges: true,
  })
})

// Default Task
gulp.task('build', ['pug', 'sass', 'scripts', 'copy']);
gulp.task('copy', ['copy:images', 'copy:videos', 'copy:subtitles', 'copy:fonts']);
gulp.task('default', ['watch']);
