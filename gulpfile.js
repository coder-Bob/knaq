//导入工具包 require('node_modules里对应模块')
var gulp        = require('gulp'), //本地安装gulp所用到的地方
    // rjs         = require('requirejs'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    minifycss   = require('gulp-minify-css'),
    uglify      = require('gulp-uglify');
    sass        = require('gulp-ruby-sass'),
    clean       = require('gulp-clean'),             //清空文件夹
    // tiny        = require('tiny-lr'),
    // server      = tiny(),
    livereload  = require('gulp-livereload');   //livereload


gulp.task('images',function(){
    var imgDev = './src/images/*.{png,jpg,gif,ico}',
        imgSrc = './dist/images/';
    gulp.src(imgDev)
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true,  //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
            svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
            use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
        }))
        .pipe(gulp.dest(imgSrc))
        .pipe(livereload());
});



//样式处理
gulp.task('css',function(){
    var cssDev = './src/scss/*',
        cssSrc = './dist/css/';
    return sass(cssDev)
        .on('error',sass.logError)
        .pipe(minifycss())
        .pipe(gulp.dest(cssSrc))
        .pipe(livereload());
})



//字体输出
gulp.task('fonts',function(){
    var fontsDev = './src/fonts/*',
        fontsSrc = './dist/fonts/';
    gulp.src(fontsDev)
        .pipe(gulp.dest(fontsSrc))
        .pipe(livereload());
})


// HTML处理
gulp.task('html', function() {
    var htmlSrc = './src/*.html',
        htmlDst = './dist/';
    gulp.src(htmlSrc)
        .pipe(gulp.dest(htmlDst))
        .pipe(livereload());
});

// js处理
gulp.task('script', function() {
    gulp.src('./src/lib/*.js')
        .pipe(gulp.dest('./dist/lib'))


    gulp.src('./src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
        .pipe(livereload());

})

//清空图片 样式
gulp.task('clean',function(){
    gulp.src(['./dist'],{read: false})
        .pipe(clean());
})

// 默认任务 清空图片、样式 gulp
gulp.task('default', ['clean'], function(){
    gulp.start('html','script','css','fonts','images');
});

//默认任务

gulp.task('watch', function () {
    livereload.listen();
    //监听图片
    gulp.watch('./src/images/*',function () {
        gulp.run('images');
    });

    //监听css
    gulp.watch('./src/scss/*',function () {
        gulp.run('css');
    })

    //监听js
    gulp.watch('./src/js/*',function () {
        gulp.run('script');
    })

    //监听字体文件
    gulp.watch('./src/fonts/*',function () {
        gulp.run('fonts');
    })

    // 监听html
    gulp.watch('./src/*.html', function(){
        gulp.run('html');
    })

});