"use strict"

const {src, dest} = require('gulp') // dest нужна для того, чтобы записать этот файл в папку dest
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')
const cssbeautify = require('gulp-cssbeautify')
const removeComments = require('gulp-strip-css-comments')
const rename = require('gulp-rename')
const cssnano = require('gulp-cssnano')
const uglify = require('gulp-uglify')
const plumber = require('gulp-plumber')
const panini = require('panini')
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync').create()

/* Paths (Пути) */

const srcPath = 'src/'
const distPath = 'dist/'

const path = {
    build: {
        html: distPath, // build - то, что будет получаться у нас на выходе (там, где все сжато)
        css: distPath + 'assets/css/',
        js: distPath + 'assets/js/',
        iamges: distPath + 'assets/images/',
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
        images: srcPath + 'assets/scss/**/*.{jpg, png, svg}',
        fonts: srcPath + 'assets/fonts/**/*.{eot, ttf, svg}'
    },
    clean: './' + distPath // clean нужен для того, чтобы очищать папку dist 
}

function html() {
    return src(path.src.html, { base: srcPath }) // добавляем base, он нужен для того, чтобы если у нас будут проекты огромные и он выведет ошибку в path.src.html, то base все исправит
        .pipe(dest(path.build.html)) // метод pipe выполняют какую-либо задачу 
}

exports.html = html // для каждой функции нужно прописывать exports, чтобы все заработало 