/* global define, document */
define(function (require) {

    var THREE = require('THREE'),

        GlobalVar = require('module/GlobalVar');

    require('thirdLib/threejs/TransformControls');
    require('thirdLib/threejs/OrbitControls');

    var transformControl = null,
        orbitControl = null,
        cameraManager = null,
        isPointerDown = false;

    function RendererController(domElement) {
        this._init((domElement !== undefined) ? domElement : document);
    }

    RendererController.prototype._init = function (domElement) {
        domElement.addEventListener("mousedown", this.onMouseDown, false);
        domElement.addEventListener("mousemove", this.onMouseMove, false);
        domElement.addEventListener("mouseup", this.onMouseUp, false);
        domElement.addEventListener("mouseout", this.onMouseUp, false);

        domElement.addEventListener("mousewheel", this.onMouseWheel, false);

        domElement.addEventListener("touchstart", this.onTouchStart, false);
        domElement.addEventListener("touchmove", this.onTouchMove, false);
        domElement.addEventListener("touchend", this.onTouchEnd, false);

        domElement.addEventListener("touchcancel", this.onMouseUp, false);
        domElement.addEventListener("touchleave", this.onMouseUp, false);

        transformControl = new THREE.TransformControls(GlobalVar.cameraManager.getRenderInstance(), domElement);
        transformControl.setSpace('world');

        orbitControl = new THREE.OrbitControls(GlobalVar.cameraManager.getRenderInstance(), domElement);
        orbitControl.enableDamping = true;
        orbitControl.dampingFactor = 0.25;

        GlobalVar.sceneManager.addStaticMesh(transformControl);

        document.getElementById('translateButton').addEventListener('click', function (event) {
            transformControl.setMode('translate');
            transformControl.setSpace('world');
        });

        document.getElementById('rotateButton').addEventListener('click', function (event) {
            transformControl.setMode('rotate');
            transformControl.setSpace('world');
        });
        document.getElementById('scaleButton').addEventListener('click', function (event) {
            transformControl.setMode('scale');
            transformControl.setSpace('local');
        });

    };

    RendererController.prototype.onMouseMove = function (event) {
        if (!isPointerDown) {
            return;
        }
        //transformControl.axis = "XZ";
        transformControl.onPointerMove(event);
        orbitControl.onMouseMove(event);
    };

    RendererController.prototype.onMouseUp = function (event) {
        isPointerDown = false;
        transformControl.onPointerUp(event);
        orbitControl.onMouseUp(event);
    };

    RendererController.prototype.onMouseDown = function (event) {

        isPointerDown = true;

        var isTransformToolClicked = transformControl.onPointerDown(event);

        var hitResult = GlobalVar.sceneManager.getHitResultBy(event, GlobalVar.sceneManager.HIT_RESULT_CHANNEL.MESH);

        if (0 < hitResult.length) {
            //            if (hitResult[0].object.material.transparent) {
            //                hitResult[0].object.material.opacity = 1.0;
            //                hitResult[0].object.material.transparent = false;
            //            } else {
            //                hitResult[0].object.material.transparent = true;
            //                hitResult[0].object.material.opacity = 0.1;
            //            }

            transformControl.attach(hitResult[0].object);
            return;
        }

        if (!isTransformToolClicked) {
            orbitControl.onMouseDown(event);
        }
    };

    RendererController.prototype.onTouchStart = function (event) {
        isPointerDown = true;
    };

    RendererController.prototype.onTouchMove = function (event) {
        if (!isPointerDown) {
            return;
        }

        orbitControl.onTouchMove(event);
    };

    RendererController.prototype.onTouchEnd = function (event) {

    };

    RendererController.prototype.onMouseWheel = function (event) {
        orbitControl.onMouseWheel(event);
    };

    RendererController.prototype.attachTransformControl = function (mesh) {
        transformControl.attach(mesh);
    };

    RendererController.prototype.setTransformControlSize = function (size) {
        transformControl.size = size;
    };

    RendererController.prototype.update = function () {
        transformControl.update();
        orbitControl.update();
    };

    return RendererController;

});