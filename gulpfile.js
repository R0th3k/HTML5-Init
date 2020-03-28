let gulp = require("gulp");
//sass-css
let sass = require("gulp-dart-sass");
let prefix = require('gulp-autoprefixer');
//js
let babel = require('gulp-babel');
let gulpif = require('gulp-if');
let uglify = require('gulp-uglify');
let concat = require('gulp-concat');
let gutil = require('gulp-util');
//otros
let sourcemaps = require('gulp-sourcemaps');
let notify = require('gulp-notify');
let browserSync = require('browser-sync').create();

let paths = {
  base: './',
  dist: './dist',
  proxy:'http://localhost/',
  js : {
    src: 'src/js/**/*.js',
    dest: 'dist/assets/js'
  },
  sass:{
    src: 'src/sass/**/*.scss',
    dest: 'dist/assets/css'
  },
  html:{
    src: 'src/**/*.html',
  }
}

function server() {
  return(
    browserSync.init({   
      //proxy: paths.proxy,
      server: {
          baseDir: paths.dist
      }
    })
  )
}

function html() {
  return(
    gulp
      .src(paths.html.src)
      .pipe(gulp.dest(paths.dist))
      .pipe(browserSync.reload({stream: true}))
      .pipe(notify({ message: 'Tarea Completada: HTML' }))
  )
}

function styles() {
  return (
      gulp
          .src(paths.sass.src)
          .pipe(sass({
            outputStyle: 'compressed'
          }))
          .pipe(sourcemaps.init())
          .on('error', sass.logError)
          .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {
            cascade: true
          }))
          .pipe(sourcemaps.write(paths.base))
          .pipe(gulp.dest(paths.sass.dest))
          .pipe(browserSync.reload({stream: true}))
          .pipe(notify({ message: 'Tarea Completada: Estilos' }))
  );
}

function js(){
    return(
      gulp
        .src('./src/js/main.js')
        .pipe(babel())
        .pipe(gulpif(gutil.env.env == 'prod',uglify()))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('assets/js'))
        .pipe(notify({ message: 'Tarea Completada: js' }))
    );
  }

function jsmin(){
  return(
    gulp
      .src(paths.js.src)
      .pipe(sourcemaps.init())
      .pipe(concat('main.min.js')) //the name of the resulting file
      .pipe(uglify())
      .pipe(sourcemaps.write(paths.base))
      .pipe(gulp.dest(paths.js.dest)) //the destination folder
      .pipe(browserSync.reload({stream: true}))
      .pipe(notify({ message: 'Tarea Completada: jsmin' }))
  );
}

function reload(){
  return(
    browserSync.reload()
  )
}

function watchFiles() {
  gulp.watch(paths.sass.src, styles);
  gulp.watch(paths.js.src, jsmin);
  gulp.watch(paths.html.src, html);
 
}

const watch = gulp.parallel(html, server, watchFiles);

exports.server = server;
exports.styles = styles;
exports.js = js;
exports.jsmin = jsmin;
exports.watch = watch;
exports.default = watch;