const gulp = require("gulp");
const clean = require("gulp-clean");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");
const uglify = require("gulp-uglify");
const tsProject = ts.createProject("tsconfig.json");

// Task: ล้าง dist ก่อนเริ่ม
gulp.task("clean", function () {
  return gulp
    .src(["dist/**/*"], { read: false, allowEmpty: true })
    .pipe(clean());
});

// Task: Compile + Uglify + SourceMap
gulp.task("compile", function () {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .js.pipe(uglify()) // ต้องใส่ .js เพราะ tsProject() ให้ทั้ง .js และ .d.ts
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist"));
});

// Default task: clean ก่อน แล้ว compile
gulp.task("default", gulp.series("clean", "compile"));
