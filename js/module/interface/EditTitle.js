/* global define,document */
define(function (require, exports) {
    'use strict';

    var CommonUtil = require('lib/CommonUtil'),
        EidtMenu = require('module/interface/kit/EidtMenu'),

        GlobalVar = require('module/GlobalVar');

    function getMenuContent() {
        return EidtMenu.getMenuContent();
    }

    function bindEvent() {
        document.getElementById('deleteButton').addEventListener('click', function (event) {

            GlobalVar.transformTool.deleteModel();
        });

        document.getElementById('copyButton').addEventListener('click', function (event) {
            GlobalVar.transformTool.copyModel();
        });
    }

    exports.getMenuContent = getMenuContent;
    exports.bindEvent = bindEvent;
});