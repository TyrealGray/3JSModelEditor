/* global define, document, window */
define(function (require) {
    'use strict';

    var THREE = require('THREE'),

        SceneManager = require('module/manager/SceneManager'),
        CameraManager = require('module/manager/CameraManager'),
        TransformTool = require('module/component/TransformTool'),

        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/OrbitControls');

    var self = null;

    function RendererController(domElement) {

        this._domElement = domElement;
        this._sceneManager = new SceneManager();
        this._cameraManager = new CameraManager(window.innerWidth, window.innerHeight, domElement);
        this._transformTool = null;
        this._orbitControl = null;
        this._isTouchSensorDown = false;
        this._isTransformStatus = false;

        this._init();
    }

    RendererController.prototype._init = function () {

        self = this;
        GlobalVar.cameraManager = this._cameraManager;
        GlobalVar.sceneManager = this._sceneManager;

        this._initTransformControl();
        this._initOrbitControl();

        this._bindRenderDomEvent();
    };

    RendererController.prototype._initTransformControl = function () {
        this._transformTool = new TransformTool(this._domElement);

        GlobalVar.transformTool = this._transformTool;
    };

    RendererController.prototype._initOrbitControl = function () {

        this._orbitControl = new THREE.OrbitControls(this._cameraManager.getRenderInstance(), this._domElement);
        this._orbitControl.enableDamping = true;
        this._orbitControl.dampingFactor = 0.25;
    };

    RendererController.prototype._bindRenderDomEvent = function () {

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

    RendererController.prototype.spawnObject = function (object) {
        this._sceneManager.addMesh(object);
    };

    RendererController.prototype.setCameraLookAt = function (position) {
        this._cameraManager.lookAt(position);
    };

    RendererController.prototype.attachTransformControl = function (mesh) {
        this._transformTool.attach(mesh);
    };

    RendererController.prototype.onMouseMove = function (event) {
        if (!self._isTouchSensorDown) {
            return;
        }

        if (self._isTransformStatus) {
            self._transformTool.onPointerMove(event);
        } else {
            self._orbitControl.onMouseMove(event);
        }
    };

    RendererController.prototype.onMouseUp = function (event) {
        self._isTouchSensorDown = false;
        self._transformTool.onPointerUp(event);
        self._orbitControl.onMouseUp(event);
    };

    RendererController.prototype.onMouseDown = function (event) {

        self._isTouchSensorDown = true;

        self._isTransformStatus = self._isHitModifyMeshObject(event);

        if (!self._isTransformStatus) {
            self._orbitControl.onMouseDown(event);
        }
    };

    RendererController.prototype.onTouchStart = function (event) {
        self._isTouchSensorDown = true;

        self._isTransformStatus = self._isHitModifyMeshObject(event);

        if (!self._isTransformStatus) {
            self._orbitControl.onTouchStart(event);
        }
    };

    RendererController.prototype._isHitModifyMeshObject = function (event) {
        var hitResult = this._sceneManager.getHitResultBy(event, this._sceneManager.HIT_RESULT_CHANNEL.MESH);

        if (0 < hitResult.length) {

            this._transformTool.attach(hitResult[0].object);
        }

        this._isTransformStatus = this._transformTool.onPointerDown(event, (0 < hitResult.length) ? hitResult[0].point : null);

        return this._isTransformStatus;
    };

    RendererController.prototype.onTouchMove = function (event) {
        if (!self._isTouchSensorDown) {
            return;
        }

        if (self._isTransformStatus) {
            self._transformTool.onPointerMove(event);
        } else {
            self._orbitControl.onTouchMove(event);
        }

    };

    RendererController.prototype.onTouchEnd = function (event) {
        self._isTouchSensorDown = false;
        self._transformTool.onPointerUp(event);
        self._orbitControl.onTouchEnd(event);
    };

    RendererController.prototype.onMouseWheel = function (event) {
        self._orbitControl.onMouseWheel(event);
    };

    RendererController.prototype.update = function () {
        this._transformTool.update();
        this._orbitControl.update();
    };

    RendererController.prototype.getRenderTarget = function () {
        return {
            scene: this._sceneManager.getRenderInstance(),
            camera: this._cameraManager.getRenderInstance()
        };
    };

    RendererController.prototype.onWindowResize = function () {
        this._cameraManager.getRenderInstance().aspect = window.innerWidth / window.innerHeight;
        this._cameraManager.getRenderInstance().updateProjectionMatrix();
    };

    return RendererController;

});