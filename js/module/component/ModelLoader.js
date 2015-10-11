/* global define, window, console, FileReader */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),

        THREE = require('THREE'),

        GlobalVar = require('module/GlobalVar');

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

        if (!CommonUtil.isDefined(_STLloader) || !CommonUtil.isDefined(_OBJloader)) {
            _initOBJloader();
            _initSTLloader();
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

        reader.readAsBinaryString(file);
    }

    function loadServerUrl(url, onModelReady) {
        if (!CommonUtil.isDefined(_STLloader) || !CommonUtil.isDefined(_OBJloader)) {
            _initOBJloader();
            _initSTLloader();
        }

        var findStlModelIndex = url.search(/\\*.stl/i),
            findObjModelIndex = url.search(/\\*.obj/i);

        if (NOT_MODEL_FILE === findObjModelIndex && findObjModelIndex === findStlModelIndex) {
            return;
        }

        var loader = (NOT_MODEL_FILE === findObjModelIndex) ? _STLloader : _OBJloader;

        loader.load(url, onModelReady);
    }


    exports.loadLocalFiles = loadLocalFiles;
    exports.loadServerUrl = loadServerUrl;

});