/* global requirejs,define,window,console */
requirejs.config({
    //默认从 js/ 中加载模块
    baseUrl: 'js/',

    paths: {
        text: 'thirdLib/requirejs/text',
        GlobalVar: 'module/GlobalVar',
        MainFrame: 'module/MainFrame',
        THREE: 'thirdLib/threejs/Three.min',
    },
    shim: {
        THREE: {
            exports: 'THREE'
        }
    }
});

define(function (require) {
    'use strict';

    var Context = require('module/Context'),
        CssJsLoader = require('module/CssJsLoader');

    var mainFrame = null;

    require(['MainFrame'], function (MainFrame) {
        console.log('Editor Run');

        mainFrame = new MainFrame();

        loadCssFiles();

    });

    function loadCssFiles() {
        var fileNames = [
            'css/pure-min.css',
            'css/grids-min.css',
            'css/menus-min.css',
            'css/grids-responsive-min.css'
        ];

        fileNames.forEach(function (fileName) {
            CssJsLoader.loadCssFile(Context.getServerUrl() + fileName);
        });
    }

    window.onbeforeunload = function () {
        return 'Are you sure want to exit';
    };

    window.onresize = function () {

        if (null !== mainFrame) {
            mainFrame.onWindowResize();
        }
    };
});