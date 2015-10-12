/* global define,document */
define(function (require) {
    'use strict';

    var ThreejsRenderer = require('module/ThreejsRenderer'),

        GlobalVar = require('module/GlobalVar');

    function MainFrame() {

        GlobalVar.frameRenderer = new ThreejsRenderer();

        this._init();
    }

    MainFrame.prototype._init = function () {

        var frameRenderer = GlobalVar.frameRenderer;

        frameRenderer.render();

        frameRenderer.loadUrlModelFiles('./source/test.stl');

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

    };

    MainFrame.prototype.onWindowResize = function () {
        GlobalVar.frameRenderer.onWindowResize();
    };

    return MainFrame;

});