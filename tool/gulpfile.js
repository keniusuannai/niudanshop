//引入gulp及组件
var gulp = require('gulp'),
    sass = require('gulp-sass'), // sass编译
    rename = require('gulp-rename'),  //重命名
    imagemin = require('gulp-imagemin'),  //图片压缩
    pngquant = require('imagemin-pngquant'), //深度压缩png图片
    imageminJpegoptim = require('imagemin-jpegoptim'), //深度压缩jpg图片
    nano = require('gulp-cssnano'),    //css压缩
    uglify = require('gulp-uglify'),           //js压缩
    sprite2 = require('gulp-sprite2'),   //合并图片1
    spritesmith = require('gulp.spritesmith'),  //合并图片2
    makeUrlVer = require('gulp-make-css-url-version'),  //图片添加版本号
    concat = require('gulp-concat'),     //合并文件;
    browserSync = require('browser-sync').create(),
    replace = require('gulp-replace'),
    reload = browserSync.reload;

//静态服务器 ＋监听 css/html 文件
gulp.task('server', function() {
    browserSync.init({
        server: "../"
    });
    gulp.watch("../*.html").on('change', reload);
    gulp.watch("../release/css/*.css").on('change', reload);
});

//spriterem合并图片
gulp.task('sprem',function(){
    gulp.src('../dev/images/icon/*')
        .pipe(spritesmith({
                //间距
                padding : 4,
                //输出合并后图片的地址（相对于输出路径）
                imgName: './images/sprite.png',
                //输出样式的地址（相对于输出路径）
                cssName: './css/spriterem.scss',
                //排列方式： binary-tree（默认），top-down，left-right，diagonal，alt-diagonal
                algorithm: 'binary-tree',
                //sass格式输出
                cssFormat: 'scss',
                //模板文件（相对于gulpfile的位置）
                cssTemplate: 'scss.handlebars'
        }))
        .pipe( gulp.dest('../dev/') );
});

//scss解析
gulp.task('scss',function(){
    gulp.src('../dev/css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe( gulp.dest('../release/css') );
});
gulp.task('watch-scss',function(){
    gulp.watch('../dev/css/*.scss',['scss']);
});
//spriter2合并图片
gulp.task('css',function(){
    gulp.src(['../dev/css/*.css'])
        //.pipe(sass().on('error', sass.logError))

        //合并图片
        .pipe(sprite2({
            'includeMode': 'implicit',
            // 生成的spriter的位置
            'spriteSheet': '../dev/images/spritesheet.png',
            // 生成样式文件图片引用地址的路径
            'pathToSpriteSheetFromCSS': '../images/spritesheet.png',
            //排除的图片
            'ignore':[ "../dev/images/*","../dev/images/slide/*","../dev/images/intro/*" ],
            'spritesmithOptions': {
                //图片的间距
                padding : 4,  
                //排列方式: binary-tree（默认），top-down，left-right，diagonal，alt-diagonal
                algorithm: 'top-down'  
            }
        }))
        .pipe( gulp.dest('../release/css/') );
});


//css任务
gulp.task('cssmin',function(){
    gulp.src('../dev/css/*.css')
        .pipe(makeUrlVer())  //添加版本号
        .pipe(nano({     //压缩css
            discardUnused: false,
            zindex: false,
            reduceIdents: false,
            mergeIdents: false,
            colormin: false
        }))
        .pipe(concat('style.min.css'))   //合并文件
        .pipe( gulp.dest('../release/css/') );
});

//图片压缩任务
gulp.task('image',function(){
    gulp.src('../dev/images/**')
        .pipe(pngquant({floyd: 0.3})())
        .pipe(imageminJpegoptim({progressive: true})())
        .pipe( gulp.dest('../release/images/') );
});

//js压缩任务
gulp.task('js',function(){
    gulp.src('../dev/js/*.js')
        .pipe( uglify() )
        .pipe( gulp.dest('../release/js/') );
});

//html内文字替换
gulp.task('replace', function() {
    gulp.src('../*.html')
        .pipe(replace(/origin/g, 'banana'))
        .pipe(rename({
            basename: "change"
        }))
        .pipe( gulp.dest('../') );
});

//监视文件

