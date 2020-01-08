<<<<<<< HEAD
const
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
spritesmith = require('gulp.spritesmith'),
styleguide = require('sc5-styleguide')
;
=======
const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const browserSync = require('browser-sync').create()
const sassGlob = require('gulp-sass-glob')
const uglify = require('gulp-uglify-es').default
const through2 = require('through2')
const del = require('del')
>>>>>>> master

gulp.task('html', cb => {
  return gulp
    .src([
      'src/html/**/*.html',
      '!src/html/_includes/**/*'
    ])
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream())
})

gulp.task('sass', cb => {
  return (
    gulp
      .src('./src/scss/**/*.scss')
      .pipe(sassGlob())
      .pipe(sourcemaps.init())
      .pipe(
        sass({
          outputStyle: 'compressed'
        }).on('error', sass.logError)
      )
      .pipe(autoprefixer({ grid: true }))
      .pipe(sourcemaps.write('.'))
      // タイムスタンプを書き換える
      .pipe(
        through2.obj((chunk, enc, callback) => {
          const date = new Date()
          chunk.stat.atime = date
          chunk.stat.mtime = date
          callback(null, chunk)
        })
      )
      .pipe(gulp.dest('./public/assets/css'))
      .pipe(browserSync.stream())
  )
})

gulp.task('js', cb => {
  return gulp
    .src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./public/assets/js'))
    .pipe(browserSync.stream())
})

gulp.task('media', cb => {
  return gulp
    .src('./src/media/**/*')
    .pipe(gulp.dest('./public/assets/media'))
    .pipe(browserSync.stream())
})

gulp.task('serve', cb => {
  browserSync.init({
    server: {
<<<<<<< HEAD
      baseDir: ['.tmp', 'dev'],
=======
      baseDir: './public',
>>>>>>> master
      directory: true
    },
    port: 8888,
    ghostMode: true,
    open: true,
    notify: false
<<<<<<< HEAD
  });
  // gulp.watch('dev/**/*.html').on('change', browserSync.reload);
  gulp.watch('dev/**/*.html', gulp.series('html'));
  gulp.watch('dev/assets/sass/**/*.scss', gulp.series('sass'));
  gulp.watch('dev/scripts/**/*.js', gulp.series('js'));
});

// styleguide
// gulp.task('styleguide', function() {
//   return gulp.src('dev/assets/sass/**/*.scss')
//   .pipe(styleguide.generate({
//     title: 'スタイルガイド',
//     server: true,
//     port: 4000,
//     rootPath: 'dev/styleguide',
//     overviewPath: 'dev/styleguide/overview.md',
//     appRoot: '/styleguide'
//   }))
//   .pipe(gulp.dest('./dev/styleguide'));
// });

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
  .pipe(gulp.dest('deploy/assets/styles/'));
});

// Copy js
gulp.task('copy:js', function () {
  return gulp.src('.tmp/assets/scripts/**/')
  .pipe(gulp.dest('deploy/assets/scripts/'));
});

// Copy images
gulp.task('copy:images', function () {
  return gulp.src('dev/assets/images/**/*.{png,jpg,gif,ico,eot,svg,ttf,woff}')
  .pipe(imagemin())
  .pipe(gulp.dest('deploy/assets/images/'));
});

// デフォルト
gulp.task('default', gulp.series('server', 'sass', 'html', 'sprite'));

// 納品用
gulp.task('build', gulp.series(clean, 'copy:images', 'copy:html', 'copy:css', 'copy:js'));

function clean(done) {
  del(['deploy']);
  done();
}
=======
  })
  gulp.watch('./src/html/**/*', gulp.task('html'))
  gulp.watch('./src/scss/**/*', gulp.task('sass'))
  gulp.watch('./src/js/**/*', gulp.task('js'))
  gulp.watch('./src/media/**/*', gulp.task('media'))
})

gulp.task('clean', done => {
  del.sync('./public');
  done();
})

gulp.task('build', gulp.parallel('html', 'sass', 'js', 'media'))
gulp.task('start', gulp.series('build', 'serve'))
gulp.task('clean', gulp.series('clean', gulp.parallel('html', 'sass', 'js', 'media')))
>>>>>>> master
