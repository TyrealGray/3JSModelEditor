/* global define,document,alert */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),

        TouchSensorManager = require('module/manager/TouchSensorManager'),

        TransfromMenu = require('module/interface/kit/TransfromMenu'),

        GlobalVar = require('module/GlobalVar');

    function getMenuContent() {
        return TransfromMenu.getMenuContent();
    }

    function bindEvent() {

        var transfromTool = GlobalVar.transformTool,
            touchSensorManager = GlobalVar.touchSensorManager;

        document.getElementById('translateButton').addEventListener('click', function (event) {
            touchSensorManager.setStatus(TouchSensorManager.prototype.STATUS_TRANSFROM.TRANSLATE);
        });

        document.getElementById('rotateButton').addEventListener('click', function (event) {
            touchSensorManager.setStatus(TouchSensorManager.prototype.STATUS_TRANSFROM.ROTATE);
        });
        document.getElementById('scaleButton').addEventListener('click', function (event) {
            touchSensorManager.setStatus(TouchSensorManager.prototype.STATUS_TRANSFROM.SCALE);
        });

        document.getElementById('mirrorXButton').addEventListener('click', function (event) {
            transfromTool.mirrorX();
        });

        document.getElementById('mirrorYButton').addEventListener('click', function (event) {
            transfromTool.mirrorY();
        });

        document.getElementById('mirrorZButton').addEventListener('click', function (event) {
            transfromTool.mirrorZ();
        });

        document.getElementById('resetButton').addEventListener('click', function (event) {
            transfromTool.resetModel();
        });

        bindScalePanels();

    }

    function bindScalePanels() {

        var transfromTool = GlobalVar.transformTool;

        document.getElementById('translateButton').addEventListener('mouseover', function (event) {

            updateTransfromModelDate();
        });

        document.getElementById('lockProportionMenu').addEventListener('click', function (event) {

            event.stopPropagation();

            document.getElementById('lockProportion').checked = !document.getElementById('lockProportion').checked;
        });

        document.getElementById('scaleX').addEventListener('input', function (event) {

            var isLockProportion = document.getElementById('lockProportion').checked,
                value = document.getElementById('scaleX').value;

            var scaleX = parseFloat(value),
                scaleY = (isLockProportion) ? null : transfromTool.getModelScaleValue().y,
                scaleZ = (isLockProportion) ? null : transfromTool.getModelScaleValue().z;

            if (!CommonUtil.isNumber(scaleX) || 0 >= scaleX) {
                return;
            }

            setModelScale(scaleX, scaleY, scaleZ, isLockProportion);

            document.getElementById('scaleX').value = value;
        });

        document.getElementById('scaleY').addEventListener('input', function (event) {

            var isLockProportion = document.getElementById('lockProportion').checked,
                value = document.getElementById('scaleY').value;

            var scaleX = (isLockProportion) ? null : transfromTool.getModelScaleValue().x,
                scaleY = parseFloat(value),
                scaleZ = (isLockProportion) ? null : transfromTool.getModelScaleValue().z;

            if (!CommonUtil.isNumber(scaleY) || 0 >= scaleY) {
                return;
            }

            setModelScale(scaleX, scaleY, scaleZ, isLockProportion);

            document.getElementById('scaleY').value = value;
        });

        document.getElementById('scaleZ').addEventListener('input', function (event) {

            var isLockProportion = document.getElementById('lockProportion').checked,
                value = document.getElementById('scaleZ').value;

            var scaleX = (isLockProportion) ? null : transfromTool.getModelScaleValue().x,
                scaleY = (isLockProportion) ? null : transfromTool.getModelScaleValue().y,
                scaleZ = parseFloat(value);

            if (!CommonUtil.isNumber(scaleZ) || 0 >= scaleZ) {
                return;
            }

            setModelScale(scaleX, scaleY, scaleZ, isLockProportion);

            document.getElementById('scaleZ').value = value;
        });


        document.getElementById('long').addEventListener('input', function (event) {

            var isLockProportion = document.getElementById('lockProportion').checked,
                value = document.getElementById('long').value;

            var long = parseFloat(value),
                width = (isLockProportion) ? null : transfromTool.getModelLWH().z,
                height = (isLockProportion) ? null : transfromTool.getModelLWH().y;

            if (!CommonUtil.isNumber(long) || 0 >= long) {
                return;
            }

            setModelLWH(long, width, height, isLockProportion);

            document.getElementById('long').value = value;
        });

        document.getElementById('width').addEventListener('input', function (event) {
            var isLockProportion = document.getElementById('lockProportion').checked,
                value = document.getElementById('width').value;

            var long = (isLockProportion) ? null : transfromTool.getModelLWH().x,
                width = parseFloat(value),
                height = (isLockProportion) ? null : transfromTool.getModelLWH().y;

            if (!CommonUtil.isNumber(width) || 0 >= width) {
                return;
            }

            setModelLWH(long, width, height, isLockProportion);

            document.getElementById('width').value = value;
        });

        document.getElementById('height').addEventListener('input', function (event) {
            var isLockProportion = document.getElementById('lockProportion').checked,
                value = document.getElementById('height').value;

            var long = (isLockProportion) ? null : transfromTool.getModelLWH().x,
                width = (isLockProportion) ? null : transfromTool.getModelLWH().z,
                height = parseFloat(value);

            if (!CommonUtil.isNumber(height) || 0 >= height) {
                return;
            }

            setModelLWH(long, width, height, isLockProportion);

            document.getElementById('height').value = value;
        });
    }

    function setModelScale(x, y, z, isLockProportion) {

        var scaleX = (x) ? x : null,
            scaleY = (y) ? y : null,
            scaleZ = (z) ? z : null;

        GlobalVar.transformTool.setModelScaleValue(x, y, z, isLockProportion);

        updateTransfromModelDate();
    }

    function setModelLWH(l, w, h, isLockProportion) {

        var long = (l) ? l : null,
            width = (w) ? w : null,
            height = (h) ? h : null;

        GlobalVar.transformTool.setModelLWH(long, width, height, isLockProportion);

        updateTransfromModelDate();
    }

    function updateTransfromModelDate() {

        var transformTool = GlobalVar.transformTool;
        var scaleValue = transformTool.getModelScaleValue(),
            LWHValue = transformTool.getModelLWH();

        document.getElementById('scaleX').value = scaleValue.x;
        document.getElementById('scaleY').value = scaleValue.y;
        document.getElementById('scaleZ').value = scaleValue.z;

        document.getElementById('long').value = LWHValue.x;
        document.getElementById('height').value = LWHValue.y;
        document.getElementById('width').value = LWHValue.z;
    }


    exports.getMenuContent = getMenuContent;
    exports.bindEvent = bindEvent;

});