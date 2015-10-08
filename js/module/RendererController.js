/* global define, document */
define(function (require) {

    var THREE = require('THREE'),

        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/TransformControls');

    var transformControl = null,
        cameraManager = null;

    function RendererController(domElement) {
        this._init((domElement !== undefined) ? domElement : document);
    }

    RendererController.prototype._init = function (domElement) {

        domElement.addEventListener("mousedown", this.onMouseDown, false);
        domElement.addEventListener("touchstart", this.onMouseDown, false);

        domElement.addEventListener("mousemove", this.onMouseMove, false);
        domElement.addEventListener("touchmove", this.onMouseMove, false);

        domElement.addEventListener("mouseup", this.onMouseUp, false);
        domElement.addEventListener("mouseout", this.onMouseUp, false);
        domElement.addEventListener("touchend", this.onMouseUp, false);
        domElement.addEventListener("touchcancel", this.onMouseUp, false);
        domElement.addEventListener("touchleave", this.onMouseUp, false);

        transformControl = new THREE.TransformControls(GlobalVar.cameraManager.getRenderInstance(), domElement);

        GlobalVar.sceneManager.addMesh(transformControl);
    };

    RendererController.prototype.onMouseMove = function (event) {
        transformControl.onPointerMove(event);
    };

    RendererController.prototype.onMouseUp = function (event) {
        transformControl.onPointerUp(event);
    };

    RendererController.prototype.onMouseDown = function (event) {

        var isClickOnMesh = false;

        if (!isClickOnMesh) {
            transformControl.onPointerDown(event);
        }
    };

    RendererController.prototype.attachTransformControl = function (mesh) {
        transformControl.attach(mesh);
    };

    RendererController.prototype.setTransformControlSize = function (size) {
        transformControl.size = size;
    };

    RendererController.prototype.update = function () {
        transformControl.update();
    };

    return RendererController;

});