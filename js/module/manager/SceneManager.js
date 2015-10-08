/* global define */
define(function (require) {
    'use strict';

    var THREE = require('THREE');

    function SceneManager(scene) {
        this._scene = scene;
        this._init();
    }

    SceneManager.prototype._init = function () {

        var light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(1, 1, 1);

        this.addMesh(new THREE.GridHelper(500, 100));

        this.addLight(light);
        this.addLight(new THREE.AmbientLight("#112255"));

    };

    SceneManager.prototype.getRenderInstance = function () {
        return this._scene;
    };

    SceneManager.prototype.addLight = function (light) {
        this._scene.add(light);
    };

    SceneManager.prototype.addMesh = function (mesh) {
        this._scene.add(mesh);
    };

    SceneManager.prototype.removeMesh = function (mesh) {
        this._scene.remove(mesh);
    };

    return SceneManager;
});