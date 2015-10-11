/* global define,window,document,requestAnimationFrame,console */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        THREE = require('THREE'),

        ModelLoader = require('module/component/ModelLoader'),
        RendererController = require('module/RendererController'),

        GlobalVar = require('module/GlobalVar');

    var rendererController = null;

    function ThreejsRenderer() {
        this._renderer = new THREE.WebGLRenderer();

        this._init();
    }

    ThreejsRenderer.prototype._init = function () {

        rendererController = new RendererController(this._renderer.domElement);

        GlobalVar.rendererController = rendererController;

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

        var modelMesh = new THREE.Mesh(modelGeometry, new THREE.MeshLambertMaterial({
            color: 0xc8c8c8
        }));

        modelMesh.geometry.center();

        modelMesh.castShadow = true;

        var size = new THREE.Box3().setFromObject(modelMesh).size();

        modelMesh.position.set(0, 0, 0);

        GlobalVar.sceneManager.addMesh(modelMesh);

        rendererController.attachTransformControl(modelMesh);

        rendererController.setCameraLookAt(modelMesh.position);
    };

    ThreejsRenderer.prototype.onWindowResize = function () {

        rendererController.onWindowResize();

        this._renderer.setSize(window.innerWidth, window.innerHeight);

        this.render();
    };

    ThreejsRenderer.prototype.render = function () {

        requestAnimationFrame(this.render.bind(this));

        rendererController.update();

        this._renderer.render(rendererController.getRenderTarget().scene,
            rendererController.getRenderTarget().camera);
    };

    return ThreejsRenderer;

});