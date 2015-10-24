/* global define,document */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        FileMenu = require('module/interface/kit/FileMenu'),

        GlobalVar = require('module/GlobalVar');

    function getMenuContent() {
        return FileMenu.getMenuContent();
    }

    function bindEvent() {

        var frameRenderer = GlobalVar.frameRenderer;

        document.getElementById('loadModelButton').addEventListener('change', function (uploader) {
            frameRenderer.loadLocalModelFiles(uploader.target.files);
        });
    }

    exports.getMenuContent = getMenuContent;
    exports.bindEvent = bindEvent;

});