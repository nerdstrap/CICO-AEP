// Dependencies
// -------------------------
var gulp = require('gulp');
var bower = require('gulp-bower');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var del = require('del');
var source = require('vinyl-source-stream');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');

// Style tasks
gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components'))
});

gulp.task('icons', function () {
    return gulp.src('bower_components/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./src/fonts'));
});

gulp.task('styles', function () {
    return gulp.src(['src/scss/index.scss'])
        .pipe(sass({
            style: 'expanded'
        })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(gulp.dest('src/css'));
});

// Clean tasks
gulp.task('clean', function (done) {
    del(['./src/css'], done)
});
