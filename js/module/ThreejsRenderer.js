/* global define,window,document,requestAnimationFrame,console,setTimeout */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        THREE = require('THREE'),

        SceneController = require('module/SceneController'),

        ModelFrame = require('module/component/ModelFrame'),

        ModelLoader = require('module/util/ModelLoader'),

        GlobalVar = require('module/GlobalVar');

    var sceneController = null,
        jsonLoader = null;

    function ThreejsRenderer() {
        this._renderer = new THREE.WebGLRenderer();

        this._init();
    }

    ThreejsRenderer.prototype._init = function () {

        document.getElementById('RenderView').appendChild(this._renderer.domElement);

        sceneController = new SceneController(this._renderer.domElement);

        this._renderer.setSize(this._renderer.domElement.parentElement.clientWidth, window.innerHeight * 0.95);

        this._renderer.setClearColor(0xc8c8c8, 0.85);
        this._renderer.shadowMap.enabled = true;

        setTimeout(function () {
            GlobalVar.frameRenderer.onWindowResize();
        }, 600);

    };

    ThreejsRenderer.prototype.loadLocalModelFiles = function (files) {

        ModelLoader.loadLocalFiles(files, this.onModelLoad);
    };

    ThreejsRenderer.prototype.loadUrlModelFiles = function (url) {
        ModelLoader.loadServerUrl(url, this.onModelLoad);
    };

    ThreejsRenderer.prototype.loadUrlHashModel = function (fileName, url) {
        ModelLoader.loadServerUrlHash(fileName, url, this.onModelLoad);
    };

    ThreejsRenderer.prototype.loadStlModelArrayBuffer = function (buffer) {
        ModelLoader.loadStl(buffer, this.onModelLoad);
    };

    ThreejsRenderer.prototype.loadModelByArrayBuffer = function (fileName, buffer) {
        ModelLoader.loadStl(fileName, buffer, this.onModelLoad);
    };

    ThreejsRenderer.prototype.loadUrlJsonModel = function (url) {

        if (null === jsonLoader) {
            jsonLoader = new THREE.JSONLoader();
        }

        jsonLoader.load(url, this.onModelLoad);
    };

    ThreejsRenderer.prototype.onModelLoad = function (modelGeometry) {
        if (!CommonUtil.isDefined(modelGeometry)) {
            console.error('loadModelFile error');
            return;
        }

        var model = new ModelFrame(modelGeometry);

        sceneController.spawnModel(model);

        GlobalVar.transformTool.attachModel(model);
    };

    ThreejsRenderer.prototype.onWindowResize = function () {

        sceneController.onWindowResize();

        this._renderer.setSize(this._renderer.domElement.parentElement.clientWidth, window.innerHeight * 0.95);
    };

    ThreejsRenderer.prototype.render = function () {

        requestAnimationFrame(this.render.bind(this));

        sceneController.update();

        this._renderer.render(sceneController.getRenderTarget().scene,
            sceneController.getRenderTarget().camera);
    };

    return ThreejsRenderer;

});