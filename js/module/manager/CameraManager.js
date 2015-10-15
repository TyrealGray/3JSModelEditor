/* global define */
define(function (require) {
    'use strict';

    var THREE = require('THREE');

    function CameraManager(viewportWidth, viewportHeight, domElement) {

        this._camera = new THREE.PerspectiveCamera(75, viewportWidth / viewportHeight, 0.1, 8000);
        this._viewport = domElement;
        this._init();
    }

    CameraManager.prototype._init = function () {
        this._camera.position.set(200, 200, 200);
        //this._camera.lookAt(new THREE.Vector3(0, 0, 0));
    };

    CameraManager.prototype.setPosition = function (x, y, z) {
        this._camera.position.set(x, y, z);
    };

    CameraManager.prototype.lookAt = function (position) {
        this._camera.lookAt(position);
    };

    CameraManager.prototype.getViewport = function () {
        return this._viewport;
    };

    CameraManager.prototype.get = function () {
        return this._camera;
    };

    return CameraManager;

});