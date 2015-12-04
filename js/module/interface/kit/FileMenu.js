/* global define */
define(function (require, exports) {
    'use strict';

    var Mustache = require('thirdLib/mustache.min'),

        MenuItemTemplate = require('text!../../../../html/MenuItem.html');


    function getFileMenuContent() {
        return {
            itemID: 'fileMenu',
            itemContent: 'file',
            itemChildrens: Mustache.render(MenuItemTemplate, {
                menuItems: [{
                    itemID: 'loadModelButton',
                    itemContent: '<input type="file" id="loadModelButton" />',
                }]
            })
        };
    }

    exports.getMenuContent = getFileMenuContent;
});