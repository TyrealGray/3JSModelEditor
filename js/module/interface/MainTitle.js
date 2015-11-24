/* global define,document */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        Mustache = require('thirdLib/mustache.min'),

        MainMenuTemplate = require('text!../../../html/MainMenu.html'),
        MenuItemTemplate = require('text!../../../html/MenuItem.html'),

        FileTitle = require('module/interface/FileTitle'),
        TransfromTitle = require('module/interface/TransfromTitle'),
        EditTitle = require('module/interface/EditTitle'),

        GlobalVar = require('module/GlobalVar');

    function getMenuContent() {
        return Mustache.render(MainMenuTemplate, {
            menuList: Mustache.render(MenuItemTemplate, {
                menuItems: [FileTitle.getMenuContent(), TransfromTitle.getMenuContent(), EditTitle.getMenuContent()]
            })
        });
    }

    function bindTitleEvent() {

        FileTitle.bindEvent();

        TransfromTitle.bindEvent();

        EditTitle.bindEvent();
    }

    exports.getMenuContent = getMenuContent;
    exports.bindEvent = bindTitleEvent;

});