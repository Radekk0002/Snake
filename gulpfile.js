const {watch, src, dest, series, parallel} = require("gulp");
const browserSync = require('browser-sync').create();
let reload = browserSync.reload;
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const autoPrefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const del = require("del");
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
const cssComb = require('gulp-csscomb');
const cmq = require('gulp-merge-media-queries');
const cleanCss = require('gulp-clean-css');
const jshint = require('gulp-jshint');
const uglify = require('gulp-uglify');
const minifyHtml = require('gulp-minify-html');


const config = {
    app: {
        js: [
            './src/js/**/*.js',
        ],
        sass: './src/style/**/*.sass',
        html: './src/*.html'
    },
    dist: {
        base: './dist/',
    },
    extraBundles: [
        './dist/main.js',
        './dist/main.css'
    ]
}

function cssTask(done){
    src(config.app.sass)
        .pipe(plumber({
            handleError: function(err){
                console.log(err);
                this.emit("end")
            }
        }))
        .pipe(sass({outputStyle: "expanded"}))
        .pipe(autoPrefixer('last 2 versions'))
        .pipe(cssComb())
        .pipe(cmq({log: true}))
        .pipe(rename({suffix: ".bundle"}))
        .pipe(cleanCss())
        .pipe(dest(config.dist.base))

    done();
}


function jsTask(done) {
    src(config.app.js)
        .pipe(plumber({
            handleError: function(err){
                console.log(err)
                this.emit("end")
            }
        }))
        .pipe(jshint())
        .pipe(jshint.reporter("default"))
        .pipe(babel({
            presets: ['@babel/preset-env',
        ]
            
        }))
        .pipe(rename({suffix: ".bundle"}))
        .pipe(uglify())
        .pipe(dest(config.dist.base))

    done()
}

function templateTask(done) {
    src(config.app.html)
        .pipe(plumber({
            handleError: function(err) {
                console.log(err)
                this.emit("end")
            }
        }))
        .pipe(minifyHtml())
        .pipe(dest(config.dist.base))
        
    done()
}

function watchTask() {
    watch(config.app.sass).on('change', series(cssTask, reloads));
    // watch(config.app.sass, series(cssTask, reload));
    watch(config.app.js).on("change", series(jsTask, reloads));
    // watch(config.app.js, series(jsTask, reload));
    watch(config.app.html).on("change", series(templateTask, reloads));
    // watch(config.app.html, series(templateTask, reload));
}

function liveReload(done){
    browserSync.init({
        server: {
            baseDir: config.dist.base
        }
    })

    done()
}

function reloads(done) {
    browserSync.reload()

    done()
}

function cleanUp() {
    return del([config.dist.base]);
}


exports.dev = parallel(cssTask, jsTask, templateTask, watchTask, liveReload);
exports.build = series(cleanUp, parallel(cssTask, jsTask, templateTask))