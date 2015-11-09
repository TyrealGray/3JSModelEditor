/* global define */
define(['THREE'], function (THREE) {

    /**
     * @author TyrealGray / http://tyrealgray.tumblr.com/
     */

    THREE.PlaneGridHelper = function (longSize, widthSize, step) {

        var index = 0,
            len = 0;

        var geometry = new THREE.Geometry();
        var material = new THREE.LineBasicMaterial({
            vertexColors: THREE.VertexColors
        });

        this.lineColor = new THREE.Color(0x444444);

        for (index = -longSize, len = longSize; index <= len; index += step) {

            geometry.vertices.push(
                new THREE.Vector3(index, 0, -widthSize), new THREE.Vector3(index, 0, widthSize)
            );

            geometry.colors.push(this.lineColor, this.lineColor);

        }

        for (index = -widthSize, len = widthSize; index <= len; index += step) {
            geometry.vertices.push(
                new THREE.Vector3(-longSize, 0, index), new THREE.Vector3(longSize, 0, index)
            );

            geometry.colors.push(this.lineColor, this.lineColor);
        }

        THREE.LineSegments.call(this, geometry, material);

    };

    THREE.PlaneGridHelper.prototype = Object.create(THREE.LineSegments.prototype);
    THREE.PlaneGridHelper.prototype.constructor = THREE.PlaneGridHelper;

    THREE.PlaneGridHelper.prototype.setColors = function (lineColor) {

        this.lineColor.set(lineColor);

        this.geometry.colorsNeedUpdate = true;

    };

});