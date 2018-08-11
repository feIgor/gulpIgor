const path = require('path');
const gulp = require('gulp');
const less = require('gulp-less');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const browserSync = require('browser-sync').create();
const del = require('del');

let cleanCSS = require('gulp-clean-css');

gulp.task('clean', () => {
  return del(['./dist']);
});

gulp.task('less', () => {
  return gulp.src('./src/less/main.less')
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))

    .pipe(cleanCSS({debug: true}, (details) => {
      console.log(`${details.name}: ${details.stats.originalSize}`);
      console.log(`${details.name}: ${details.stats.minifiedSize}`);
    }))

    .pipe(gulp.dest('./dist/css'))
});

gulp.task('imageMove', () => {
  return gulp.src('./src/img/**/**.*')
    .pipe(gulp.dest('./dist/img'))
});

gulp.task('fontsMove', () => {
  return gulp.src('./src/font/**/**.*')
    .pipe(gulp.dest('./dist/font'))
});

gulp.task('js', () => {
  gulp.src('./src/js/app.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./"
      }
  });
});

gulp.task('allTasks', ['less', 'imageMove','fontsMove', 'js'] ,() => {
});

// task add watcher for js files and add js task to default
gulp.task('default', ['clean', 'browser-sync'], () => {
  gulp.run('allTasks');
  gulp.watch('./src/less/**/*.less', () => {
    gulp.run('less');
  });
  gulp.watch('./src/js/**/*.js', () => {
    gulp.run('js')
  });

  gulp.watch('./src/img/**/*.*', () => {
    gulp.run('imageMove')
  });

  gulp.watch('./src/font/**/*.*', () => {
    gulp.run('fontsMove')
  });

  console.log('gulp default task')
});