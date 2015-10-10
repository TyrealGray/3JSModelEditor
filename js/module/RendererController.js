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

        this._domElement.addEventListener("touchstart", this.onTouchStart, false);
        this._domElement.addEventListener("touchmove", this.onTouchMove, false);
        this._domElement.addEventListener("touchend", this.onTouchEnd, false);

        this._domElement.addEventListener("touchcancel", this.onMouseUp, false);
        this._domElement.addEventListener("touchleave", this.onMouseUp, false);

        //TODO change those function to mainFrame.js
        document.getElementById('translateButton').addEventListener('click', function (event) {
            self._transformTool.setMode(TransformTool.prototype.TRANSFORM_MODE.TRANSFORM);
        });

        document.getElementById('rotateButton').addEventListener('click', function (event) {
            self._transformTool.setMode(TransformTool.prototype.TRANSFORM_MODE.ROTATE);
        });
        document.getElementById('scaleButton').addEventListener('click', function (event) {
            self._transformTool.setMode(TransformTool.prototype.TRANSFORM_MODE.SCALE);
        });
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

        var hitResult = GlobalVar.sceneManager.getHitResultBy(event, GlobalVar.sceneManager.HIT_RESULT_CHANNEL.MESH);

        self._isTransformStatus = self._transformTool.onPointerDown(event, (0 < hitResult.length) ? hitResult[0].point : null);

        if (0 < hitResult.length) {

            self._transformTool.attach(hitResult[0].object);
            return;
        }

        if (!self._isTransformStatus) {
            self._orbitControl.onMouseDown(event);
        }
    };

    RendererController.prototype.onTouchStart = function (event) {
        self._isTouchSensorDown = true;
    };

    RendererController.prototype.onTouchMove = function (event) {
        if (!self._isTouchSensorDown) {
            return;
        }

        self._orbitControl.onTouchMove(event);
    };

    RendererController.prototype.onTouchEnd = function (event) {

    };

    RendererController.prototype.onMouseWheel = function (event) {
        self._orbitControl.onMouseWheel(event);
    };

    RendererController.prototype.update = function () {
        this._transformTool.update();
        self._orbitControl.update();
    };

    RendererController.prototype.getRenderTarget = function () {
        return {
            scene: this._sceneManager.getRenderInstance(),
            camera: this._cameraManager.getRenderInstance()
        };
    };

    return RendererController;

});