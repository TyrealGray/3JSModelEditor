/* global define */
define(function (require) {
    'use strict';

    var THREE = require('THREE'),

        GlobalVar = require('module/GlobalVar');

    var pointerVector = new THREE.Vector2(0, 0, 0),
        ray = new THREE.Raycaster(),
        vectorRay = new THREE.Raycaster();

    vectorRay.near = 2.5;

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

        var gridHelper = new THREE.GridHelper(80, 10);

        gridHelper.setColors(0xd8d8d8, 0x666888);

        this.addStaticMesh(gridHelper);

        var light = new THREE.DirectionalLight(0xffffff, 1.89);
        light.position.set(-1, -1, -1).normalize();

        this.addLight(light);

        light = new THREE.DirectionalLight(0xffffff, 1.2);
        light.position.set(1, 1, 1).normalize();

        this.addLight(light);

        this.addLight(new THREE.AmbientLight("#556699"));
        
        this.addStaticMesh(new THREE.CubeCamera(0.1, 5000, 512));
        
        this._scene.fog = new THREE.FogExp2('0xcacaca', 0.007);

    };

    SceneManager.prototype.get = function () {
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

    SceneManager.prototype.getVectorHitResultBy = function (origin, direction, channel) {
        vectorRay.set(origin, direction);
        var hitResult = null;

        switch (channel) {
        case this.HIT_RESULT_CHANNEL.MESH:
            hitResult = vectorRay.intersectObjects(this._meshes, true);
            break;
        default:
            break;
        }

        return hitResult;
    };

    SceneManager.prototype.getHitResultBy = function (event, channel) {
        event.preventDefault();

        var cameraManager = GlobalVar.sceneController.getCameraManager();
        var viewport = cameraManager.getViewport();

        var rect = viewport.getBoundingClientRect();
        var x = (event.clientX - rect.left) / rect.width;
        var y = (event.clientY - rect.top) / rect.height;


        pointerVector.set((x * 2) - 1, -(y * 2) + 1);
        ray.setFromCamera(pointerVector, cameraManager.get());

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