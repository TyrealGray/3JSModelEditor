/* global define, console */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        THREE = require('THREE');

    var modelMap = {},
        count = 0;

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
        if (!CommonUtil.isDefined(modelMap[modelFrame.get().model.name])) {
            modelMap[modelFrame.get().model.name].dispose();
            modelMap[modelFrame.get().model.name] = null;
            delete modelMap[modelFrame.get().model.name];
        }
    }

    function getModelFrame(mesh) {

        return modelMap[mesh.name];
    }

    function manageOverlapOtherModel(modelFrame) {

        var overlapBox = null;

        for (var x in modelMap) {

            if (x === modelFrame.get().model.name) {
                continue;
            }

            overlapBox = modelMap[x].checkOverlap(modelFrame);

            if (null === overlapBox) {
                continue;
            }

            var direction = modelMap[x].get().model.position.sub(modelFrame.get().model.position),
                dx = overlapBox.size().x,
                dz = overlapBox.size().z;

            direction.normalize();

            direction.x += 0.05;
            direction.z += 0.05;

            var tempVector = new THREE.Vector3(0, 0, 0);

            do {

                tempVector.copy(direction);

                tempVector.add(modelMap[x].get().model.position);

                modelMap[x].get().model.position.copy(tempVector);

                modelMap[x].update();

            } while (null !== modelMap[x].checkOverlap(modelFrame));

            manageOverlapOtherModel(modelMap[x]);

        }
    }

    exports.addModelFrame = addModelFrame;
    exports.removeModelFrame = removeModelFrame;
    exports.getModelFrame = getModelFrame;
    exports.manageOverlapOtherModel = manageOverlapOtherModel;
});