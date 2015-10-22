/* global define */
define(function (require, exports) {
    'use strict';

    /**    
     * 判定对象是否定义了    
     * @param {Object} obj 任意对象    
     * @returns {boolean} true表示定义了，false表示没有定义    
     */
    function isDefined(obj) {
        return obj !== null && obj !== 'undefined' && obj !== undefined;
    }

    /**
     * 判定对象是否方法
     * @param {Object} fn 任意对象
     * @return {boolean} true 表示是方法，false表示不是
     */
    function isFunction(fn) {
        if (!isDefined(fn)) {
            return false;
        }

        return Object.prototype.toString.call(fn) === '[object Function]';
    }

    /**
     * 判定对象是否为字符串
     * @param {object} obj 任意对象
     * @return {boolean} true 表示是字符串，false表示不是
     */
    function isString(obj) {
        if (!isDefined(obj)) {
            return false;
        }

        return Object.prototype.toString.call(obj) === '[object String]';
    }

    /**
     * 判断是否为数字
     */
    function isNumber(number) {
        return !isNaN(number);
    }

    // export
    exports.isDefined = isDefined;
    exports.isFunction = isFunction;
    exports.isString = isString;
    exports.isNumber = isNumber;
});