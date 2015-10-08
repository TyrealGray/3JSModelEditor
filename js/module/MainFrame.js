/* global define,document */
define(function (require) {
    'use strict';

    var ThreejsRenderer = require('module/ThreejsRenderer'),

        GlobalVar = require('module/GlobalVar');

    function MainFrame() {

        GlobalVar.frameRenderer = new ThreejsRenderer();

        this._init();
    }

    MainFrame.prototype._init = function () {

        var frameRenderer = GlobalVar.frameRenderer;

        frameRenderer.render();

        document.getElementById('LoadModelButton').addEventListener("change", function (uploader) {
            frameRenderer.loadLocalModelFiles(uploader.target.files);
        });

        //        document.addEventListener("mousedown", function (event) {
        //            event.preventDefault();
        //
        //            var mainFrame = GlobalVar.mainFrame;
        //
        //            var vector = new THREE.Vector3((event.clientX / mainFrame._renderer.domElement.offsetWidth) * 2 - 1, -(event.clientY / mainFrame._renderer.domElement.offsetHeight) * 2 + 1, 0.5);
        //
        //            vector.unproject(vector, mainFrame._camera);
        //
        //            var raycaster = new THREE.Raycaster(
        //                mainFrame._camera.position,
        //                vector.sub(mainFrame._camera.position).normalize()
        //            );
        //
        //            var intersects = null;
        //
        //            if (null === loadedObj || undefined === loadedObj || 'undefined' === loadedObj) {
        //                intersects = raycaster.intersectObjects([cube, cube2]);
        //            } else {
        //                intersects = raycaster.intersectObjects([cube, cube2, loadedObj]);
        //            }
        //
        //            if (intersects.length > 0) {
        //
        //                if (intersects[0].object.material.transparent) {
        //                    intersects[0].object.material.opacity = 1.0;
        //                    intersects[0].object.material.transparent = false;
        //                } else {
        //                    intersects[0].object.material.transparent = true;
        //                    intersects[0].object.material.opacity = 0.1;
        //                }
        //
        //            }
        //        });

    };


    return MainFrame;

});