/* global define */
define(function (require) {

    var CommonUtil = require('lib/CommonUtil'),
        THREE = require('THREE'),
        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/TransformControls');

    function TransformTool(domElement) {
        this._attachedObject = null;
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
        if (!CommonUtil.isDefined(this._attachedObject)) {
            return;
        }

        this._mirror(-1, 1, 1);
    };

    TransformTool.prototype.mirrorY = function () {
        if (!CommonUtil.isDefined(this._attachedObject)) {
            return;
        }

        this._mirror(1, -1, 1);
    };

    TransformTool.prototype.mirrorZ = function () {
        if (!CommonUtil.isDefined(this._attachedObject)) {
            return;
        }

        this._mirror(1, 1, -1);
    };

    TransformTool.prototype._mirror = function (x, y, z) {
        this._attachedObject.geometry.applyMatrix(new THREE.Matrix4().makeScale(x, y, z));
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
    };

    TransformTool.prototype.attach = function (object) {
        this._transformControls.attach(object);
        this._attachedObject = object;
    };

    TransformTool.prototype.onPointerDown = function (event, hitPoint) {
        return this._transformControls.onPointerDown(event);
    };

    TransformTool.prototype.onPointerMove = function (event) {
        this._transformControls.onPointerMove(event);
    };

    TransformTool.prototype.onPointerUp = function (event) {
        this._transformControls.onPointerUp(event);
    };

    TransformTool.prototype.update = function () {
        this._transformControls.update();
    };

    return TransformTool;
});