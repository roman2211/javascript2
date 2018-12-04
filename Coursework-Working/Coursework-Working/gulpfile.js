var gulp = require('gulp'),
    useref = require('gulp-useref'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    gulpif = require('gulp-if'),
    minifyCSS = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    runSequence = require('run-sequence'),
    cache = require('gulp-cache');

gulp.task('pressFiles', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCSS()))
    // .pipe(gulpif('*.css', minifyCSS({processImport: false})))
    .pipe(gulpif('*.css', autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })))
    .pipe(gulp.dest('dist'))
    // .pipe(notify('Done!'));
});

gulp.task('images', function () {
  gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // кэширование изображений, прошедших через imagemin
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/img'))
});

gulp.task('clean', function () {
  del('dist/**/*');
});

gulp.task('cleanNotImg', function () {
  del(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

gulp.task('fonts', function () {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
});

gulp.task('libs', function () {
  return gulp.src('app/libs/**/*')
    .pipe(gulp.dest('dist/libs'))
});

gulp.task('build', function () {
  runSequence('cleanNotImg', ['pressFiles', 'images', 'fonts', 'libs']);
});

