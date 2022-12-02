"use strict"

const {src, dest} = require('gulp')
const gulp = require('gulp')
const sass = require('gulp-sass')(requare('sass'))
const del = require('del')
const autoprefixer = require('gulp-autoprefixer')
const cssbeautify = require('gulp-cssbeautify')
const removeComments = require('gulp-strip-css-comments')
const rename = require('gulp-rename')
const cssnano = require('gulp-cssnano')
const uglify = require('gulp-uglify')
const plumber = require('gulp-prumber')
const panini = require('panini')
const imagemin = require('gulp-imagemin')
const browserSync = require('browser-sync').create()

const path = {
    build: {
        html:'dist/', // build - то, что будет получаться у нас на выходе (там, где все сжато)
        css: 'dist/assets/css/',
        js: 'dist/assets/js/',
        
    }
}