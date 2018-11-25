var gulp = require('gulp'),
    useref = require('gulp-useref'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    gulpif = require('gulp-if'),
    minifyCSS = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    runSequence = require('run-sequence');

gulp.task('pressFiles', function () {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCSS()))
    .pipe(gulpif('*.css', autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })))
    .pipe(gulp.dest('dist'))
    .pipe(notify('Done!'));
});

gulp.task('images', function () {
  gulp.src('app/img/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function () {
  del('dist');
});

gulp.task('clean:dist', function () {
  del(['dist/**/*', '!dist/img', '!dist/img/**/*']);
});

gulp.task('build', function () {
  runSequence('clean', ['pressFiles', 'images']);
});

