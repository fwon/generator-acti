'use strict';

fis.set('project.ignore', ['package.json', 'node_modules/**', 'README.md','fis-conf.js']); 

fis.hook('commonjs', {
    // baseUrl: '/js/'
});

fis.hook('relative');
//采用相对路径发布
fis.match('**', {
  relative: true
});

//压缩图片
fis.match('img/**.png', {
    optimizer: fis.plugin('png-compressor', {
        type : 'pngquant'
    })
});

//压缩css
// fis.match('css/**.css', {
//   optimizer: fis.plugin('clean-css'),
//   useHash: true
// });

fis.match('css/**.less', {
    parser: fis.plugin('less'),
    rExt: '.css',
    optimizer: fis.plugin('clean-css'),
    postprocessor: fis.plugin('px2rem', {
        baseDpr: 2,
        remVersion: true,
        remUnit: 128,
        remPrecision: 6
    }),
    useHash: true
});


fis.match('js/mod/(**).js', {
    isMod: true,
    moduleId: '$1',
    useHash: true
});

var eslintConf = {
    ignoreFiles: ['js/lib/**.js', 'js/mod/template.js', 'js-conf.js', 'node_modules/**.js'],
    envs: ['browser', 'node'],
    globals: ['$'],
    rules: {
        "semi": [1],
        "no-undef": [2],
        "no-use-before-define": [1],
        "no-unused-vars": [1],
        "no-eval": [1]
    }
};

fis.match('js/*.js', {
    lint: fis.plugin('eslint', eslintConf)
});

//压缩js
fis.media('pro').match('**.js', {
    optimizer: fis.plugin('uglify-js', {
        mangle: {
            except: 'exports, module, require, define'
        },
        compress: {
            // drop_console: true
        }
    })
});

fis.media('pro').match('::package', {
    postpackager: [ 
        fis.plugin('loader', {
            allInOne: {
                js: 'js/${hash}_aio.js',
                css: 'css/${hash}_aio.css'
            }
        })
    ]
});

// fis.media('pro').match('**.js', {
//     useHash: true,
//     domain: 'https://ps.res.netease.com/yys/zbds'
// });

// fis.media('pro').match('**.less', {
//     useHash: true,
//     domain: 'https://ps.res.netease.com/yys/zbds' 
// });

// fis.media('pro').match('images/*.png', {
//     useHash: true,
//     domain: 'https://ps.res.netease.com/yys/zbds'
// });

fis.media('pro').match('**', {
    deploy: [
        fis.plugin('replace-plus', {
            rules: {
                '*.css': {
                    from: /url\(\/img/g,
                    to: 'url(../img'
                },
            }
        }),
        fis.plugin('local-deliver')
    ]
});