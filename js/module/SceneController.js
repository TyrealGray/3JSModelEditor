/* global define, document, window */
define(function (require) {
    'use strict';

    var THREE = require('THREE'),

        SceneManager = require('module/manager/SceneManager'),
        CameraManager = require('module/manager/CameraManager'),
        TouchSensorManager = require('module/manager/TouchSensorManager'),

        ModelFrameSet = require('module/util/ModelFrameSet'),

        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/OrbitControls');

    function SceneController(domElement) {

        this._domElement = domElement;
        this._sceneManager = new SceneManager();
        this._cameraManager = new CameraManager(this._domElement.parentElement.clientWidth, window.innerHeight, domElement);
        this._touchSensorManager = null;

        this._init();
    }

    SceneController.prototype._init = function () {

        GlobalVar.sceneController = this;

        //put this function after this._sceneManager and this._cameraManager initialize
        this._initTouchSensorManager();

        this._bindEvent();
    };

    SceneController.prototype._initTouchSensorManager = function () {
        this._touchSensorManager = new TouchSensorManager();
        GlobalVar.touchSensorManager = this._touchSensorManager;
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
        ModelFrameSet.manageOverlapOtherModel(modelFrame);
    };

    SceneController.prototype.disposeModel = function (modelFrame) {
        this._sceneManager.removeMesh(modelFrame.get().model);
        this._sceneManager.removeStaticMesh(modelFrame.get().box);
        ModelFrameSet.removeModelFrame(modelFrame);
    };

    SceneController.prototype.spawnMesh = function (mesh) {
        this._sceneManager.addStaticMesh(mesh);
    };

    SceneController.prototype.onMouseDown = function (event) {

        GlobalVar.touchSensorManager.onOperatingStart(event, 'onMouseDown');
    };

    SceneController.prototype.onTouchStart = function (event) {

        GlobalVar.touchSensorManager.onOperatingStart(event, 'onTouchStart');
    };

    SceneController.prototype.queryModelFrameByVector = function (origin, direction) {

        var hitResult = this._sceneManager.getVectorHitResultBy(origin, direction, SceneManager.prototype.HIT_RESULT_CHANNEL.MESH);

        if (0 < hitResult.length && null === ModelFrameSet.getModelFrame(hitResult[0].object)) {
            hitResult.length = 0;
        }

        return hitResult;
    };

    SceneController.prototype.queryModelFrame = function (event) {
        var hitResult = this._queryMesh(event);

        if (0 < hitResult.length && null === ModelFrameSet.getModelFrame(hitResult[0].object)) {
            hitResult.length = 0;
        }

        return hitResult;

    };

    SceneController.prototype.queryModelSupport = function (event) {
        var hitResult = this._queryMesh(event);

        if (0 < hitResult.length && null === ModelSupportSet.getModelSupport(hitResult[0].object)) {
            hitResult.length = 0;
        }

        return hitResult;
    };

    SceneController.prototype._queryMesh = function (event) {
        return this._sceneManager.getHitResultBy(event, SceneManager.prototype.HIT_RESULT_CHANNEL.MESH);
    };

    SceneController.prototype.onMouseMove = function (event) {

        GlobalVar.touchSensorManager.onOperatingMove(event, 'onMouseMove');
    };

    SceneController.prototype.onTouchMove = function (event) {

        GlobalVar.touchSensorManager.onOperatingMove(event, 'onTouchMove');
    };

    SceneController.prototype.onMouseUp = function (event) {

        GlobalVar.touchSensorManager.onOperatingEnd(event, 'onMouseUp');
    };

    SceneController.prototype.onTouchEnd = function (event) {

        GlobalVar.touchSensorManager.onOperatingEnd(event, 'onTouchEnd');
    };

    SceneController.prototype.onMouseWheel = function (event) {
        GlobalVar.touchSensorManager.onZoomOperating(event);
    };

    SceneController.prototype.update = function () {
        this._touchSensorManager.update();
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
            camera: this.getCameraManager().get(),
            domElement: this._domElement
        };
    };

    SceneController.prototype.onWindowResize = function () {
        this._cameraManager.get().aspect = this._domElement.parentElement.clientWidth / (window.innerHeight);
        this._cameraManager.get().updateProjectionMatrix();
    };

    return SceneController;

});