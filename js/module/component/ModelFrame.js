/* global define */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),

        THREE = require('THREE'),

        GlobalVar = require('module/GlobalVar');

    function ModelFrame(modelGeometry) {

        this._axisDirection = {
            x: 1,
            y: 1,
            z: 1
        };

        this._model = new THREE.Mesh(modelGeometry, new THREE.MeshLambertMaterial({
            color: this.UNSELECT_COLOR
        }));

        this._boundingBox = null;

        this._init();
    }

    ModelFrame.prototype.SELECT_COLOR = 0x005858;
    ModelFrame.prototype.BOX_SELECT_COLOR = 0x8bd813;
    ModelFrame.prototype.BOX_UNSELECT_COLOR = 0x281858;
    ModelFrame.prototype.UNSELECT_COLOR = 0xc8c8c8;

    ModelFrame.prototype.clone = function () {
        var cloneGeometry = this._model.geometry.clone();

        return new ModelFrame(cloneGeometry);
    };

    ModelFrame.prototype._init = function () {

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

        this._boundingBox = new THREE.BoxHelper(this._model);
        this._boundingBox.material.setValues({
            color: this.BOX_UNSELECT_COLOR
        });

        this._boundingVolume = new THREE.BoundingBoxHelper(this._model, this.BOX_UNSELECT_COLOR);

        this._boundingVolume.update();
    };

    ModelFrame.prototype.isOverlap = function (otherModelFrame) {

        otherModelFrame.get().model.updateMatrix();
        this._model.updateMatrix();

        var otherBoundingBox = otherModelFrame.get().boxVolume;

        otherBoundingBox.box.setFromObject(otherModelFrame.get().model);
        this._boundingVolume.box.setFromObject(this._model);

        return this._boundingVolume.box.isIntersectionBox(otherBoundingBox.box);

    };

    ModelFrame.prototype.mirrorX = function () {
        if (!CommonUtil.isDefined(this._model)) {
            return;
        }

        this._axisDirection.x *= (-1);

        this._mirror(-1, 1, 1);
    };

    ModelFrame.prototype.mirrorY = function () {
        if (!CommonUtil.isDefined(this._model)) {
            return;
        }

        this._axisDirection.y *= (-1);

        this._mirror(1, -1, 1);
    };

    ModelFrame.prototype.mirrorZ = function () {
        if (!CommonUtil.isDefined(this._model)) {
            return;
        }

        this._axisDirection.z *= (-1);

        this._mirror(1, 1, -1);
    };

    ModelFrame.prototype._mirror = function (x, y, z) {

        this._model.geometry.applyMatrix(new THREE.Matrix4().makeScale(x, y, z));

        this.update();
    };

    ModelFrame.prototype.setScale = function (x, y, z) {
        this.getScale().set(x, y, z);
        this.update();
    };

    ModelFrame.prototype.getScale = function () {
        return this._model.scale;
    };

    ModelFrame.prototype.getSize = function () {

        this.update();

        return this._boundingVolume.box.size();
    };

    ModelFrame.prototype.reset = function () {

        this.setScale(1, 1, 1);
        this._model.rotation.set(0, 0, 0);
        this._mirror(this._axisDirection.x, this._axisDirection.y, this._axisDirection.z);
        this._axisDirection = {
            x: 1,
            y: 1,
            z: 1
        };
    };

    ModelFrame.prototype.update = function () {

        this._model.updateMatrix();

        this._boundingBox.update(this._model);

        this._boundingVolume.box.setFromObject(this._model);
    };

    ModelFrame.prototype.dispose = function () {
        this._model.geometry.dispose();
        this._model.material.dispose();
        this._boundingBox.geometry.dispose();
        this._boundingBox.material.dispose();
        this._boundingVolume.geometry.dispose();
        this._boundingVolume.material.dispose();
    };

    ModelFrame.prototype.get = function () {

        return {
            model: this._model,
            box: this._boundingBox,
            boxVolume: this._boundingVolume
        };
    };


    ModelFrame.prototype.setColor = function (color) {
        this._model.material.setValues({
            color: color
        });
    };

    ModelFrame.prototype.setPosition = function (position) {
        this._model.position.set(position.x, position.y, position.z);
        this.update();
    };

    ModelFrame.prototype.selected = function () {
        this._model.material.transparent = true;
        this._model.material.opacity = 0.8;

        this._boundingBox.material.setValues({
            color: this.BOX_SELECT_COLOR
        });

        this.setColor(this.SELECT_COLOR);
    };

    ModelFrame.prototype.unselected = function () {
        this._model.material.transparent = false;
        this._model.material.opacity = 1.0;

        this._boundingBox.material.setValues({
            color: this.BOX_UNSELECT_COLOR
        });

        this.setColor(this.UNSELECT_COLOR);
    };

    return ModelFrame;
});