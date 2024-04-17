const gulp = require("gulp");
const { src, dest, task, parallel, watch, series } = gulp;
const fs = require("fs");
const server = require("gulp-server-livereload");
const clean = require("gulp-clean");
const csso = require("gulp-csso");
const sourceMaps = require("gulp-sourcemaps");
const changed = require("gulp-changed");

gulp.task("clean", function (done) {
  if (fs.existsSync("./dist/")) {
    return src("./dist/", { read: false }).pipe(clean({ force: true }));
  }
  done();
});

gulp.task("html", function () {
  return src(["./src/*.html"])
    .pipe(changed("./dist/"))
    .pipe(gulp.dest("./dist/"));
});
gulp.task("css", function () {
  return src("./src/*.css")
    .pipe(changed("./dist/"))
    .pipe(sourceMaps.init())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./dist/"));
});
gulp.task("images", function () {
  return src(["./src/images/**/*"])
    .pipe(changed("./dist/images/"))
    .pipe(dest("./dist/images/"));
});

task("server", function () {
  return src("./dist/").pipe(
    server({
      livereload: true,
      open: true,
    })
  );
});

task("watch", function () {
  watch("./src/*.css", parallel("css"));
  watch("./src/**/*.html", parallel("html"));
  watch("./src/images/**/*", parallel("images"));
});

task(
  "default",
  series(
    "clean",
    parallel("html", "css", "images"),
    parallel("server", "watch")
  )
);
