/* global define, document */
define(function (require) {

    var THREE = require('THREE'),

        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/TransformControls');

    var transformControl = null;

    function RendererController(camera, domElement) {
        this._domElement = (domElement !== undefined) ? domElement : document;
        this._init();
    }

    RendererController.prototype._init = function () {

        this._domElement.addEventListener("mousedown", this.onMouseDown, false);
        this._domElement.addEventListener("touchstart", this.onMouseDown, false);

        this._domElement.addEventListener("mousemove", this.onMouseMove, false);
        this._domElement.addEventListener("touchmove", this.onMouseMove, false);

        this._domElement.addEventListener("mouseup", this.onMouseUp, false);
        this._domElement.addEventListener("mouseout", this.onMouseUp, false);
        this._domElement.addEventListener("touchend", this.onMouseUp, false);
        this._domElement.addEventListener("touchcancel", this.onMouseUp, false);
        this._domElement.addEventListener("touchleave", this.onMouseUp, false);

        transformControl = new THREE.TransformControls(GlobalVar.cameraManager.getRenderInstance(), this._domElement);

        GlobalVar.sceneManager.addMesh(transformControl);
    };

    RendererController.prototype.onMouseMove = function (event) {
        transformControl.onPointerMove(event);
    };

    RendererController.prototype.onMouseUp = function (event) {
        transformControl.onPointerUp(event);
    };

    RendererController.prototype.onMouseDown = function (event) {
        transformControl.onPointerDown(event);
    };

    RendererController.prototype.attachTransformControl = function (mesh) {
        transformControl.attach(mesh);
    };

    RendererController.prototype.setTransformControlSize = function (size) {
        transformControl.size = size;
    }

    RendererController.prototype.update = function () {
        transformControl.update();
    };

    return RendererController;

});