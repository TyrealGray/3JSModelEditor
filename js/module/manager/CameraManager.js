define(function (require) {
    'use strict';

    var THREE = require('THREE');

    function CameraManager(camera) {

        this._camera = camera;
        this._init();
    };

    CameraManager.prototype._init = function () {
        this._camera.position.set(0, 100, 100);
        this._camera.lookAt(new THREE.Vector3(0, 50, 50));
    };

    CameraManager.prototype.setPosition = function (x, y, z) {
        this._camera.position.set(x, y, z);
    };

    CameraManager.prototype.lookAt = function (position) {
        this._camera.lookAt(position);
    };

    CameraManager.prototype.getRenderInstance = function () {
        return this._camera;
    };

    return CameraManager;

});