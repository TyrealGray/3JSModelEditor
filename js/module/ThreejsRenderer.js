/* global define,window,document,requestAnimationFrame,console */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        THREE = require('THREE'),

        ModelLoader = require('module/component/ModelLoader'),
        SceneController = require('module/SceneController'),

        ModelFrame = require('module/component/ModelFrame');

    var sceneController = null;

    function ThreejsRenderer() {
        this._renderer = new THREE.WebGLRenderer();

        this._init();
    }

    ThreejsRenderer.prototype._init = function () {

        sceneController = new SceneController(this._renderer.domElement);

        this._renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

        this._renderer.setClearColor(0xc8c8c8, 0.85);
        this._renderer.shadowMap.enabled = true;

        document.getElementById('RenderView').appendChild(this._renderer.domElement);
    };

    ThreejsRenderer.prototype.loadLocalModelFiles = function (files) {

        ModelLoader.loadLocalFiles(files, this.onModelLoad);
    };

    ThreejsRenderer.prototype.loadUrlModelFiles = function (url) {
        ModelLoader.loadServerUrl(url, this.onModelLoad);
    };

    ThreejsRenderer.prototype.onModelLoad = function (modelGeometry) {
        if (!CommonUtil.isDefined(modelGeometry)) {
            console.error('loadLocalFiles error');
            return;
        }

        //        var modelMesh = new THREE.Mesh(modelGeometry, new THREE.MeshLambertMaterial({
        //            color: 0xc8c8c8
        //        }));
        //
        //        modelMesh.geometry.center();
        //
        //        modelMesh.material.side = THREE.DoubleSide;
        //
        //        modelMesh.castShadow = true;
        //
        //        modelMesh.position.set(0, 0, 0);
        //
        //        
        //        sceneController.attachTransformControl(modelMesh);
        //
        //        sceneController.setCameraLookAt(modelMesh.position);

        var model = new ModelFrame({
            geometry: modelGeometry
        });

        sceneController.spawnModel(model.get().model);

        sceneController.spawnMesh(model.get().box);

    };

    ThreejsRenderer.prototype.onWindowResize = function () {

        sceneController.onWindowResize();

        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this.render();
    };

    ThreejsRenderer.prototype.render = function () {

        requestAnimationFrame(this.render.bind(this));

        sceneController.update();

        this._renderer.render(sceneController.getRenderTarget().scene,
            sceneController.getRenderTarget().camera);
    };

    return ThreejsRenderer;

});