const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const svgSprite = require('gulp-svg-sprite');


const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

function scripts() {
   return src([
      'app/js/main.js',
   ])
      .pipe(concat('main.min.js'))
      .pipe(uglify())
      .pipe(dest('app/js'))
      .pipe(browserSync.stream())
}

function styles() {
   return src('app/scss/style.scss')
      .pipe(concat('style.min.css'))
      .pipe(scss({ outputStyle: 'compressed' }))
      .pipe(dest('app/css'))
      .pipe(browserSync.stream())
}

function images() {
   return src([
      'app/images/src/*.*',
      '!app/images/src/*.svg'
   ])
      .pipe(newer('app/images'))
      .pipe(avif({ quality: 50 }))

      .pipe(src('app/images/src/*.*'))
      .pipe(newer('app/images'))
      .pipe(webp())

      .pipe(src('app/images/src/*.*'))
      .pipe(newer('app/images'))
      .pipe(imagemin())

      .pipe(dest('app/images'))
}

function sprite() {
   return src('app/images/*.svg')
      .pipe(svgSprite({
         mode: {
            stack: {
               sprite: '../sprite.svg'
            }
         }
      }))
      .pipe(dest('app/images'))
}


function watching() {
   browserSync.init({
      server: {
         baseDir: "app/"
      }
   });

   watch(['app/scss/style.scss'], styles)
   watch(['app/js/main.js'], scripts)
   watch(['app/images/src'], images)
   watch(['app/*.html']).on('change', browserSync.reload);
}


function cleanDist() {
   return src('dist')
      .pipe(clean())
}

function building() {
   return src([
      'app/css/style.min.css',
      'app/js/main.min.js',
      'app/images/*.*',
      '!app/images/*.svg',
      'app/images/sprite.svg',
      'app/**/*.html'
   ], { base: 'app' })
      .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.building = building;
exports.images = images;
exports.sprite = sprite;


exports.build = series(cleanDist, building);
exports.default = parallel(styles, images, scripts, watching);


