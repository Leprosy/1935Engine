var GAME = GAME || {};

/**
 *  Base GAME module...use it to build your own class/package/whatever
 *  
 */

// Demo class
GAME.NAMEOFYOURCLASS = function(args) {
    // Do something
};
GAME.NAMEOFYOURCLASS.prototype.METHOD = function(args) {
    // Do something
}

// Demo module
GAME.NAMEOFMODULE = (function() {
    var PRIVATESTUFF;

    return {
        PUBLICVAR: "content",
        PUBLICMETHOD: function(args) {
            // Do something
        }
    }
})();

