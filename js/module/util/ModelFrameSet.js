/* global define, console */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        THREE = require('THREE');

    var modelMap = {},
        count = 0,
        direction = new THREE.Vector3(0, 0, 0),
        tempVector = new THREE.Vector3(0, 0, 0);

    function addModelFrame(modelFrame) {

        if (CommonUtil.isDefined(modelMap[modelFrame.get().model.name])) {
            removeModelFrame(modelFrame);
        }

        count++;

        var name = 'ModelFrame ';
        modelFrame.get().model.name = name + count + ' ';
        modelMap[modelFrame.get().model.name] = modelFrame;
    }

    function removeModelFrame(modelFrame) {
        if (CommonUtil.isDefined(modelMap[modelFrame.get().model.name])) {
            modelMap[modelFrame.get().model.name].dispose();
            modelMap[modelFrame.get().model.name] = null;
            delete modelMap[modelFrame.get().model.name];
        }
    }

    function getModelFrame(mesh) {

        if (!CommonUtil.isDefined(modelMap[mesh.name])) {
            return null;
        }

        return modelMap[mesh.name];
    }

    function manageOverlapOtherModel(modelFrame) {

        var overlapBox = null;

        for (var x in modelMap) {

            if (x === modelFrame.get().model.name || !modelMap[x].isOverlap(modelFrame)) {
                continue;
            }

            tempVector.subVectors(modelMap[x].get().model.position, modelFrame.get().model.position);

            direction.copy(tempVector);

            direction.normalize();

            direction.x = (0 < direction.x) ? (direction.x * 10 + 2) : (direction.x * 10 - 2);
            direction.z = (0 < direction.z) ? (direction.z * 10 + 2) : (direction.z * 10 - 2);

            do {

                tempVector.copy(direction);

                tempVector.add(modelMap[x].get().model.position);

                modelMap[x].get().model.position.copy(tempVector);

                modelMap[x].update();

            } while (modelMap[x].isOverlap(modelFrame));

            manageOverlapOtherModel(modelMap[x]);

        }
    }

    exports.addModelFrame = addModelFrame;
    exports.removeModelFrame = removeModelFrame;
    exports.getModelFrame = getModelFrame;
    exports.manageOverlapOtherModel = manageOverlapOtherModel;
});