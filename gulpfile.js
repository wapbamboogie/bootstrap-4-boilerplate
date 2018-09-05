"use strict";

var gulp = require('gulp'),
	  concat = require('gulp-concat'),
	  uglify = require('gulp-uglify'),
	  rename = require('gulp-rename'),
	  sass = require('gulp-sass'),
	  maps = require('gulp-sourcemaps'),
	  del = require('del'),
	  autoprefixer = require('gulp-autoprefixer'),
	  browserSync = require('browser-sync').create(),
	  htmlreplace = require('gulp-html-replace'),
	  cssmin = require('gulp-cssmin');

gulp.task("concatScripts", function() {
	return gulp.src([
		'assets/js/vendor/jquery-3.3.1.min.js',
		'assets/js/vendor/popper.min.js',
		'assets/js/vendor/bootstrap.min.js',
		'assets/js/vendor/owl.carousel.min.js',
		'assets/js/functions.js'
	])
		.pipe(maps.init())
		.pipe(concat('main.js'))
		.pipe(maps.write('./'))
		.pipe(gulp.dest('assets/js'))
		.pipe(browserSync.stream());
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("assets/js/main.js")
	  .pipe(uglify())
	  .pipe(rename('main.min.js'))
	  .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('compileSass', function() {
  return gulp.src(["assets/css/main.scss"])
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task ('font-css', function() {
	return gulp.src('assets/css/6-fonts/**')
	.pipe(gulp.dest('dist/assets/css/fonts'));
});

gulp.task ('owl-css', function() {
	return gulp.src('assets/css/owl.carousel.min.css')
	.pipe(gulp.dest('dist/assets/css/owl/'));
});

gulp.task("minifyCss", ["compileSass"], function() {
  return gulp.src(["dist/assets/css/main.css"])
    .pipe(cssmin())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('dist/assets/css'))
});

gulp.task('watchFiles', function() {
    gulp.watch('assets/css/**/*.scss', ['minifyCss']);
        gulp.watch('assets/js/*.js', ['concatScripts']);
        gulp.watch('*.html', [ 'build']);
})

gulp.task('clean', function() {
  del(['dist', 'assets/css/main.min.css*', 'assets/js/main*.js*']);
});

gulp.task('renameSources', function() {
    return gulp.src(['*.html', '*.php'])
        .pipe(htmlreplace({
        'js': 'assets/js/main.min.js',
        'css': 'assets/css/main.min.css'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task("build", ['minifyScripts', 'minifyCss', 'font-css', 'owl-css'], function() {
    return gulp.src([
		'*.html',
		'*.php',
		'favicon.ico',
		"assets/img/**"
	], { base: './'})
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles'], function(){
    browserSync.init({
        server: "./dist"
    });

	gulp.watch("assets/css/**/*.scss", ['watchFiles']);
	
    gulp.watch('*.html').on('change', ['clean','build',browserSync.reload]);
});

gulp.task("default", ["clean", 'build'], function() {
    gulp.start('renameSources');
});
