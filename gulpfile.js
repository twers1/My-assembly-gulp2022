"use strict"

const {src, dest} = require('gulp') // dest нужна для того, чтобы записать этот файл в папку dest
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const del = require('del') // метод del очищает файлы(удаляет)
const autoprefixer = require('gulp-autoprefixer')
const cssbeautify = require('gulp-cssbeautify') // метод cssbeautify делает css красивей
const removeComments = require('gulp-strip-css-comments') // метод removeComments удаляет комментарии
const rename = require('gulp-rename') // метод rename переменовывает файлы, чтобы отличать минифицированный и неминифицированный 
const cssnano = require('gulp-cssnano') // метод cssnano делает уменьшенный css файл 
const uglify = require('gulp-uglify') // метод uglify делаетт уменьшенный js файл, т.е работает как cssnano
const plumber = require('gulp-plumber') // метод plumber предотвращает ошибки 
const panini = require('panini')
const imagemin = require('gulp-imagemin') // метод imagemin сжимает картинки
const rigger = require('gulp-rigger') // метод rigger собирает все файлы js воедино 
const browserSync = require('browser-sync').create()


/* Paths (Пути) */

const srcPath = 'src/'
const distPath = 'dist/'

const path = {
    build: {
        html: distPath, // build - то, что будет получаться у нас на выходе (там, где все сжато)
        css: distPath + 'assets/css/',
        js: distPath + 'assets/js/',
        images: distPath + 'assets/images/',
        fonts: distPath + 'assets/fonts/'

    },
    src: { // пути к файлам
        html: srcPath + '*.html',
        css: srcPath + 'assets/scss/*.scss',
        js: srcPath + 'assets/js/*.js',
        images: srcPath + 'assets/images/**/*.{ipeg, png, svg}',
        fonts: srcPath + 'assets/fonts/**/*.{eot, ttf, svg}'
    },
    watch: { // watch нужен для того, чтобы gulp знал какими файлами нужно следить(чтобы своевременно обновлять - reallife)
        html: srcPath + '**/*.html',
        js: srcPath + 'assets/js/**/*.js',
        css: srcPath + 'assets/scss/**/*.',
        images: srcPath + 'assets/scss/**/*.{jpg,png,svg}',
        fonts: srcPath + 'assets/fonts/**/*.{eot,ttf,svg}'
    },
    clean: './' + distPath // clean нужен для того, чтобы очищать папку dist 
}

/* Tasks */

// Task for servers
function serve() {
    browserSync.init({
        server: {
            baseDir: "./" + distPath
        }
    });
}

// Task HTML
function html() {
    return src(path.src.html, { base: srcPath }) // добавляем base, он нужен для того, чтобы если у нас будут проекты огромные и он выведет ошибку в path.src.html, то base все исправит
        .pipe(plumber())
        .pipe(dest(path.build.html)) // метод pipe выполняют какую-либо задачу 
        .pipe(browserSync.reload({stream: true})) // перезапускает сервер; stream:true - браузер работает
}

// Task CSS
function css() {
    return src(path.src.css, { base: srcPath + 'assects/scss/'}) 
        .pipe(plumber())
        .pipe(sass()) // компилируем css файлы в scss
        .pipe(autoprefixer()) // проставляет префиксы
        .pipe(cssbeautify())
        .pipe(dest(path.build.css))
        .pipe(cssnano({
            zindex: false, // метод cssnano кроме сокращения файла использует zindex для того, чтобы регулировать отображения ↓
            discardComments: { //  по верх чего-то, и из-за этого может сломаться ваша верстка, поэтому лучше отключать данную фукнцию 
                removeAll: true // discardComments позволяет убирать все комментарии в минифицированном файле 
            }
        }))
        .pipe(removeComments())
        .pipe(rename({
            suffix: '.min', // суффикс, который будет после отображать минифицированный файл 
            extname: '.css' // extname - расширение файла

        }))
        .pipe(dest(path.build.css))
        .pipe(browserSync.reload({stream: true}))
}

// Task JS 
function js(){
    return src(path.src.js, { base: srcPath + 'assects/js/'}) 
        .pipe(plumber())
        .pipe(rigger())
        .pipe(dest(path.build.js))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min',
            extname: '.js'
        }))
        .pipe(dest(path.build.js))
        .pipe(browserSync.reload({stream: true}))
}

// Task Image
function images() {
    return src(path.src.images, { base: srcPath + 'assects/images/'}) 
        .pipe(imagemin())
        .pipe(dest(path.build.images))
        .pipe(browserSync.reload({stream: true}))
}

// Task Очистка всех файлов
function clean() {
    return del(path.clean)
}

// Task fonts 
function fonts() {
    return src(path.src.fonts, { base: srcPath + 'assects/fonts/'})
    .pipe(browserSync.reload({stream: true}))
}

// Task for watch
function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.images], images)
    gulp.watch([path.fonts.js], fonts)
}

// Настройка build и watch(чтобы все запускалось по очереди)
const build = gulp.series(clean, gulp.parallel(html, css, js, images, fonts)) // parallel - делает одновременно все действия, series - запускает по очереди 
const watch = gulp.parallel(build, watchFiles, serve)

// Для каждой функции нужно прописывать exports, чтобы все заработало 
exports.html = html 
exports.css = css 
exports.js = js
exports.images = images
exports.clean = clean
exports.fonts = fonts
exports.build = build 
exports.watch = watch
exports.default = watch
