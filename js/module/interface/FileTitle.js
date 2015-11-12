/* global define,document */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        FileMenu = require('module/interface/kit/FileMenu'),

        TouchSensorManager = require('module/manager/TouchSensorManager'),

        GlobalVar = require('module/GlobalVar');

    function getMenuContent() {
        return FileMenu.getMenuContent();
    }

    function bindEvent() {

        var frameRenderer = GlobalVar.frameRenderer,
            touchSensorManager = GlobalVar.touchSensorManager;

        document.getElementById('loadModelButton').addEventListener('change', function (uploader) {
            frameRenderer.loadLocalModelFiles(uploader.target.files);
            touchSensorManager.setStatus(TouchSensorManager.prototype.STATUS_TRANSFROM.TRANSLATE);
        });

        document.getElementById('loadModelButton').addEventListener('click', function (uploader) {
            uploader.target.value = '';
        });
    }

    exports.getMenuContent = getMenuContent;
    exports.bindEvent = bindEvent;

});