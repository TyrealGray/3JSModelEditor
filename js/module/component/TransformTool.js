/* global define,console */
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

    TransformTool.prototype.resetModel = function () {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._attachedModel.reset();
    };

    TransformTool.prototype.deleteModel = function () {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        GlobalVar.sceneController.disposeModel(this._attachedModel);

        this._attachedModel = null;

        this._transformControls.detach();
    };

    TransformTool.prototype.copyModel = function () {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        GlobalVar.sceneController.spawnModel(this._attachedModel.clone());
    };

    TransformTool.prototype.setModelScaleValue = function (x, y, z, isLockProportion) {

        var scale = this.getModelScaleValue();

        if (isLockProportion) {

            if (null !== x) {
                y = scale.y * (x / scale.x);
                z = scale.z * (x / scale.x);
            } else if (null !== y) {
                x = scale.x * (y / scale.y);
                z = scale.z * (y / scale.y);
            } else {
                x = scale.x * (z / scale.z);
                y = scale.y * (z / scale.z);
            }
        }

        this._attachedModel.setScale(x, y, z);
        this._attachedModel.update();
    };

    TransformTool.prototype.getModelScaleValue = function () {
        return this._attachedModel.getScale();
    };

    TransformTool.prototype.setModelLWH = function (l, w, h, isLockProportion) {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }
        var size = this.getModelLWH(),
            scale = this.getModelScaleValue();

        var scalePX = scale.x / size.x,
            scalePY = scale.y / size.y,
            scalePZ = scale.z / size.z;

        if (isLockProportion) {

            if (null !== l) {
                h = size.y * (l / size.x);
                w = size.z * (l / size.x);
            } else if (null !== h) {
                l = size.x * (h / size.y);
                w = size.z * (h / size.y);
            } else {
                h = size.y * (w / size.z);
                l = size.x * (w / size.z);
            }
        }

        this.setModelScaleValue(l * scalePX, h * scalePY, w * scalePZ);
    };

    TransformTool.prototype.getModelLWH = function () {
        return this._attachedModel.getSize();
    };

    TransformTool.prototype.setMode = function (mode) {

        this._transformMode = mode;

        switch (mode) {
        case this.TRANSFORM_MODE.TRANSFORM:
            this._transformControls.setMode('translate');
            this._transformControls.setSpace('world');
            break;
        case this.TRANSFORM_MODE.ROTATE:
            this._transformControls.setMode('rotate');
            this._transformControls.setSpace('world');
            break;
        case this.TRANSFORM_MODE.SCALE:
            this._transformControls.setMode('scale');
            this._transformControls.setSpace('local');
            break;
        default:
            break;
        }
		
		this._transformControls.visible = true;
    };

    TransformTool.prototype.attachModel = function (model) {

        if (CommonUtil.isDefined(this._attachedModel)) {
            this._attachedModel.unselected();
        }

        this._transformControls.attach(model.get().model);
        this._attachedModel = model;
        this._attachedModel.selected();
        this.setMode(this._transformMode);
    };

    TransformTool.prototype.onPointerDown = function (event, hitPoint) {

        return this._transformControls.onPointerDown(event);
    };

    TransformTool.prototype.onPointerMove = function (event) {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._transformControls.onPointerMove(event);

        if (this.TRANSFORM_MODE.ROTATE === this._transformMode) {
            return;
        }

        this._attachedModel.update();

    };

    TransformTool.prototype.onPointerHover = function (event) {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._transformControls.onPointerHover(event);
    };

    TransformTool.prototype.onPointerUp = function (event) {
        if (!CommonUtil.isDefined(this._attachedModel)) {
            return;
        }

        this._transformControls.onPointerUp(event);

        this._attachedModel.update();
    };

    TransformTool.prototype.update = function () {
        this._transformControls.update();
    };

    return TransformTool;
});