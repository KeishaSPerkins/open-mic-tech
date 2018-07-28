var gulp = require('gulp'), 
		sass = require('gulp-sass'),
		uglify = require('gulp-uglify'),
		pump = require('pump'),
		responsive = require('gulp-responsive'),
		runSequence = require('run-sequence');


gulp.task("sass", function(){
	return gulp.src('src/sass/style.sass')
		.pipe(sass())
		.pipe(gulp.dest('static/css'))
});

gulp.task('jsconcat', function (cb) {
  pump([
        gulp.src('src/js/*.js'),
        uglify(),
        gulp.dest('static/js')
    ],
    cb
  );
});

gulp.task('img', function(){
	gulp.src("src/img/**.*")
    .pipe(responsive({
      "*": [{
        width: 480,
        rename: {suffix: "-sm"},
      }, {
        width: 480 * 2,
        rename: {suffix: "-sm@2x"},
      }, {
        width: 675,
      }, {
        width: 675 * 2,
        rename: {suffix: "@2x"},
      }],
    }, {
      silent: true      // Don't spam the console
    }))
    .pipe(gulp.dest("static/img")
);
});

gulp.task("img:build", ["img"], function() {
  gulp.src(["static/img/*.{jpg,png,gif,svg}"])
    .pipe(imagemin([
      imagemin.gifsicle(),
      imagemin.optipng(),
      imagemin.svgo(),
      mozjpeg(),
    ]))
    .pipe(gulp.dest("static/img"))
    }
);

gulp.task("watch", function(){
	gulp.watch("src/sass/*.sass", ['sass']);
	gulp.watch("src/js/*.js", ['jsconcat']);
});

gulp.task('build', function (callback) {
  runSequence('sass', 'jsconcat', 'img:build', callback);
});

gulp.task('default', function (callback) {
  runSequence('sass','jsconcat', 'watch', callback);
});