/* global define,document,alert */
define(function (require) {
    'use strict';

    var Mustache = require('thirdLib/mustachejs/mustache.min'),

        MainMenuTemplate = require('text!../../../html/MainMenu.html'),
        MenuItemTemplate = require('text!../../../html/MenuItem.html'),

        LoadModelMenu = require('module/interface/kit/LoadModelMenu'),
        TransfromMennu = require('module/interface/kit/TransfromMenu'),

        GlobalVar = require('module/GlobalVar');

    function MainTitle() {
        this._init();
    }

    MainTitle.prototype._init = function () {
        this._initMenuContent();
    };

    MainTitle.prototype._initMenuContent = function () {
        this._content = Mustache.render(MainMenuTemplate, {
            menuList: Mustache.render(MenuItemTemplate, {
                menuItems: [LoadModelMenu.getMenuContent(), TransfromMennu.getMenuContent()]
            })
        });
    };

    MainTitle.prototype.getMenuContent = function () {

        return this._content;
    };

    return MainTitle;
});