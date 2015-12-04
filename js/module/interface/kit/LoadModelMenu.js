/* global define */
define(function (require, exports) {
    'use strict';

    var Mustache = require('thirdLib/mustache.min'),

        MenuItemTemplate = require('text!../../../../html/MenuItem.html');


    function getLoadModelMenuContent() {
        return {
            itemID: 'loadModelMenu',
            itemContent: 'loadModel',
            itemChildrens: Mustache.render(MenuItemTemplate, {
                menuItems: [{
                    itemID: 'loadModelButton',
                    itemContent: '<input type="file" id="loadModelButton" />',
                }]
            })
        };
    }

    exports.getMenuContent = getLoadModelMenuContent;
});