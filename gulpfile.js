var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var jsDirectory = ['js/**/*.js', '!js/vendor/**/*', '!js/compiled/**/*'];
var scssDirectory = ['css/**/*.scss', '!css/compiled/**/*'];

gulp.task('styles', stylesTask);
gulp.task('scripts', scriptsTask);
gulp.task('watch', watchTask);
gulp.task('default', ['styles', 'scripts'], defaultTask);

function defaultTask(done) {
  done();
}

function watchTask(done) {
  gulp.watch(scssDirectory, ['styles'])
  gulp.watch(jsDirectory, ['scripts'])
  done();
}

function stylesTask(done) {
  gulp.src(scssDirectory)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('application.css'))
    .pipe(gulp.dest('css/compiled/'));
  done()
}

function scriptsTask(done) {
  gulp.src(jsDirectory)
    .pipe(concat('application.js'))
    .pipe(gulp.dest('js/compiled/'));
  done();
}