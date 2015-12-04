/* global define */
define(function (require, exports) {
    'use strict';

    var Mustache = require('thirdLib/mustache.min'),

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
                }, {
                    itemID: 'scaleButton',
                    itemContent: 'scale'
                }, getScaleMenuContent(), {
                    itemID: 'mirrorXButton',
                    itemContent: 'mirrorX'
                }, {
                    itemID: 'mirrorYButton',
                    itemContent: 'mirrorY'
                }, {
                    itemID: 'mirrorZButton',
                    itemContent: 'mirrorZ'
                }, {
                    itemID: 'resetButton',
                    itemContent: 'reset'
                }]
            })
        };
    }

    function getScaleMenuContent() {
        return {
            itemID: 'scaleMenu',
            itemContent: 'scaleMore',
            itemChildrens: Mustache.render(MenuItemTemplate, {
                menuItems: [{
                    itemID: 'scaleXMenu',
                    itemContent: '<label for="scaleX">scaleX</label> <input type="text" id="scaleX" placeholder="scaleX" />'
                }, {
                    itemID: 'scaleYMenu',
                    itemContent: '<label for="scaleY">scaleY</label> <input type="text" id="scaleY" placeholder="scaleY" />'
                }, {
                    itemID: 'scaleZMenu',
                    itemContent: '<label for="scaleZ">scaleZ</label> <input type="text" id="scaleZ" placeholder="scaleZ" />'
                }, {
                    itemID: 'longMenu',
                    itemContent: '<label for="long">long(mm)</label> <input type="text" id="long" placeholder="long" />'
                }, {
                    itemID: 'widthMenu',
                    itemContent: '<label for="width">width(mm)</label> <input type="text" id="width" placeholder="width" />'
                }, {
                    itemID: 'heightMenu',
                    itemContent: '<label for="height">height(mm)</label> <input type="text" id="height" placeholder="height" />'
                }, {
                    itemID: 'lockProportionMenu',
                    itemContent: '<input type="checkbox" id="lockProportion" checked="true"/> Lock Scale Proportion'
                }]
            })
        };
    }

    exports.getMenuContent = getTransfromMenuContent;
});