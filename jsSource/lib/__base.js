/**
 * This is an example of a GAME class.
 * @name ExampleClass
 * @memberof GAME
 */
GAME.ExampleClass = function(args) {
    // Do something
};
GAME.ExampleClass.prototype.METHOD = function(args) {
    // Do something
}

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

