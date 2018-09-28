var GAME = GAME || {};

/**
 *  Keyboard module
 */
GAME.Key = (function() {
    var keys = {};
    var pre = null;
    var post = null;
    var listener = function(event) {
        console.log("GAME.Key: Event fired.", event);

        if (keys.hasOwnProperty(event.code)) {
            // Pre call
            if (typeof pre === "function") {
                console.log("GAME.Key: Pre-call method.");
                var result = pre(event);

                if (!result) {
                    console.log("GAME.Key: Handler aborted by the pre-call method.");
                    return; // If pre-call returns false, the rest of the handler is not executed.
                }
            }

            // Run registered key handlers
            console.log("GAME.Key: Registered key pressed", event);
            keys[event.code]();

            // Post call
            if (typeof post === "function") {
                console.log("GAME.Key: Post-call method.");
                post(event);
            }
        }
    };

    return {
        setPre: function(f) {
            pre = f;
        },

        setPost: function(f) {
            post = f;
        },

        // Adds a key handler to the register
        add: function(code, handler) {
            if (typeof handler !== "function") {
                throw Error("GAME.Key: Invalid listener function provided.");
            }

            if (GAME.$.isEmptyObj(keys)) {
                document.addEventListener("keydown", listener);
                console.log("GAME.Key: Listener registered. Adding the key too.", code)
            } else {
                console.log("GAME.Key: Already registered the listener, just adding the key.", code)
            }

            keys[code] = handler;
        },

        // Remove key handlers
        remove: function(code) {
            console.log("GAME.Key: Removing handler", code)
            if (keys.hasOwnProperty(code) >= 0) {
                delete keys[code];

                if (GAME.$.isEmptyObj(keys)) {
                    console.log("GAME.Key: No more handlers, removing listener.");
                    document.removeEventListener("keydown", listener);
                }
            } else {
                throw Error("GAME.Key: Code doesn't have an event attached.", code);
            }
        },
        removeAll: function() {
            this.setPre(null);
            this.setPost(null);

            for (var key in keys) {
                this.remove(key);
            }
        }
    }
})();

/**
Example

GAME.Key.addEvent("KeyA", function(ev) {
    console.log("Key A pressed", ev)
});
GAME.Key.addEvent("KeyS", function(ev) {
    console.log("Key S pressed")
});
GAME.Key.addEvent("KeyD", function(ev) {
    console.log("Key D pressed")
});
*/