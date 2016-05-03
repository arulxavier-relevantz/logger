var gulp = require("gulp");
var gulpTypings = require("gulp-typings");
var ts = require('gulp-typescript');

gulp.task("default", ["installTypings", "compile", "compileIndex"]);

gulp.task("compile", function () {
  return gulp
    .src("lib/**/*.ts")
    .pipe(ts({
        module: "commonjs",
        target: "ES5",
        sourcemap: false,
        logErrors: true
    }))
    .pipe(gulp.dest("lib"))
});

gulp.task("compileIndex", function () {
  return gulp
    .src("*.ts")
    .pipe(ts({
        module: "commonjs",
        target: "ES5",
        sourcemap: false,
        logErrors: true
    }))
    .pipe(gulp.dest("."))
});

gulp.task("installTypings",function(){
    gulp.src("./typings.json")
        .pipe(gulpTypings()); //will install all typingsfiles in pipeline.
});
