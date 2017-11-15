/**
 * @file gulp配置
 * @author mip-support@baidu.com
 */

'use strict';

const gulp = require('gulp');
const connect = require('gulp-connect');
const run = require('run-sequence');
const config = require('./config');

require('./build');
require('./build-www');
require('./clean');
require('./html-minifier');
require('./archive');
require('./validate');

gulp.task('dev', ['build:templates', 'build:components', 'build:www', 'webserver'], () => {
    gulp.watch(['../src/templates/**/*', '../src/base/**/*'], ['build:templates']);
    gulp.watch(['../src/components/**/*', '../src/base/**/*'], ['build:components']);
    gulp.watch(['../src/www/**/*', '../src/base/**/*'], ['build:www']);
    gulp.watch(config.dest.match, ['reload']);
});

gulp.task('build', () => {
    const task = [];

    // 清理目录
    task.push('clean');

    // 编译并验证产出
    task.push(['build:templates', 'build:components', 'build:www'], 'miphtml:validate');

    // 压缩代码并验证压缩后是否规范
    task.push('build:htmlminifier', 'miphtml:validate');

    // 打 zip 包
    task.push('build:archive');

    return run.apply(run, task);
});

gulp.task('reload', () => {
    return gulp
        .src(config.dest.match)
        .pipe(connect.reload());
});

gulp.task('webserver', () => {
    return connect.server({
        root: config.dest.path,
        livereload: true
    });
});
