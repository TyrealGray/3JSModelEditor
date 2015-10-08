define(function (require, exports) {
    'use strict';
    
    function inheritPrototype(subType, superType) {
        var prototype = Object.create(superType.prototype);
        prototype.constructor = subType;
        prototype.superClass = superType;
        subType.prototype = prototype;
    }
    
    exports.inheritPrototype = inheritPrototype;
} );