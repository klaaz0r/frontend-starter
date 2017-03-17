'use strict'

const gulp = require('gulp-help')(require('gulp'))

const clean = require('gulp-clean')
const gutil = require('gulp-util')
const sass = require('gulp-sass')
const htmlmin = require('gulp-htmlmin')
const less = require('gulp-less')
const gulpif = require('gulp-if')
const cleanCSS = require('gulp-clean-css')
const purify = require('gulp-purifycss')
const runSequence = require('run-sequence')
const debug = require('gulp-debug')
const convict = require('gulp-convict')

const R = require('ramda')

gulp.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'develop'

const webpack = require('webpack')
const webpackStream = require('webpack-stream')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

const browserSync = require('browser-sync').create()

const paths = {
  app: 'app',
  semantic: 'semantic',
  styles: 'style',
  dist: 'dist'
}

const isProd = gulp.environment !== 'develop'
const isDev = gulp.environment === 'develop'

gutil.log('build environment', gutil.colors.magenta(gulp.environment))

gulp.task('default', 'starts dev server and watching files', ['clean'], _ => {
  gulp.start('serve')
})

gulp.task('build:prod', 'building production', ['clean'], (cb) => {
  runSequence('html', 'dll', 'scripts', 'css', cb)
})

gulp.task('preserve', 'building files', (cb) => {
  runSequence('html', 'dll', 'config', 'css', cb)
})

gulp.task('clean', 'cleaning dist/', _ => {
  return gulp.src(paths.dist, { read: false })
    .pipe(clean())
})

gulp.task('serve', 'browserSync with webpack middleware', ['preserve'], _ => {
  // we use multiple instances of webpack
  const bundler = webpack(require('./webpack.config.js')(gulp.environment))

  browserSync.init({
    server: {
      port: 8080,
      baseDir: paths.dist,
      middleware: [
        webpackDevMiddleware(bundler, {
          publicPath: '/',
          stats: { colors: true, chunks: false }
        }),
        webpackHotMiddleware(bundler)
      ]
    }
  })

  // these tasks are injected, JS gets HMR'd by webpack
  gulp.watch([paths.styles + '/**/*.scss'], ['css'])
  gulp.watch([paths.app + '/**/*.html'], ['html'])
})

gulp.task('scripts', 'bundle app (only used for builds)', () => {
  return webpackStream(require('./webpack.config.js')(gulp.environment), webpack)
    .pipe(debug({ title: 'scripts' }))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('dll', 'making dll files (change dll.loader.js for new seperations)', (cb) => {
  const vendor = [R.keys(require('./package.json').dependencies)]

  gutil.log('vendor files', gutil.colors.blue.bold(vendor))

  webpack(require('./webpack.config.dll.js')(vendor), function(err, stats) {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack dll]', stats.toString({ colors: true, chunks: false }))
    cb()
  })
})

gulp.task('html', 'minify html and move to dist', _ => {
  return gulp.src(paths.app + '/*.html')
    .pipe(gulpif(isProd, htmlmin({ collapseWhitespace: true })))
    .pipe(debug({ title: 'hmtl' }))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('css', 'building custom stylus', _ => {
  browserSync.notify('compiling styles')
  return gulp.src(paths.styles + '/main.scss')
    .pipe(sass())
    .pipe(gulpif(isProd, purify([paths.app + '/**/*.js'])))
    .pipe(gulpif(isProd, cleanCSS({ compatibility: 'ie8' })))
    .pipe(debug({ title: 'styles' }))
    .pipe(gulp.dest(paths.dist))
    .pipe(gulpif(isDev, browserSync.stream()))
})

gulp.task('config', 'get the correct config', _ => {
  return gulp.src('./config/*.js')
    .pipe(convict({ log: true, schema: __dirname + '/config/schema.js' }))
    .pipe(gulp.dest(paths.app))
})
