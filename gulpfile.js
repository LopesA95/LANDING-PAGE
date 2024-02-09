const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify");

// Function to minify JavaScript files
function scripts() {
  return gulp
    .src("./src/scripts/**/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("./dist/scripts"));
}

// Function to compile Sass files and minify CSS
function compileStyles() {
  return gulp
    .src("./src/styles/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream()); // Stream changes to browserSync for CSS injection
}

// Function to optimize images
function optimizeImages() {
  return gulp
    .src("./src/assets/**/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/assets"));
}

// Function to watch files for changes and trigger appropriate tasks
function watchFiles() {
  // Initialize browserSync server
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });

  // Watch Sass files for changes and trigger compilation
  gulp.watch("./src/styles/**/*.scss", compileStyles);

  // Watch image files for changes and trigger optimization
  gulp.watch("./src/assets/**/*", optimizeImages);

  // Reload the browser when HTML files change
  gulp.watch("./*.html").on("change", browserSync.reload);

  // Watch JavaScript files for changes and trigger minification
  gulp.watch("./src/scripts/*.js", scripts);
}

// Default task to run all tasks in parallel
exports.default = gulp.parallel(compileStyles, optimizeImages, scripts);

// Task to watch files for changes
exports.watch = watchFiles;
