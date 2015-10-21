/* global define */
define(function (require, exports) {
    'use strict';

    var Mustache = require('thirdLib/mustachejs/mustache.min'),

        MenuItemTemplate = require('text!../../../../html/MenuItem.html');


    function getTransfromMenuContent() {
        return {
            itemID: 'transfromMenu',
            itemContent: 'transfrom',
            itemChildrens: Mustache.render(MenuItemTemplate, {
                menuItems: [{
                    itemID: 'translateButton',
                    itemContent: 'translate'
                }, {
                    itemID: 'rotateButton',
                    itemContent: 'rotate'
                }, getScaleMenuContent(), {
                    itemID: 'mirrorXButton',
                    itemContent: 'mirrorX'
                }, {
                    itemID: 'mirrorYButton',
                    itemContent: 'mirrorY'
                }, {
                    itemID: 'mirrorZButton',
                    itemContent: 'mirrorZ'
                }]
            })
        };
    }

    function getScaleMenuContent() {
        return {
            itemID: 'scaleMenu',
            itemContent: 'scaleMode',
            itemChildrens: Mustache.render(MenuItemTemplate, {
                menuItems: [{
                    itemID: 'scaleButton',
                    itemContent: 'scale'
                }, {
                    itemID: 'scaleXMenu',
                    itemContent: '<input type="text" id="scaleX" placeholder="scaleX" />'
                }, {
                    itemID: 'scaleYMenu',
                    itemContent: '<input type="text" id="scaleY" placeholder="scaleY" />'
                }, {
                    itemID: 'scaleZMenu',
                    itemContent: '<input type="text" id="scaleZ" placeholder="scaleZ" />'
                }, {
                    itemID: 'widthMenu',
                    itemContent: '<input type="text" id="width" placeholder="width" />'
                }, {
                    itemID: 'heightMenu',
                    itemContent: '<input type="text" id="height" placeholder="height" />'
                }, {
                    itemID: 'longMenu',
                    itemContent: '<input type="text" id="long" placeholder="long" />'
                }]
            })
        };
    }

    exports.getMenuContent = getTransfromMenuContent;
});