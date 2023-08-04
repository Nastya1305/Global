const { src, dest, watch, parallel, series } = require('gulp');

const scss = require('gulp-sass')(require('sass')); //для работы с scss
const concat = require('gulp-concat'); //для обьединения нескольких файлов в один и/или переименования файла
const uglify = require('gulp-uglify-es').default; //для минификации js
const browserSync = require('browser-sync').create(); // для автоматического обновления страницы браузера
const autoprefixer = require('gulp-autoprefixer'); // для поддержки css разными браузерами и их версиями
const clean = require('gulp-clean'); //для очистки директории
const svgSprite = require('gulp-svg-sprite');

// для работы с картинками
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

function scripts() {
   return src([
      'app/js/main.js',
   ])
      .pipe(concat('main.min.js')) //соединяет весь код из файлов src в main.min.js
      .pipe(uglify()) //минифицирует код
      .pipe(dest('app/js')) //помещает файл в папку
      .pipe(browserSync.stream()) //обновляет страницу браузера
}

function styles() {
   return src('app/scss/style.scss') //все доп. файлы scss подключаем внутрь этого файла
      .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] })) //заменяет css свойства для поддержки всеми браузерами
      .pipe(concat('style.min.css')) //тут просто переименовывает файл
      .pipe(scss({ outputStyle: 'compressed' })) //конвертация scss в css и минификация  
      .pipe(dest('app/css'))
      .pipe(browserSync.stream())
}

function images() {
   return src([ //все файлы из папки кроме svg файлов
      'app/images/src/*.*',
      '!app/images/src/*.svg'
   ])
      .pipe(newer('app/images')) //обрабатываем только те файлы, которых еще нет в папке
      .pipe(avif({ quality: 50 })) //создаст avif версии

      .pipe(src('app/images/src/*.*')) //webp не станет обрабатывать svg
      .pipe(newer('app/images'))
      .pipe(webp()) //создаст webp версии

      .pipe(src('app/images/src/*.*'))
      .pipe(newer('app/images'))
      .pipe(imagemin()) // минифицирует jpg и svg

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


//для слежки за изменениями
function watching() {
   //для локального сервера - обновление страницы при изменениях в коде
   browserSync.init({
      server: {
         baseDir: "app/"
      }
   });

   watch(['app/scss/style.scss'], styles) //при изменении в файлах вызываем функцию
   watch(['app/js/main.js'], scripts)
   watch(['app/images/src'], images)
   watch(['app/*.html']).on('change', browserSync.reload); //при изменении обновляем страницу браузера
}


//очистка dist директории (т.к. там будут оставаться файлы при удалении их из app)
function cleanDist() {
   return src('dist')
      .pipe(clean())
}

//сборка для продакшена
function building() {
   return src([ //поместить эти файлы в dist с файловой структурой как в app
      'app/css/style.min.css',
      'app/js/main.min.js',
      'app/images/*.*',
      '!app/images/*.svg',
      'app/images/sprite.svg',
      'app/**/*.html' //искать во всех папках html файлы
   ], { base: 'app' })
      .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.building = building;
exports.images = images;

//для отдельного использования чтобы создать спрайт или конвертировать шрифты
exports.sprite = sprite;

// series - последовательный вызов
//! для вызова сборки, в консоли - gulp build
exports.build = series(cleanDist, building);

// parallel - параллельный (одновременный) вызов
//! для разработки, в консоли - gulp
exports.default = parallel(styles, images, scripts, watching);




//! для работы со страницами (несколько html) смотри видео