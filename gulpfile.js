const gulp = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const cleanCSS = require("gulp-clean-css");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
const ts = require("gulp-typescript");
const sourcemaps = require("gulp-sourcemaps");

// Flytta HTML-filer till pub
gulp.task("copyhtml", function() {
    return gulp.src([
        "src/*.htm",
        "src/*.html"])
        .pipe(gulp.dest("pub/"));
});

// Flytta php-filer till pub
gulp.task("copyphp", function() {
    return gulp.src("src/*.php")
    .pipe(gulp.dest("pub/"));
});

// Flytta HTML-filer till undermapp i pub
gulp.task("copyhtmltofolder", function() {
    return gulp.src([
        "src/htm/*.htm",
        "src/htm/*.html"])
        .pipe(gulp.dest("pub/htm"));
});

// Flytta php-filer till undermapp classes i pub
gulp.task("copyphptofolderclasses", function() {
    return gulp.src("src/classes/*.php")
    .pipe(gulp.dest("pub/classes"));
})

// Flytta php-filer till undermapp includes i pub
gulp.task("copyphptofolderincludes", function() {
    return gulp.src("src/includes/*.php")
    .pipe(gulp.dest("pub/includes"));
})

// Kompilerar typescript
gulp.task("compilets", function() {
    return gulp.src("src/ts/*.ts")
        .pipe (ts({
            noImplicitAny: true,
            outFile: 'fromTS.js'
        }))
        .pipe(gulp.dest('src/js'));
});

// Slå ihop och minimera JavaScript
gulp.task("concominjs", function() {
    return gulp.src("src/js/*.js")
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("pub/js"));
});

// Slå ihop och minimera CSS
gulp.task("concomincss", function() {
    return gulp.src("src/css/*.css")
        .pipe(concat("style.min.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest("pub/css"));
});

// Konvertera SASS till CSS
gulp.task("convertsass", function() {
    return gulp.src('src/sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('src/css'));
});

// Förminskar bilder
gulp.task("minifyimg", function() {
    return gulp.src("src/img/*")
        .pipe(imagemin())
        .pipe(gulp.dest("pub/img"));
});

// Kontrollerar ändringar gjorda till filer
gulp.task("watcher", function() {
    gulp.watch("src/images/*", ['minifyimg']);
    gulp.watch("src/ts/*ts", ['compilets']);
    gulp.watch("src/sass/**/*.scss", ['convertsass']);
    gulp.watch("src/*.htm", ['copyhtml']);
    gulp.watch("src/*.html", ['copyhtml']);
    gulp.watch("src/*.php", ['copyphp']);
    gulp.watch("src/includes/*.php", ['copyphptofolderincludes']);
    gulp.watch("src/classes/*.php", ['copyphptofolderclasses']);
    gulp.watch("src/htm/*.htm", ['copyhtmltofolder']);
    gulp.watch("src/htm/*.html", ['copyhtmltofolder']);
    gulp.watch("src/js/*.js", ['concominjs']);
    gulp.watch("src/css/*.css", ['concomincss']);
});

// Startar tasks och watcher
gulp.task("default", ["minifyimg", "compilets", "convertsass", "copyhtml", "copyhtmltofolder", "copyphptofolderclasses", "copyphptofolderincludes", "concominjs", "concomincss", "watcher"]);