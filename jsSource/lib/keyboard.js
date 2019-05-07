/**
 *  Keyboard module
 */
GAME.Key = (function() {
    var keys = {};
    var pre = null;
    var post = null;
    var listener = function(event) {
        if (keys.hasOwnProperty(event.code)) {
            // Pre call
            if (typeof pre === "function") {
                console.debug("GAME.Key: Pre-call method.");
                var result = pre(event);

                if (!result) {
                    console.debug("GAME.Key: Handler aborted by the pre-call method.");
                    return; // If pre-call returns false, the rest of the handler is not executed.
                }
            }

            // Run registered key handlers depending of the event generated(keyup, keydown)
            if (event.type === "keyup") {
                if (typeof keys[event.code][event.type] == "function") {
                    keys[event.code][event.type]();
                }

                keys[event.code].pressed = false;
            } else if (event.type === "keydown" && !keys[event.code].pressed) {
                if (typeof keys[event.code][event.type] == "function") {
                    keys[event.code][event.type]();
                }

                keys[event.code].pressed = true;
            }

            // Post call
            if (typeof post === "function") {
                console.debug("GAME.Key: Post-call method.");
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
        add: function(code, handlerDown, handlerUp) {
            if (typeof handlerDown !== "function") {
                throw Error("GAME.Key: At least keydown handler listener functions should be provided.");
            }

            if (GAME.$.isEmptyObj(keys)) {
                document.addEventListener("keydown", listener);
                document.addEventListener("keyup", listener);
                console.debug("GAME.Key: Listener registered. Adding the key too.", code);
            } else {
                console.debug("GAME.Key: Already registered the listener, just adding the key.", code);
            }

            keys[code] = {keydown: handlerDown, keyup: handlerUp, pressed: false};
        },

        // Remove key handlers
        remove: function(code) {
            console.debug("GAME.Key: Removing handler", code);
            if (keys.hasOwnProperty(code) >= 0) {
                delete keys[code];

                if (GAME.$.isEmptyObj(keys)) {
                    console.debug("GAME.Key: No more handlers, removing listener.");
                    document.removeEventListener("keydown", listener);
                    document.removeEventListener("keyup", listener);
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
    };
})();

/**
Example

GAME.Key.add("KeyA", function handlerDown(ev) {
    console.debug("Key A pressed", ev);
}, function handlerUp(ev) {
    console.debug("Key A released", ev);
});

*/
