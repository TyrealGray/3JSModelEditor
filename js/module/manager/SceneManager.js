/* global define */
define(function (require) {
    'use strict';

    var THREE = require('THREE'),
        GlobalVar = require('module/GlobalVar');

    var pointerVector = new THREE.Vector2(0, 0, 0),
        ray = new THREE.Raycaster();

    function SceneManager(scene) {
        this._scene = new THREE.Scene();
        this._init();
        this._meshes = [];
    }

    SceneManager.prototype.HIT_RESULT_CHANNEL = {
        MESH: 0,
        STATIC_MESH: 1
    };

    SceneManager.prototype._init = function () {

        this.addStaticMesh(new THREE.GridHelper(80, 80));

        var light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(1, 1, 1);

        this.addLight(light);

        light = new THREE.DirectionalLight(0xffffff, 0.85);
        light.position.set(-1, -1, -1);

        this.addLight(light);

        this.addLight(new THREE.AmbientLight("#556699"));

    };

    SceneManager.prototype.getRenderInstance = function () {
        return this._scene;
    };

    SceneManager.prototype.addLight = function (light) {
        this._scene.add(light);
    };

    SceneManager.prototype.addMesh = function (mesh) {
        this._scene.add(mesh);

        this._meshes.push(mesh);
    };

    SceneManager.prototype.removeMesh = function (mesh) {
        this._scene.remove(mesh);

        var index = this._meshes.indexOf(mesh);
        var isInMeshesArray = (index > -1);

        if (isInMeshesArray) {
            this._meshes.splice(index, 1);
        }
    };

    SceneManager.prototype.addStaticMesh = function (staticMesh) {
        this._scene.add(staticMesh);
    };

    SceneManager.prototype.removeStaticMesh = function (staticMesh) {
        this._scene.remove(staticMesh);
    };

    SceneManager.prototype.getHitResultBy = function (event, channel) {
        event.preventDefault();

        var cameraManager = GlobalVar.cameraManager;
        var viewport = cameraManager.getViewport();

        var rect = viewport.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;


        pointerVector.set((x * 2) - 1, -(y * 2) + 1);
        ray.setFromCamera(pointerVector, cameraManager.getRenderInstance());

        var hitResult = null;

        switch (channel) {
        case this.HIT_RESULT_CHANNEL.MESH:
            hitResult = ray.intersectObjects(this._meshes, true);
            break;
        default:
            break;
        }

        return hitResult;
    };

    return SceneManager;
});