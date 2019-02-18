var gulp = require('gulp'),
        // minifycss = require('gulp-minify-css'),
        // concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        $ = require('gulp-load-plugins')(),
        open = require('open'),
        babelenv = require('babel-preset-env'),
        connect = require('gulp-connect'),
        proxy = require('http-proxy-middleware'),
        babel = require('gulp-babel'),
        del = require('del')

var app = {
    srcPath: 'dist/',
};

 function html() {
    return gulp.src(app.srcPath + '**/*.html')
            .pipe($.connect.reload());
}

 function srcCss() {
    return  gulp.src(app.srcPath + 'src/**/*.less')
            .pipe($.less())
            .pipe($.cssmin())
            .pipe(gulp.dest(app.srcPath + 'src'))
            .pipe($.connect.reload());
}

 function img() {
    return gulp.src(app.srcPath + 'img/**/*')
            .pipe($.connect.reload());
}

 function less() {
    return gulp.src(app.srcPath + 'src/**/*.less')
            .pipe($.less())
            .pipe($.cssmin())
            .pipe(gulp.dest(app.srcPath + 'src'))
            .pipe($.connect.reload());
}

 function js() {
    return gulp.src(app.srcPath + 'src/**/*.js')
            .pipe($.connect.reload());
}


 function minifyjs() {
    return gulp.src(app.srcPath + 'src/babelJs/*.js')
    // .pipe(concat('all.js'))               //合并所有js到main.js
    // .pipe(babel())
            .pipe(gulp.dest(app.srcPath + 'src/babelJs'))           //输出main.js到文件夹
            .pipe(rename({suffix: '.min'}))       //rename压缩后的文件名
            .pipe(uglify())                       //压缩
            .pipe(gulp.dest(app.srcPath + 'src/babelJs'));          //输出
}

 function clean() {

    return del([
        // 这里我们使用一个通配模式来匹配 `mobile` 文件夹中的所有东西
            'dist/src/babelJs/*'
    ]);
}

 function babelJs() {
    return gulp.src(app.srcPath + 'src/js/*.js')
            .pipe(babel())
            .pipe(gulp.dest(app.srcPath + 'src/babelJs'));
}

 function watchfile() {
    gulp.watch(app.srcPath + '**/*.html',gulp.series(html));
    gulp.watch(app.srcPath + 'src/**/*.less',gulp.series(less));
    gulp.watch(app.srcPath + 'src/**/*.js',gulp.series(js));
    gulp.watch(app.srcPath + 'src/**/*.less',gulp.series(srcCss));
    // gulp.watch(app.srcPath + 'src/**/*.css',['minifycss']);
    // gulp.watch(app.srcPath + 'src/**/*.js',['babelJs']);
    gulp.watch(app.srcPath + 'img/**/*',gulp.series(img));
}

 function serve() {
    connect.server({
        root: ['./dist/'],
        livereload: true,
        port: 3333,
        middleware: function(connect, opt) {
            return [
                proxy('/api',{
                    target: 'https://seckill.e6best.com',
                    changeOrigin: true,
                    pathRewrite:{//路径重写规则
                        '^/api':''
                    }
                })
                // proxy('/otherServer',{
                //     target: 'http://IP:Port',
                //     changeOrigin: true
                // })
            ]
        }
    })
    open('http://localhost:3333');
    return gulp.watch(app.srcPath + '**/*.html',gulp.series(html)),
     gulp.watch(app.srcPath + 'src/**/*.less',gulp.series(less)),
    gulp.watch(app.srcPath + 'src/**/*.js',gulp.series(js)),
    gulp.watch(app.srcPath + 'src/**/*.less',gulp.series(srcCss)),
    // gulp.watch(app.srcPath + 'src/**/*.css',['minifycss']);
    // gulp.watch(app.srcPath + 'src/**/*.js',['babelJs']);
    gulp.watch(app.srcPath + 'img/**/*',gulp.series(img));
}

function build() {
    return gulp.series(html,less,js,srcCss,img,watchfile)
}

var babelJS = gulp.series(clean, gulp.parallel(babelJs));
var miniJs = gulp.series(minifyjs);
var serveDefault = gulp.series(serve,gulp.parallel(build));

exports.html = html;
exports.less = less;
exports.build = build;
exports.srcCss = srcCss;
exports.img = img;
exports.watchfile = watchfile;
exports.js = js;
exports.babelJS = babelJS;
exports.miniJs = miniJs;

exports.default = serveDefault;


