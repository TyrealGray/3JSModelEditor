/* global define,window,document,requestAnimationFrame,console */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        THREE = require('THREE'),

        ModelLoader = require('module/component/ModelLoader'),

        SceneManager = require('module/manager/SceneManager'),
        CameraManager = require('module/manager/CameraManager'),
        RendererController = require('module/RendererController'),

        GlobalVar = require('module/GlobalVar');

    function ThreejsRenderer() {
        this._renderer = new THREE.WebGLRenderer();

        this._init();
    }

    ThreejsRenderer.prototype._init = function () {

        GlobalVar.sceneManager = new SceneManager(new THREE.Scene());
        GlobalVar.cameraManager = new CameraManager(window.innerWidth, window.innerHeight, this._renderer.domElement);

        this._renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

        this._renderer.setClearColor(0xc8c8c8, 0.85);
        this._renderer.shadowMap.enabled = true;

        GlobalVar.rendererController = new RendererController(this._renderer.domElement);

        document.getElementById('RenderView').appendChild(this._renderer.domElement);
    };

    ThreejsRenderer.prototype.loadLocalModelFiles = function (files) {

        ModelLoader.loadLocalFiles(files, function (modelGeometry) {

            if (!CommonUtil.isDefined(modelGeometry)) {
                console.error('loadLocalFiles error:' + files[0].name);
                return;
            }

            var modelMesh = new THREE.Mesh(modelGeometry, new THREE.MeshLambertMaterial({
                color: 0xc8c8c8
            }));

            modelMesh.geometry.center();

            modelMesh.castShadow = true;

            var size = new THREE.Box3().setFromObject(modelMesh).size();

            modelMesh.position.set(0, 0, 0);

            GlobalVar.cameraManager.setPosition(800, 500, 800);

            GlobalVar.sceneManager.addMesh(modelMesh);

            GlobalVar.rendererController.attachTransformControl(modelMesh);
            GlobalVar.rendererController.setTransformControlSize(2);

            GlobalVar.cameraManager.lookAt(modelMesh.position);
        });
    };

    ThreejsRenderer.prototype.loadUrlModelFiles = function (url) {

    };

    ThreejsRenderer.prototype.render = function () {

        requestAnimationFrame(this.render.bind(this));

        GlobalVar.rendererController.update();

        this._renderer.render(GlobalVar.sceneManager.getRenderInstance(),
            GlobalVar.cameraManager.getRenderInstance());
    };

    return ThreejsRenderer;

});