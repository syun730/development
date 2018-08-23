var
browserSync = require('browser-sync').create(),
gulp = require('gulp'),
autoprefixer = require('autoprefixer'),
fileinclude = require('gulp-file-include'),
plumber = require('gulp-plumber'),
sass = require('gulp-sass'),
sassGlob = require('gulp-sass-glob'),
sourcemaps = require('gulp-sourcemaps'),
postcss = require('gulp-postcss'),
cssdeclsort = require('css-declaration-sorter'),
mqpacker = require('css-mqpacker'),
cached = require('gulp-cached'),
imagemin = require('gulp-imagemin'),
del = require('del'),
runSequence = require('run-sequence'),
spritesmith = require('gulp.spritesmith'),
fileinclude = require('gulp-file-include'),
styleguide = require('sc5-styleguide')
;

// サーバー・ブラウザ自動更新
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'dev'],
      directory: true
    },
    port: 8888,
    ghostMode: true,
    open: false,
    notify: false
  });
  // ファイル監視
  // gulp.watch('dev/**/*.html').on('change', browserSync.reload);
  gulp.watch('dev/**/*.html', ['html']);
  gulp.watch('dev/assets/sass/**/*.scss', ['sass','styleguide']);
  gulp.watch('dev/scripts/**/*.js', ['js']);
});

// styleguide
gulp.task('styleguide', function() {
  return gulp.src('dev/assets/sass/**/*.scss')
  .pipe(styleguide.generate({
    title: 'スタイルガイド',
    server: true,
    port: 4000,
    rootPath: 'dev/styleguide',
    overviewPath: 'dev/styleguide/overview.md',
    appRoot: '/styleguide'
  }))
  .pipe(gulp.dest('./dev/styleguide'));
});

// html
gulp.task('html', function() {
  return gulp.src(['dev/**/*.html', '!dev/common/*.html', '!dev/styleguide/**/*.html'])
  .pipe(plumber())
  .pipe(cached('dev'))
  .pipe(fileinclude({basepath: './dev/'}))
  .pipe(gulp.dest('.tmp'))
  .pipe(browserSync.stream());
});

// scss
gulp.task('sass', function() {
  return gulp.src('dev/assets/sass/**/*.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sassGlob())
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(postcss([mqpacker()]))
  .pipe(postcss([cssdeclsort({order: 'smacss'})]))
  .pipe(postcss([autoprefixer({
    browsers: ['last 1 versions', 'ie >= 11', 'iOS >= 10', 'Android >= 5'],
    grid: true
  })]))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.tmp/assets/styles/'))
  .pipe(browserSync.stream());
});

// js
gulp.task('js', function() {
  return gulp.src('dev/assets/scripts/**/')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.tmp/assets/scripts/'))
  .pipe(browserSync.stream());
});

// sprite
gulp.task('sprite', function() {
  var spriteData = gulp.src('dev/assets/spritesheet/**/*.png')
  .pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprite.scss',
    imgPath: '../images/sprite.png',
    cssFormat: 'scss',
  }));
  spriteData.img
    .pipe(gulp.dest('dev/assets/images'));
  spriteData.css
    .pipe(gulp.dest('dev/assets/sass/includes'));
});


// Copy html
gulp.task('copy:html', function () {
  return gulp.src('.tmp/**/*.html')
  .pipe(gulp.dest('deploy'));
});

// Copy css
gulp.task('copy:css', function () {
  return gulp.src('.tmp/assets/styles/*.css')
  // .pipe(cssmin())
  .pipe(gulp.dest('deploy/assets/styles/'));
});

// Copy js
gulp.task('copy:js', function () {
  return gulp.src('.tmp/assets/scripts/**/')
  .pipe(gulp.dest('deploy/assets/scripts/'));
});

// Copy images
gulp.task('copy:images', function() {
  return gulp.src('dev/assets/images/**/*.{png,jpg,gif,ico,eot,svg,ttf,woff}')
  .pipe(imagemin())
  .pipe(gulp.dest('deploy/assets/images/'));
});

// デフォルト
gulp.task('default', ['server', 'sass', 'html', 'sprite']);

// 納品用
gulp.task('build', ['clean'], function() {
    gulp.start(['create']);
});
gulp.task('clean', function(callback) {
  return del(['deploy'], callback);
});
gulp.task('create', function(callback) {
  runSequence('copy:html', 'copy:css', 'copy:js', 'copy:images', callback);
});
