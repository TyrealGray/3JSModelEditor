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

        document.getElementById('loadModelButton').addEventListener("change", function (uploader) {
            frameRenderer.loadLocalModelFiles(uploader.target.files);
        });

        frameRenderer.loadUrlModelFiles('./source/flower.stl');

    };


    return MainFrame;

});