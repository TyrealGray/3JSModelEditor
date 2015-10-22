/* global define,document,alert */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        Mustache = require('thirdLib/mustachejs/mustache.min'),

        MainMenuTemplate = require('text!../../../html/MainMenu.html'),
        MenuItemTemplate = require('text!../../../html/MenuItem.html'),

        LoadModelMenu = require('module/interface/kit/LoadModelMenu'),
        TransfromMennu = require('module/interface/kit/TransfromMenu'),

        GlobalVar = require('module/GlobalVar');

    function MainTitle() {
        this._init();
    }

    MainTitle.prototype._init = function () {
        this._initMenuContent();
    };

    MainTitle.prototype._initMenuContent = function () {
        this._content = Mustache.render(MainMenuTemplate, {
            menuList: Mustache.render(MenuItemTemplate, {
                menuItems: [LoadModelMenu.getMenuContent(), TransfromMennu.getMenuContent()]
            })
        });
    };

    MainTitle.prototype.bindTitleEvent = function () {

        var frameRenderer = GlobalVar.frameRenderer,
            transfromTool = GlobalVar.transformTool;

        document.getElementById('loadModelButton').addEventListener('change', function (uploader) {
            frameRenderer.loadLocalModelFiles(uploader.target.files);
        });

        document.getElementById('translateButton').addEventListener('click', function (event) {
            transfromTool.setMode(GlobalVar.transformTool.TRANSFORM_MODE.TRANSFORM);
        });

        document.getElementById('rotateButton').addEventListener('click', function (event) {
            transfromTool.setMode(GlobalVar.transformTool.TRANSFORM_MODE.ROTATE);
        });
        document.getElementById('scaleButton').addEventListener('click', function (event) {
            transfromTool.setMode(GlobalVar.transformTool.TRANSFORM_MODE.SCALE);
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

        this._bindScalePanels();

    };

    MainTitle.prototype._bindScalePanels = function () {

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

    };

    MainTitle.prototype.getMenuContent = function () {

        return this._content;
    };

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

    return MainTitle;
});