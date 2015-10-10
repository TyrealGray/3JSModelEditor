/* global requirejs,define,window,console */
requirejs.config({
    //默认从 js/ 中加载模块
    baseUrl: 'js/',

    paths: {
        GlobalVar: 'module/GlobalVar',
        MainFrame: 'module/MainFrame',
        THREE: 'thirdLib/threejs/Three.min'
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

    require(['MainFrame'], function (MainFrame) {
        console.log('Editor Run');

        new MainFrame();

        loadCssFiles();
    });

    function loadCssFiles() {
        var fileNames = [
            'css/MainFrame.css'
        ];

        fileNames.forEach(function (fileName) {
            CssJsLoader.loadCssFile(Context.getServerUrl() + fileName);
        });
    }

    window.onbeforeunload = function () {
        return '请确认您是否真的要退出';
    };
});