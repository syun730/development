const gulp = require('gulp')
const sass = require('gulp-sass')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const ejs = require('gulp-ejs')
const browserSync = require('browser-sync').create()
const sassGlob = require('gulp-sass-glob')
const uglify = require('gulp-uglify-es').default
const through2 = require('through2')
const del = require('del')

// gulp.task('html', cb => {
//   return gulp
//     .src([
//       'src/html/**/*.html',
//       '!src/html/_includes/**/*'
//     ])
//     .pipe(gulp.dest('./public'))
//     .pipe(browserSync.stream())
// })

gulp.task('ejs', cb => {
  return gulp
    .src([
      './src/ejs/**/*.ejs',
      '!./src/ejs/_includes/**/*',
      '!./src/ejs/**/_*.ejs'
    ])
    .pipe(ejs())
    .pipe(rename({ extname: '.html' }))
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
      baseDir: './public',
      directory: true
    },
    port: 8888,
    ghostMode: true,
    open: true,
    notify: false
  })
  // gulp.watch('./src/html/**/*', gulp.task('html'))
  gulp.watch('./src/ejs/**/*', gulp.task('ejs'))
  gulp.watch('./src/scss/**/*', gulp.task('sass'))
  gulp.watch('./src/js/**/*', gulp.task('js'))
  gulp.watch('./src/media/**/*', gulp.task('media'))
})

gulp.task('clean', done => {
  del.sync('./public');
  done();
})

gulp.task('build', gulp.parallel('ejs', 'sass', 'js', 'media'))
gulp.task('start', gulp.series('build', 'serve'))
gulp.task('clean', gulp.series('clean', gulp.parallel('ejs', 'sass', 'js', 'media')))
