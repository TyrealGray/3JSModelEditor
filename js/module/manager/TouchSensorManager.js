/* global define */
define(function (require) {
    'use strict';

    function TouchSensorManager() {
        this._status = this.STATUS_TRANSFROM;
    }

    TouchSensorManager.prototype.STATUS_TRANSFROM = 0;

    TouchSensorManager.prototype.STATUS_EDIT_PRINT_SUPPORT = 1;

    TouchSensorManager.prototype.setStatus = function (status) {
        this._status = status;
    };

    TouchSensorManager.prototype.getStatus = function () {
        return this._status;
    };

    TouchSensorManager.prototype.onOperatingStart = function (event, operateMode) {
        //TODO
    };

    TouchSensorManager.prototype.onOperatingMove = function (event, operateMode) {
        //TODO
    };

    TouchSensorManager.prototype.onOperatingEnd = function () {
        //TODO
    };

    return TouchSensorManager;
});