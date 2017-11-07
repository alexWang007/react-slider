module.exports = function ( grunt ) {

    // 配置参数
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        banner: '/*!\n' +
        '* slider.js v<%= pkg.version %> - <%= pkg.description %>\n' +
        '* Copyright (c) <%= grunt.template.today(\'yyyy\') %> <%= pkg.author %>. All rights reserved.\n' +
        '* Licensed under MIT License.\n' +
        '*/',
        connect: {
            docs: {
                options: {
                    protocol: 'http',
                    port: 8080,
                    hostname: 'localhost',
                    livereload: true,
                    base: {
                        path: './docs/',
                        options: {
                            index: 'index.html'
                        }
                    },
                    open: 'http://localhost:8080/index.html'
                }
            }
        },
        babel: {
            options: {
                sourceMap: false,
                presets: [ 'env' ]
            },
            src: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/', // js 目录下
                        src: [ '**/**.js' ], // src 下 spinner.js 文件
                        dest: 'docs/js'  // 输出到此目录下
                    }
                ]
            }

        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: true, // 混淆变量名
                comments: 'false' // false（删除全部注释），some（保留@preserve @license @cc_on等注释）
            },
            docs: {
                files: {
                    'docs/js/slider.min.js': [
                        'docs/js/slider.js'
                    ]
                }
            },
            dist: {
                files: {
                    'dist/slider.min.js': [
                        'docs/js/slider.js'
                    ]
                }
            }
        },
        copy: {
            js: {
                files: [
                    {
                        'dist/slider.js': 'docs/js/slider.js',
                        'docs/js/react.min.js': 'node_modules/react/dist/react.min.js',
                        'docs/js/react-dom.min.js': 'node_modules/react-dom/dist/react-dom.min.js',
                        'docs/js/lodash.min.js': 'node_modules/lodash/lodash.min.js'
                    }
                ]
            },
            css: {
                files: [
                    {
                        'dist/slider.css': 'src/slider.css'
                    }
                ]
            }
        },
        csslint: {
            docs: {
                options: {
                    'bulletproof-font-face': false,
                    'order-alphabetical': false,
                    'box-model': false,
                    'vendor-prefix': false,
                    'known-properties': false
                },
                src: [
                    'src/**.css'
                ]
            }
        },
        cssmin: {
            docs: {
                files: {
                    'docs/css/slider.min.css': [
                        'src/slider.css'
                    ]
                }
            },
            dist: {
                files: {
                    'dist/slider.min.css': [
                        'src/slider.css'
                    ]
                }
            }
        },
        watch: {
            css: {
                files: 'src/**.css',
                tasks: [
                    'csslint',
                    'cssmin',
                    'copy:css'
                ]
            },
            js: {
                files: 'src/**.js',
                tasks: [
                    'babel',
                    'uglify',
                    'copy:js'
                ]
            },
            connect: {
                files: [
                    'docs/index.html',
                    'docs/**/**.css',
                    'docs/**/**.js'
                ],
                options: {
                    livereload: true
                }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-connect' );
    grunt.loadNpmTasks( 'grunt-babel' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-csslint' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );

    grunt.registerTask( 'default', [
        'connect:docs',
        'babel',
        'uglify',
        'cssmin',
        'csslint',
        'copy',
        'watch'
    ] );
};