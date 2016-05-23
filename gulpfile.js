var gulp = require("gulp");
var gulpTypings = require("gulp-typings");
var ts = require('gulp-typescript');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('installTypings', function () {
    return gulp.src("./typings.json")
        .pipe(gulpTypings());
});

gulp.task('compile', ['installTypings'], function () {
    return gulp
    .src(["lib/**/*.ts", 'typings/index.d.ts'])
    .pipe(ts(tsProject))
    .js
    .pipe(gulp.dest("lib"))
});

gulp.task('build', ["compile"], function () {  
    return gulp
    .src(["*.ts", 'typings/index.d.ts'])
    .pipe(ts(tsProject))
    .js
    .pipe(gulp.dest("."))
});
