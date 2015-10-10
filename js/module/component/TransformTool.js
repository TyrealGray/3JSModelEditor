/* global define */
define(function (require) {
    'use strict';

    var THREE = require('THREE'),
        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/TransformControls');

    function TransformTool(domElement) {
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
        this._transformControls = new THREE.TransformControls(GlobalVar.cameraManager.getRenderInstance(), domElement);
        this._transformControls.setSpace('world');
        this._transformControls.size = 2;

        GlobalVar.sceneManager.addStaticMesh(this._transformControls);
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
    };

    TransformTool.prototype.onPointerDown = function (event, hitPoint) {

        //        if (this.TRANSFORM_MODE.TRANSFORM === this._transformMode) {
        //            return this._transformControls.onHorizontalModePointerDown(event, hitPoint);
        //        }

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