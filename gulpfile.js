// Dependencies
// -------------------------
require("./environment");
var gulp = require('gulp');
var bower = require('gulp-bower');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var rename = require('gulp-rename');
var del = require('del');
var gulpuglify = require('gulp-uglify');
var hbsfy = require('hbsfy');
var pathmodify = require('pathmodify');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var prefix = require('gulp-autoprefixer');
var concat = require('gulp-concat');

// Tasks
// -------------------------

// Only uglify if not in development
var uglify = function () {
    return gulpif(process.env.NODE_ENV !== 'development', gulpuglify());
};

// Build tasks
gulp.task('browserify', function () {
    var b = browserify('./src/lib/app.js', {debug: true});
    return b.transform(hbsfy)

        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('collections', './../collections')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('contexts', './../contexts')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('controllers', './../controllers')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('dispatchers', './../dispatchers')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('enums', './../enums')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('lib', './../lib')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('mappers', './../mappers')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('models', './../models')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('repositories', './../repositories')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('routers', './../routers')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('services', './../services')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('templates', './../templates')]})
        .plugin(pathmodify(), {mods: [pathmodify.mod.dir('views', './../views')]})
        .bundle()
        .pipe(source('app.browserified.js'))
        .pipe(gulp.dest('./build'))
});

gulp.task('minify', ['styles'], function () {
    return gulp.src('./build/css/index.bundled.css')
        .pipe(minifyCSS())
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('./public/css'))
});

gulp.task('uglify', function () {
    return gulp.src('build/app.browserified.js')
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('./public/js'));
});

// Style tasks
gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest('bower_components'))
});

gulp.task('icons', function () {
    return gulp.src('bower_components/font-awesome/fonts/**.*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('styles', function () {
    return gulp.src('src/scss/index.scss')
        .pipe(sass({
            style: 'expanded',
            includePaths: [
                'bower_components/foundation/scss',
                'bower_components/font-awesome/scss'
            ]
        })
            .on("error", notify.onError(function (error) {
                return "Error: " + error.message;
            })))
        .pipe(rename('index.bundled.css'))
        .pipe(gulp.dest('build/css'));
});

// Clean tasks
gulp.task('clean', ['cleanbuild'], function (done) {
    del(['./public/js', './public/css'], done)
});

gulp.task('cleanbuild', function (done) {
    del(['./build'], done)
});

// commands
//gulp.task('build', ['clean'], function (done) {
gulp.task('build', function (done) {
    return runSequence('browserify', 'icons', 'uglify', 'minify', 'cleanbuild', done);
});

gulp.task('watch', function (done) {
    return runSequence('build', function () {
        gulp.watch('./src/lib/**/*.js', ['build']);
        gulp.watch('./src/templates/*.hbs', ['build']);
        gulp.watch('./src/scss/**/*.scss', ['build']);
        done()
    })
});

gulp.task('dev', ['watch'], function () {
    nodemon({
        script: 'server.js',
        delay: 2500
    })
});