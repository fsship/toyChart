var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('check', function() {
    return gulp.src('./src/*.js').pipe(jshint()).pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
    return gulp.src('./src/*.js').pipe(concat('chart.js')).pipe(gulp.dest('./build')).pipe(rename('chart.min.js')).pipe(uglify()).pipe(gulp.dest('./build'));
});

gulp.task('default', function () {
    gulp.start('check', 'build');
    gulp.watch('./src/*.js', function() {
        gulp.start('check', 'build');
    });
});
