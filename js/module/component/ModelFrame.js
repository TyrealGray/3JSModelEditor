/* global define */
define(function (require) {

    var THREE = require('THREE'),

        GlobalVar = require('module/GlobalVar');

    function ModelFrame(modelDetail) {

        this._model = new THREE.Mesh(modelDetail.geometry, new THREE.MeshLambertMaterial({
            color: 0xc8c8c8
        }));

        this._box = null;

        this._init(modelDetail);
    }

    ModelFrame.prototype._init = function (modelDetail) {

        this._initModel();

        this._initBox();

    };

    ModelFrame.prototype._initModel = function () {

        this._model.geometry.center();

        this._model.material.side = THREE.DoubleSide;

        this._model.castShadow = true;

        this._model.position.set(0, 0, 0);
    };

    ModelFrame.prototype._initBox = function () {
        this._box = new THREE.BoundingBoxHelper(this._model, 0xffff00);
        this._box.update();
    };

    ModelFrame.prototype.update = function () {
        this._box.update();
    };

    ModelFrame.prototype.get = function () {

        return {
            model: this._model,
            box: this._box
        };
    };

    return ModelFrame;
});