var gulp=require('gulp');
var plugins=require('gulp-load-plugins')();
var bowerFiles=require('main-bower-files');


var paths = {
	scripts: './src/**/*.js',

  styles: './src/**/*.css',
  less:'./src/**/*.less',
  stylesDir:'./src/styles',
  
  images: './images/**/*',
  index: './src/index.html',

	partials: ['./src/**/*.html', '!src/index.html'],
	partialsDir: './src/partials',
	
	dist:'./dist'
};

/** Shared Functions **/
var sharedPipes = {};
sharedPipes.injectBower = function() {
	var files = gulp.src(bowerFiles(), {read:false});
	var options = {name:'bower', relative:true};
	
	return plugins.inject(files, options);
};

sharedPipes.angularSort = function() {
	return gulp.src(paths.scripts).pipe(plugins.angularFilesort());
};

gulp.task('lint-js', function() {
	return gulp.src([paths.scripts, './*.js'])
	.pipe(plugins.jshint())
	.pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('compile-less', function() {
	return gulp.src(paths.less)
	.pipe(plugins.less())
	.pipe(gulp.dest(paths.stylesDir))
	.pipe(plugins.connect.reload());
});

/** Convert HTML2JS **/
gulp.task('html2js-dev', function() {
	return gulp.src(paths.partials)
	.pipe(plugins.ngHtml2js({
		moduleName: "magicMirrorPartials"
		//stripPrefix: 'partials/'
	}))
	.pipe(plugins.concat('partials.js'))
	.pipe(gulp.dest(paths.partialsDir))
	.pipe(plugins.connect.reload());
});

/** INJECT TASKS **/
gulp.task('inject-dev', function() {

	return gulp.src(paths.index)
	.pipe(gulp.dest(paths.dist))
	// Inject bower
	.pipe(sharedPipes.injectBower())
	// Inject styles
	.pipe(
		plugins.inject(gulp.src(paths.styles, {read:false}), {name: 'app', relative:true})
	)
	// Inject sorted app files
	.pipe(
		plugins.inject(sharedPipes.angularSort(), {name: 'app', relative:true})
	)
	.pipe(gulp.dest(paths.dist))
	.pipe(plugins.connect.reload());
});

/** SERVE TASK **/
gulp.task('connect', function() {
  plugins.connect.server({
    root: '.',
    port: '3000',
    livereload: true
  });
});


gulp.task('watch', function() {
	gulp.watch(paths.scripts, ['lint-js', 'inject-dev']);
	gulp.watch(paths.styles, ['compile-less', 'inject-dev']);
	gulp.watch(paths.partials, ['html2js-dev', 'inject-dev']);
	gulp.watch(paths.index, ['inject-dev']);
});

/** DEV BUILD **/
gulp.task('build-dev', ['lint-js','html2js-dev', 'compile-less', 'inject-dev']);

gulp.task('default',['build-dev', 'connect', 'watch']);