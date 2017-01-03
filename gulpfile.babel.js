'use strict'

const gulp = require('gulp-help')(require('gulp'))

const clean = require('gulp-clean')
const gutil = require('gulp-util')
const stylus = require('gulp-stylus')
const htmlmin = require('gulp-htmlmin')
const less = require('gulp-less')
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify')
const cleanCSS = require('gulp-clean-css')
const purify = require('gulp-purifycss')


const webpack = require('webpack')
const webpackStream = require('gulp-webpack')

const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')

gulp.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'develop'

const webpackConfig = require('./webpack.config.js')(gulp.environment)
const middlewareBundler = webpack(webpackConfig)

const browserSync = require('browser-sync').create()

gulp.paths = {
  app: 'app',
  semantic: 'semantic',
  styles: 'styles',
  dist: 'dist'
}

const isProd = gulp.environment !== 'develop'
const isDev = gulp.environment === 'develop'

gutil.log('build environment', gutil.colors.magenta(gulp.environment))

gulp.task('default', 'starts dev server and watching files', ['clean'], () => {
  gulp.start('serve')
})

gulp.task('build:prod', 'building production', ['clean'], () => {
  gulp.start('build')
})

gulp.task('build', 'building files', ['html', 'scripts', 'semantic', 'styles'])

gulp.task('clean', 'cleaning dist/', () => {
  return gulp.src(gulp.paths.dist, { read: false })
    .pipe(clean())
})

gulp.task('serve', 'browserSync with webpack middleware', ['build'], () => {
  browserSync.init({
    server: {
      baseDir: gulp.paths.dist,
      middleware: [
        webpackDevMiddleware(middlewareBundler, {
          publicPath: webpackConfig.output.publicPath,
          stats: {
            colors: true,
            chunks: false,
          }
        }),
        webpackHotMiddleware(middlewareBundler)
      ]
    }
  })

  gulp.watch([gulp.paths.styles + '/**/*.styl'], ['styles'])
  gulp.watch([gulp.paths.app + '/**/*.html'], ['html'])
  gulp.watch([gulp.paths.semantic + '/**/*.*'], ['semantic'])

})

gulp.task('scripts', 'bundle app (only used for builds)', () => {
  return gulp.src(gulp.paths.app)
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest(gulp.paths.dist))
})

gulp.task('html', 'minify html and move to dist', () => {
  return gulp.src(gulp.paths.app + '/*.html')
    .pipe(gulpif(isProd, htmlmin({ collapseWhitespace: true })))
    .pipe(gulp.dest(gulp.paths.dist))
})

gulp.task('semantic', 'building semantic less', () => {
  browserSync.notify('compiling semantic')
  return gulp.src(gulp.paths.semantic + '/semantic.less')
    .pipe(less())
    .pipe(gulpif(isProd, purify([gulp.paths.app + '/**/*.js'])))
    .pipe(gulpif(isProd, cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulp.dest(gulp.paths.dist))
    .pipe(gulpif(isDev, browserSync.stream()))
})

gulp.task('styles', 'building custom stylus', () => {
  browserSync.notify('compiling styles')
  return gulp.src(gulp.paths.styles + '/main.styl')
    .pipe(stylus())
    .pipe(gulpif(isProd, purify([gulp.paths.app + '/**/*.js'])))
    .pipe(gulpif(isProd, cleanCSS({ compatibility: 'ie8' })))
    .pipe(gulp.dest(gulp.paths.dist))
    .pipe(gulpif(isDev, browserSync.stream()))
})
