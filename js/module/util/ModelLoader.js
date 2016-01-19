/* global define, window, console, FileReader */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),

        THREE = require('THREE');

    require('thirdLib/threejs/STLLoader');
    require('thirdLib/threejs/OBJLoader');

    var _STLloader = null,
        _OBJloader = null,
        NOT_MODEL_FILE = -1;

    function _initSTLloader() {
        _STLloader = new THREE.STLLoader();
    }

    function _initOBJloader() {
        _OBJloader = new THREE.OBJLoader();
    }

    function loadLocalFiles(files, onModelReady) {

        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            console.error('File APIs are not supported');
            return;
        }

        if (!CommonUtil.isDefined(files)) {
            return;
        }

        if (!isLoaderInit()) {
            initLoader();
        }

        var file = files[0];

        var findStlModelIndex = file.name.search(/\\*.stl/i),
            findObjModelIndex = file.name.search(/\\*.obj/i);

        if (NOT_MODEL_FILE === findObjModelIndex && findObjModelIndex === findStlModelIndex) {
            return;
        }

        var loader = (NOT_MODEL_FILE === findObjModelIndex) ? _STLloader : _OBJloader;

        var reader = new FileReader();

        reader.onload = (function (event) {
            var fileBuf = event.target.result;

            onModelReady(loader.parse(fileBuf));

        });

        reader.readAsArrayBuffer(file); //hack for IE browser,let's assume IE is a browser
    }

    function loadServerUrl(url, onModelReady) {
        if (!isLoaderInit()) {
            initLoader();
        }

        var fileName = url;

        loadModel(fileName, url, onModelReady);
    }

    function loadServerUrlHash(fileName, url, onModelReady) {

        if (!isLoaderInit()) {
            initLoader();
        }

        loadModel(fileName, url, onModelReady);
    }

    function loadModel(fileName, url, onModelReady) {

        var findStlModelIndex = fileName.search(/\\*.stl/i),
            findObjModelIndex = fileName.search(/\\*.obj/i);

        if (NOT_MODEL_FILE === findObjModelIndex && findObjModelIndex === findStlModelIndex) {
            return;
        }

        var loader = (NOT_MODEL_FILE === findObjModelIndex) ? _STLloader : _OBJloader;

        loader.load(url, onModelReady);
    }

    function loadStl(data, onModelReady) {

        if (!CommonUtil.isDefined(_STLloader)) {
            _initSTLloader();
        }

        var loader = _STLloader;

        onModelReady(loader.parse(data));
    }

    function initLoader() {
        _initOBJloader();
        _initSTLloader();
    }

    function isLoaderInit() {
        return (CommonUtil.isDefined(_STLloader) && CommonUtil.isDefined(_OBJloader));
    }

    exports.loadStl = loadStl;
    exports.loadLocalFiles = loadLocalFiles;
    exports.loadServerUrl = loadServerUrl;
    exports.loadServerUrlHash = loadServerUrlHash;

});