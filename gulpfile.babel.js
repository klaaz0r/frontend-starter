'use strict'

const gulp = require('gulp')
const clean = require('gulp-clean')
const gutil = require('gulp-util')
const webpack = require('gulp-webpack')
const webpackConfig = require('./webpack.config.js')
const browserSync = require('browser-sync').create()
const stylus = require('gulp-stylus')
const htmlmin = require('gulp-htmlmin')
const less = require('gulp-less')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')

gulp.paths = {
    app: 'app',
    semantic: 'semantic',
    styles: 'styles',
    dist: 'dist'
}

gulp.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'develop'

const isProd = gulp.environment !== 'develop'
const isDev = gulp.environment === 'develop'

gutil.log('build environment', gutil.colors.magenta(gulp.environment))

gulp.task('default', ['clean'], () => {
    gulp.start('serve')
})

gulp.task('build:prod', ['clean'], () => {
    gulp.start('build')
})

gulp.task('build', ['html', 'scripts', 'semantic', 'styles'])

gulp.task('clean', () => {
    return gulp.src(gulp.paths.dist, { read: false })
        .pipe(clean())
})

gulp.task('scripts', () => {
    return gulp.src(gulp.paths.app)
        .pipe(webpack(webpackConfig))
        .pipe(gulpif(isProd, uglify()))
        .pipe(gulp.dest(gulp.paths.dist))
        .pipe(gulpif(isDev, browserSync.stream()))
})

gulp.task('serve', ['build'], () => {
    browserSync.init({ server: { baseDir: gulp.paths.dist } })
    gulp.watch([gulp.paths.app + '/**/*.js'], ['scripts'])
    gulp.watch([gulp.paths.styles + '/**/*.styl'], ['styles'])
    gulp.watch([gulp.paths.app + '/**/*.html'], ['html'])
    gulp.watch([gulp.paths.semantic + '/**/*.*'], ['semantic'])
})

gulp.task('html', () => {
    return gulp.src(gulp.paths.app + '/*.html')
        .pipe(gulpif(isProd, htmlmin({ collapseWhitespace: true })))
        .pipe(gulp.dest(gulp.paths.dist))
})

gulp.task('semantic', () => {
    return gulp.src(gulp.paths.semantic + '/semantic.less')
        .pipe(less())
        .pipe(gulpif(isProd, cleanCSS({ compatibility: 'ie8' })))
        .pipe(gulp.dest(gulp.paths.dist))
        .pipe(gulpif(isDev, browserSync.stream()))
})

gulp.task('styles', () => {
    return gulp.src(gulp.paths.styles + '/main.styl')
        .pipe(stylus())
        .pipe(gulpif(isProd, cleanCSS({ compatibility: 'ie8' })))
        .pipe(gulp.dest(gulp.paths.dist))
        .pipe(gulpif(isDev, browserSync.stream()))
})
