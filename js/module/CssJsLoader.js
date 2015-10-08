define(function (require, exports) {
    'use strict';

    function loadCssFile(fileName) {
        var fileref = document.createElement('link');
        fileref.setAttribute('rel', 'stylesheet');
        fileref.setAttribute('type', 'text/css');
        fileref.setAttribute('href', fileName);

        document.getElementsByTagName('head')[0].appendChild(fileref);
    }

    exports.loadCssFile = loadCssFile;

});