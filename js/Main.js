/* global requirejs,define,window,console */
requirejs.config({
    //默认从 js/ 中加载模块
    baseUrl: 'js/',

    paths: {
        text: 'thirdLib/requirejs/text',
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
        CssJsLoader = require('module/CssJsLoader'),
        Detector = require('thirdLib/threejs/Detector'),
        MainFrame = require('module/MainFrame');

    var mainFrame = null;

    require(['thirdLib/threejs/Detector'], function (Detector) {

        if (!Detector.webgl) {
            Detector.addGetWebGLMessage();
        }

        try {
            mainFrame = new MainFrame();
        } catch (e) {
            console.error(e);
        }

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