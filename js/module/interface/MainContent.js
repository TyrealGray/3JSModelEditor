/* global define,document,alert */
define(function (require) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),

        Mustache = require('thirdLib/mustachejs/mustache.min'),

        MainContentTemplate = require('text!../../../html/MainContent.html'),

        ThreejsRenderer = require('module/ThreejsRenderer'),

        MainTitle = require('module/interface/MainTitle'),

        GlobalVar = require('module/GlobalVar');

    function MainContent() {

        this._mainTitle = null;

        this._init();
    }

    MainContent.prototype._init = function () {

        this._initPage();

        this._initThreeJsRenderer();

        this._bindPageEvent();
    };

    MainContent.prototype._initPage = function () {

        this._mainTitle = new MainTitle();

        document.getElementById('mainContent').innerHTML = Mustache.render(MainContentTemplate, {
            mainTitle: this._mainTitle.getMenuContent()
        });
    };

    MainContent.prototype._initThreeJsRenderer = function () {

        GlobalVar.frameRenderer = new ThreejsRenderer();

        GlobalVar.frameRenderer.render();
		
		GlobalVar.frameRenderer.loadUrlModelFiles('./source/test.stl');
    };

    MainContent.prototype._bindPageEvent = function () {

        this._mainTitle.bindTitleEvent();
    };

    MainContent.prototype.onWindowResize = function () {
        if (!CommonUtil.isDefined(GlobalVar.frameRenderer)) {
            return;
        }
        GlobalVar.frameRenderer.onWindowResize();
    };

    return MainContent;
});