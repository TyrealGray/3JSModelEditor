/* global define, document, window */
define(function (require) {
    'use strict';

    var THREE = require('THREE'),

        SceneManager = require('module/manager/SceneManager'),
        CameraManager = require('module/manager/CameraManager'),
        TransformTool = require('module/component/TransformTool'),

        ModelFrameSet = require('module/util/ModelFrameSet'),

        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/OrbitControls');

    var self = null,
        cameraTarget = null;

    function SceneController(domElement) {

        this._domElement = domElement;
        this._sceneManager = new SceneManager();
        this._cameraManager = new CameraManager(this._domElement.parentElement.clientWidth, window.innerHeight, domElement);
        this._transformTool = null;
        this._orbitControl = null;
        this._isTouchSensorDown = false;
        this._isMouseMove = false;
        this._isTransformStatus = false;

        this._init();
    }

    SceneController.prototype._init = function () {

        self = this;
        GlobalVar.sceneController = this;

        this._initTransformControl();
        this._initOrbitControl();

        this._bindEvent();
    };

    SceneController.prototype._initTransformControl = function () {
        this._transformTool = new TransformTool(this._domElement);

        GlobalVar.transformTool = this._transformTool;
    };

    SceneController.prototype._initOrbitControl = function () {

        this._orbitControl = new THREE.OrbitControls(this._cameraManager.get(), this._domElement);
        this._orbitControl.enableDamping = true;
        this._orbitControl.enablePan = false;
    };

    SceneController.prototype._bindEvent = function () {

        this._domElement.addEventListener("mousedown", this.onMouseDown, false);
        this._domElement.addEventListener("mousemove", this.onMouseMove, false);
        this._domElement.addEventListener("mouseup", this.onMouseUp, false);
        this._domElement.addEventListener("mouseout", this.onMouseUp, false);

        this._domElement.addEventListener("mousewheel", this.onMouseWheel, false);
        this._domElement.addEventListener('DOMMouseScroll', this.onMouseWheel, false); // firefox

        this._domElement.addEventListener("touchstart", this.onTouchStart, false);
        this._domElement.addEventListener("touchmove", this.onTouchMove, false);
        this._domElement.addEventListener("touchend", this.onTouchEnd, false);

        this._domElement.addEventListener("touchcancel", this.onMouseUp, false);
        this._domElement.addEventListener("touchleave", this.onMouseUp, false);
    };

    SceneController.prototype.spawnModel = function (modelFrame) {
        ModelFrameSet.addModelFrame(modelFrame);
        this._sceneManager.addMesh(modelFrame.get().model);
        this._sceneManager.addStaticMesh(modelFrame.get().box);
        modelFrame.update();
    };

    SceneController.prototype.disposeModel = function (modelFrame) {
        this._sceneManager.removeMesh(modelFrame.get().model);
        this._sceneManager.removeStaticMesh(modelFrame.get().box);
        ModelFrameSet.removeModelFrame(modelFrame);
    };

    SceneController.prototype.spawnMesh = function (mesh) {
        this._sceneManager.addStaticMesh(mesh);
    };

    SceneController.prototype.setCameraLookAt = function (position) {
        this._cameraManager.lookAt(position);
    };

    SceneController.prototype.attachTransformControl = function (mesh) {
        this._transformTool.attach(mesh);
    };

    SceneController.prototype.onMouseDown = function (event) {

        self._onOperatingStartEvent(event, 'onMouseDown');
    };

    SceneController.prototype.onTouchStart = function (event) {

        self._onOperatingStartEvent(event, 'onTouchStart');
    };

    SceneController.prototype._onOperatingStartEvent = function (event, operateMode) {
        this._isTouchSensorDown = true;

        this._isHitModifyMeshObject(event);

        if (!this._isTransformStatus) {
            this._onOrbitControlOperating(event, operateMode);
        }
    };

    SceneController.prototype._isHitModifyMeshObject = function (event) {
        var hitResult = this._sceneManager.getHitResultBy(event, this._sceneManager.HIT_RESULT_CHANNEL.MESH);

        if (0 < hitResult.length) {

            this._transformTool.attachModel(ModelFrameSet.getModelFrame(hitResult[0].object));
            cameraTarget = hitResult[0].object.position;
        }

        this._isTransformStatus = this._transformTool.onPointerDown(event, (0 < hitResult.length) ? hitResult[0].point : null);
    };

    SceneController.prototype.onMouseMove = function (event) {

        self._onOperatingMoveEvent(event, 'onMouseMove');
    };

    SceneController.prototype.onTouchMove = function (event) {

        self._onOperatingMoveEvent(event, 'onTouchMove');
    };

    SceneController.prototype._onOperatingMoveEvent = function (event, operateMode) {
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

    SceneController.prototype.onMouseUp = function (event) {

        self._onOperatingEventEnd(event, 'onMouseUp');
    };

    SceneController.prototype.onTouchEnd = function (event) {

        self._onOperatingEventEnd(event, 'onTouchEnd');
    };

    SceneController.prototype.onMouseWheel = function (event) {
        self._orbitControl.onMouseWheel(event);
    };

    SceneController.prototype._onOperatingEventEnd = function (event, operateMode) {
        if (this._isTransformStatus && !self._isMouseMove) {
            if (null !== cameraTarget) {
                self._orbitControl.target = cameraTarget;
            }
        }

        this._isMouseMove = false;
        this._isTouchSensorDown = false;
        this._transformTool.onPointerUp(event);
        this._onOrbitControlOperating(event, operateMode);
    };

    SceneController.prototype._onOrbitControlOperating = function (event, operateMode) {

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

    SceneController.prototype.update = function () {
        this._transformTool.update();
        this._orbitControl.update();
    };

    SceneController.prototype.getCameraManager = function () {
        return this._cameraManager;
    };

    SceneController.prototype.getSceneManager = function () {
        return this._sceneManager;
    };

    SceneController.prototype.getRenderTarget = function () {
        return {
            scene: this.getSceneManager().get(),
            camera: this.getCameraManager().get()
        };
    };

    SceneController.prototype.onWindowResize = function () {
        this._cameraManager.get().aspect = this._domElement.parentElement.clientWidth / (window.innerHeight);
        this._cameraManager.get().updateProjectionMatrix();
    };

    return SceneController;

});