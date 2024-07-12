import gulp from 'gulp';
import pkg from 'gulp'
const {src, dest} = pkg
import pug from 'gulp-pug';
import uglify from 'gulp-uglify'
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import GulpCleanCss from 'gulp-clean-css';


let paths = {
    build: {
        html: 'build/src/views/',
        js: 'build/src/scripts/',
        css: 'build/src/styles/',
        app: 'build/',
        json: 'build/src/json/'
    },
    src: {
        html: 'src/views/*.pug',
        js: 'src/scripts/*.js',
        style: 'src/styles/*.sass',
        app: '*.js',
        json: 'src/json/*.json'
    },
    watch: {
        html: 'src/views/*.pug',
        js: 'src/scripts/*.js',
        style: 'src/styles/*.sass',
        app: '*.js',
        json: 'src/json/*.json'
    }
}

gulp.task('style:build', function(){
        return src(paths.src.style)
            .pipe(sass())
            .pipe(GulpCleanCss())
            .pipe(gulp.dest(paths.build.css))
    }
)

gulp.task('html:build', function () {
    return gulp.src(paths.src.html)
        .pipe(gulp.dest(paths.build.html))
});

gulp.task('js:build', function () {
    return  gulp.src(paths.src.js)
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.js))
});

gulp.task('app:build', function () {
    return  gulp.src(paths.src.app)
        .pipe(uglify())
        .pipe(gulp.dest(paths.build.app))
});

gulp.task('json:build', function () {
    return  gulp.src(paths.src.json)
        .pipe(gulp.dest(paths.build.json))
});

gulp.task('watch', function(){
    gulp.watch(paths.watch.html, function(event, cb) {
        gulp.series('html:build');
    });
    gulp.watch(paths.watch.style, function(event, cb) {
        gulp.series('style:build');
    });
    gulp.watch(paths.watch.js, function(event, cb) {
        gulp.series('js:build');
    });
    gulp.watch(paths.watch.app, function(event, cb) {
        gulp.series('app:build');
    });
    gulp.watch(paths.watch.json, function(event, cb) {
        gulp.series('json:build');
    });
});

gulp.task('build', gulp.series(
    'html:build',
    'js:build',
    'style:build',
    'app:build',
    'json:build'
));

gulp.task('default',  gulp.series('build', 'watch'));
