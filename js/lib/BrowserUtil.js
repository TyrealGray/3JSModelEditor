/* global define, window */
define(function (require, exports) {
    'use strict';

    /**
     * 判定事件是否为右键
     * @param {MouseEvent} event
     */
    function isRightClick(event) {
        if (!event) {
            event = window.event;
        }
        if (event.which) {
            return event.which === 3;
        } else if (event.button) {
            return event.button === 2;
        } else {
            return false;
        }
    }

    /**
     * 阻止事件传递
     * @param {MouseEvent} event
     */
    function stopPropagation(event) {
        if (event) {
            event.cancelBubble = true;
            if (event.stopPropagation) {
                event.stopPropagation();
            }
        }
    }

    // export
    exports.isRightClick = isRightClick;
    exports.stopPropagation = stopPropagation;
});