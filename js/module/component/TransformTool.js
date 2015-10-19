/* global define */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        THREE = require('THREE'),

        ModelFrameSet = require('module/util/ModelFrameSet'),
        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/TransformControls');

    function TransformTool(domElement) {
        this._attachedModel = null;
        this._transformMode = this.TRANSFORM_MODE.TRANSFORM;
        this._transformControls = null;
        this._init(domElement);
    }

    TransformTool.prototype.TRANSFORM_MODE = {
        TRANSFORM: 0,
        ROTATE: 1,
        SCALE: 2
    };

    TransformTool.prototype._init = function (domElement) {
        this._transformControls = new THREE.TransformControls(GlobalVar.sceneController.getRenderTarget().camera, domElement);
        this._transformControls.setSpace('world');
        this._transformControls.visible = false;
        this._transformControls.size = 2;

        GlobalVar.sceneController.spawnMesh(this._transformControls);
    };

    TransformTool.prototype.mirrorX = function () {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._attachedModel.mirrorX();
    };

    TransformTool.prototype.mirrorY = function () {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._attachedModel.mirrorY();
    };

    TransformTool.prototype.mirrorZ = function () {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._attachedModel.mirrorZ();
    };

    TransformTool.prototype.setScaleValue = function (x, y, z, isLockProportion) {

    };

    TransformTool.prototype.setScaleByWHL = function (w, h, l, isLockProportion) {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        var size = this._attachedModel.getSize();


    };

    TransformTool.prototype.setMode = function (mode) {

        this._transformMode = mode;

        switch (mode) {
        case this.TRANSFORM_MODE.TRANSFORM:
            this._transformControls.setMode('translate');
            this._transformControls.setSpace('world');
            this._transformControls.visible = false;
            break;
        case this.TRANSFORM_MODE.ROTATE:
            this._transformControls.setMode('rotate');
            this._transformControls.setSpace('world');
            this._transformControls.visible = true;
            break;
        case this.TRANSFORM_MODE.SCALE:
            this._transformControls.setMode('scale');
            this._transformControls.setSpace('local');
            this._transformControls.visible = true;
            break;
        default:
            break;
        }
    };

    TransformTool.prototype.attachModel = function (model) {
        this._transformControls.attach(model.get().model);
        this._attachedModel = model;
    };

    TransformTool.prototype.onPointerDown = function (event, hitPoint) {

        return this._transformControls.onPointerDown(event);
    };

    TransformTool.prototype.onPointerMove = function (event) {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._transformControls.onPointerMove(event);

        this._attachedModel.update();
    };

    TransformTool.prototype.onPointerUp = function (event) {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._transformControls.onPointerUp(event);
        this._attachedModel.update();

        ModelFrameSet.manageOverlapOtherModel(this._attachedModel);
    };

    TransformTool.prototype.update = function () {
        this._transformControls.update();
    };

    return TransformTool;
});