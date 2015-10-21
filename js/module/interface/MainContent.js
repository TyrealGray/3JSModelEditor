/* global define,document,alert */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),

        Mustache = require('thirdLib/mustachejs/mustache.min'),

        MainContentTemplate = require('text!../../../html/MainContent.html'),
        MainTitleTemplate = require('text!../../../html/MainTitle.html'),

        ThreejsRenderer = require('module/ThreejsRenderer'),

        MainTitle = require('module/interface/MainTitle'),

        GlobalVar = require('module/GlobalVar');

    function MainContent() {

        this._mainTitle = null;

        this._init();
    }

    MainContent.prototype._init = function () {

        this._initPage();

        this._initThreeJsRenderer();

        this._bindPageEvent();
    };

    MainContent.prototype._initPage = function () {

        this._mainTitle = new MainTitle();

        document.getElementById('mainContent').innerHTML = Mustache.render(MainContentTemplate, {
            mainTitle: this._mainTitle.getMenuContent()
        });
    };

    MainContent.prototype._initThreeJsRenderer = function () {

        GlobalVar.frameRenderer = new ThreejsRenderer();

        GlobalVar.frameRenderer.render();
		
		GlobalVar.frameRenderer.loadUrlModelFiles('./source/test.stl');
    };

    MainContent.prototype._bindPageEvent = function () {

        var frameRenderer = GlobalVar.frameRenderer;

        document.getElementById('loadModelButton').addEventListener('change', function (uploader) {
            frameRenderer.loadLocalModelFiles(uploader.target.files);
        });

        document.getElementById('translateButton').addEventListener('click', function (event) {
            GlobalVar.transformTool.setMode(GlobalVar.transformTool.TRANSFORM_MODE.TRANSFORM);
        });

        document.getElementById('rotateButton').addEventListener('click', function (event) {
            GlobalVar.transformTool.setMode(GlobalVar.transformTool.TRANSFORM_MODE.ROTATE);
        });
        document.getElementById('scaleButton').addEventListener('click', function (event) {
            GlobalVar.transformTool.setMode(GlobalVar.transformTool.TRANSFORM_MODE.SCALE);
        });

        document.getElementById('mirrorXButton').addEventListener('click', function (event) {
            GlobalVar.transformTool.mirrorX();
        });

        document.getElementById('mirrorYButton').addEventListener('click', function (event) {
            GlobalVar.transformTool.mirrorY();
        });

        document.getElementById('mirrorZButton').addEventListener('click', function (event) {
            GlobalVar.transformTool.mirrorZ();
        });
//
//        document.getElementById('acceptScale').addEventListener('click', function (event) {
//
//            var x = parseFloat(document.getElementById('scaleX').value),
//                y = parseFloat(document.getElementById('scaleY').value),
//                z = parseFloat(document.getElementById('scaleZ').value);
//
//            if (!checkIsLegalScale(x) && !checkIsLegalScale(y) && !checkIsLegalScale(z)) {
//                alert('缩放值非法');
//                return;
//            }
//
//            GlobalVar.transformTool.setScaleValue(x, y, z);
//        });
//
//        function checkIsLegalScale(value) {
//            return !isNaN(value) && (0 < value);
//        }
    };

    MainContent.prototype.onWindowResize = function () {
        if (!CommonUtil.isDefined(GlobalVar.frameRenderer)) {
            return;
        }
        GlobalVar.frameRenderer.onWindowResize();
    };

    return MainContent;
});