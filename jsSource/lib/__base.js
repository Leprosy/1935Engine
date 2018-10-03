/**
 * This is an example of a GAME class.
 */
GAME.ExampleClass = class {
    // Do something
    constructor() {
        
    }

    /**
     * This method does something
     * @param args
     * @return true
     */
    method(args) {
        return true
    }
};

/**
 * This is an example of a GAME module, a singleton with functions and values
 * @name ExampleModule
 * @memberof GAME
 */
GAME.ExampleModule = (function() {
    var PRIVATESTUFF;

    return {
        PUBLICVAR: "content",

        /**
         * A public method of the example module
         * @memberof ExampleModule
         */
        PUBLICMETHOD: function(args) {
            // Do something
        }
    }
})();

