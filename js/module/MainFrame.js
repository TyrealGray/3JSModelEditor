/* global define,document, alert */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),

        MainContent = require('module/interface/MainContent');

    function MainFrame() {

        this._mainContent = null;

        this._init();
    }

    MainFrame.prototype._init = function () {

        this._mainContent = new MainContent();
    };

    MainFrame.prototype.onWindowResize = function () {

        if (!CommonUtil.isDefined(this._mainContent)) {
            return;
        }

        this._mainContent.onWindowResize();
    };

    return MainFrame;

});