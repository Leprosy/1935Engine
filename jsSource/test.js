/**
 * Taldo engine
 * @namespace TALDO
 */
var TALDO = {};

/**
 * MyClass, class of TALDO
 * @memberof TALDO
 */
TALDO.MyClass = class {
    /**
     * Constructor of the MyClass class
     * @param {string} name - The name of the instance
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * This says hello to the name of this MyClass instance
     * @return {string} A greeting
     */
    hello() {
        return `hello, ${this.name}`;
    }
}


/**
 * MyModule, module of TALDO
 * @memberof TALDO
 * @mixin
 */
TALDO.MyModule = {
    name: "module",
    value: 66,

    /**
     * Method to say hello to someone
     * @param {string} name - The name of the one
     * @return {string} A greeting
     */
    hello: function(name) {
        return `hello, ${name}`;
    }
}

/**
 * Another, class of TALDO
 * @memberof TALDO
 * @class
 */
TALDO.Another = (function() {
    var num = 1;

    return {
        /**
         * Returns the count
         * @returns {Number} the counter
         * @memberof TALDO.Another
         */
        getNum: function() {
            return ++num;
        },

        /**
         * Says hello
         * @returns {String} A greeting
         * @memberof TALDO.Another
         */
        sayHi: function(str) {
            return `Hello, ${str}`;
        }
    }
})();