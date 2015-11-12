/* global define */
define(function (require) {
    'use strict';

    var THREE = require('THREE'),

        TransformTool = require('module/component/TransformTool'),

        ModelFrameSet = require('module/util/ModelFrameSet'),

        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/OrbitControls');

    var cameraTarget = null;

    function TouchSensorManager() {
        this._status = this.STATUS_TRANSFROM.TRANSLATE;
        this._transformTool = null;
        this._orbitControl = null;
        this._isTouchSensorDown = false;
        this._isMouseMove = false;
        this._isTransformStatus = false;

        this._init();
    }

    TouchSensorManager.prototype.STATUS_TRANSFROM = {
        TRANSLATE: 0,
        ROTATE: 1,
        SCALE: 2
    };

    TouchSensorManager.prototype.STATUS_PRINT_CUSTOM = {
        ADD_SUPPORT: 3,
    };

    TouchSensorManager.prototype._init = function () {
        this._initTransformControl();
        this._initOrbitControl();
    };

    TouchSensorManager.prototype._initTransformControl = function () {
        this._transformTool = new TransformTool(GlobalVar.sceneController.getRenderTarget().domElement);

        GlobalVar.transformTool = this._transformTool;
    };

    TouchSensorManager.prototype._initOrbitControl = function () {

        this._orbitControl = new THREE.OrbitControls(GlobalVar.sceneController.getRenderTarget().camera,
            GlobalVar.sceneController.getRenderTarget().domElement);
        this._orbitControl.enableDamping = true;
        this._orbitControl.enablePan = false;
    };

    TouchSensorManager.prototype.setStatus = function (status) {
        this._status = status;

        switch (status) {
        case this.STATUS_TRANSFROM.TRANSLATE:
            this._transformTool.setMode(TransformTool.prototype.TRANSFORM_MODE.TRANSFORM);
            break;
        case this.STATUS_TRANSFROM.ROTATE:
            this._transformTool.setMode(TransformTool.prototype.TRANSFORM_MODE.ROTATE);
            break;
        case this.STATUS_TRANSFROM.SCALE:
            this._transformTool.setMode(TransformTool.prototype.TRANSFORM_MODE.SCALE);
            break;

        default:
            break;
        }
    };

    TouchSensorManager.prototype.isPrintCustomMode = function () {
        return (this._status > this.STATUS_TRANSFROM.SCALE);
    };

    TouchSensorManager.prototype.getStatus = function () {
        return this._status;
    };

    TouchSensorManager.prototype.onOperatingStart = function (event, operateMode) {

        this._isTouchSensorDown = true;

            this._isTransformStatus = this._isSwitchToTransformStatus(event);


        if (!this._isTransformStatus) {
            this._onOrbitControlOperating(event, operateMode);
        }
    };

    TouchSensorManager.prototype.onOperatingMove = function (event, operateMode) {

        this._transformTool.onPointerHover(event);

        if (!this._isTouchSensorDown) {
            return;
        }

        this._isMouseMove = true;

        if (this._isTransformStatus) {
            this._transformTool.onPointerMove(event);
        } else {
            this._onOrbitControlOperating(event, operateMode);
        }
    };

    TouchSensorManager.prototype.onOperatingEnd = function (event, operateMode) {
        if (this._isTransformStatus && !this._isMouseMove) {
            if (null !== cameraTarget) {
                this._orbitControl.target = cameraTarget;
            }
        }

        this._isMouseMove = false;
        this._isTouchSensorDown = false;
        this._transformTool.onPointerUp(event);
        this._onOrbitControlOperating(event, operateMode);
    };

    TouchSensorManager.prototype.onZoomOperating = function (event) {
        this._orbitControl.onMouseWheel(event);
    };

    TouchSensorManager.prototype._isSwitchToTransformStatus = function (event) {

        var hitResult = GlobalVar.sceneController.queryModelFrame(event);

        if (0 < hitResult.length) {

            this._transformTool.attachModel(ModelFrameSet.getModelFrame(hitResult[0].object));
            cameraTarget = hitResult[0].object.position;
        }

        return this._transformTool.onPointerDown(event, (0 < hitResult.length) ? hitResult[0].point : null);
    };

    TouchSensorManager.prototype._onOrbitControlOperating = function (event, operateMode) {

        switch (operateMode) {

        case 'onMouseMove':
            this._orbitControl.onMouseMove(event);
            break;
        case 'onTouchMove':
            this._orbitControl.onTouchMove(event);
            break;
        case 'onTouchStart':
            this._orbitControl.onTouchStart(event);
            break;
        case 'onMouseDown':
            this._orbitControl.onMouseDown(event);
            break;
        case 'onMouseUp':
            this._orbitControl.onMouseUp(event);
            break;
        case 'onTouchEnd':
            this._orbitControl.onTouchEnd(event);
            break;
        default:
            break;
        }
    };

    TouchSensorManager.prototype.update = function () {
        this._transformTool.update();
        this._orbitControl.update();
    };

    return TouchSensorManager;
});