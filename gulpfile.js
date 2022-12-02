const {src, dest} = require('gulp')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include') // пакет, отвечающий за соединения данных файлов
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const sync = require('browser-sync').create()

function html() {
    return src('src/**.html')  // читай все файлв с расширением html 
        .pipe(include({
            prefix: '@@'
        }))
        .pipe(dest('dist'))
}

exports.html = html