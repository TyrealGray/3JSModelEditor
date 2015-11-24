/* global define,document,alert */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),

        Mustache = require('thirdLib/mustache.min'),

        MainContentTemplate = require('text!../../../html/MainContent.html'),

        ThreejsRenderer = require('module/ThreejsRenderer'),

        MainTitle = require('module/interface/MainTitle'),

        GlobalVar = require('module/GlobalVar');

    function MainContent() {

        this._init();
    }

    MainContent.prototype._init = function () {

        this._initPage();

        this._initThreeJsRenderer();

        this._bindPageEvent();
    };

    MainContent.prototype._initPage = function () {

        document.getElementById('mainContent').innerHTML = Mustache.render(MainContentTemplate, {
            mainTitle: MainTitle.getMenuContent()
        });
    };

    MainContent.prototype._initThreeJsRenderer = function () {

        GlobalVar.frameRenderer = new ThreejsRenderer();

        GlobalVar.frameRenderer.render();
    };

    MainContent.prototype._bindPageEvent = function () {

        MainTitle.bindEvent();
    };

    MainContent.prototype.onWindowResize = function () {
        if (!CommonUtil.isDefined(GlobalVar.frameRenderer)) {
            return;
        }
        GlobalVar.frameRenderer.onWindowResize();
    };

    return MainContent;
});