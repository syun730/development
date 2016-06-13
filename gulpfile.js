var
gulp = require('gulp'),
browserSync = require('browser-sync').create(),
plumber = require('gulp-plumber'),
sass = require('gulp-sass'),
rename = require('gulp-rename'),
changed = require('gulp-changed'),
cached = require('gulp-cached'),
imagemin = require('gulp-imagemin'),
del = require('del'),
mergeMediaQueries = require('gulp-merge-media-queries'),
sourcemaps = require('gulp-sourcemaps'),
runSequence = require('run-sequence'),
csscomb = require('gulp-csscomb'),
cssmin = require('gulp-clean-css'),
autoprefixer = require('gulp-autoprefixer')
;

// サーバー・ブラウザ自動更新
gulp.task('server', function() {
  browserSync.init({
    server: {
      baseDir: ['.tmp', 'dev'],
      directory: false
    },
    port: 8888,
    ghostMode: true,
    open: false,
    notify: false
  });
  // ファイル監視
  gulp.watch('dev/**/*.html').on('change', browserSync.reload);
  gulp.watch('dev/assets/sass/**/*.scss', ['sass']);
  gulp.watch('dev/scripts/**/*.js', ['js']);
});

// html
// gulp.task('html', function() {
//   gulp.src('dev/**/*.html')
//   .pipe(plumber())
//   .pipe(cached('dev'))
//   .pipe(gulp.dest('.tmp'))
//   .pipe(browserSync.reload({stream:true}));
// });

// scss
gulp.task('sass', function() {
  gulp.src('dev/assets/sass/**/*.scss')
  .pipe(plumber())
  .pipe(changed('dev'))
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded'
  }))
  .pipe(mergeMediaQueries())
  .pipe(autoprefixer({
    browsers: 'last 2 versions'
  }))
  .pipe(csscomb())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.tmp/assets/styles/'))
  .pipe(browserSync.stream());
});

// js
gulp.task('js', function() {
  gulp.src('dev/assets/scripts/**/')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('.tmp/assets/scripts/'))
  .pipe(browserSync.stream());
});

// Copy html
gulp.task('copy:html', function () {
  return gulp.src('dev/**/*.html')
  .pipe(gulp.dest('deploy'));
});

// Copy css
gulp.task('copy:css', function () {
  return gulp.src('.tmp/assets/styles/*.css')
  .pipe(cssmin())
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
gulp.task('default', ['server', 'sass']);

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
