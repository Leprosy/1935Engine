/**
 *  Keyboard module
 */
GAME.Key = (function() {
    var keys = {};
    var pre = null;
    var post = null;
    var listener = function(event) {
        //console.log("GAME.Key: Event fired.", event);

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

            // Run registered key handlers depending of the event generated(keyup, keydown)
            //console.log("GAME.Key: Registered key pressed", event);
            if (event.type === "keyup") {
                keys[event.code][event.type]();
                keys[event.code].pressed = false;
            } else if (event.type === "keydown" && !keys[event.code].pressed) {
                keys[event.code][event.type]();
                keys[event.code].pressed = true;
            }

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
        add: function(code, handlerDown, handlerUp) {
            if (typeof handlerDown !== "function" || typeof handlerUp !== "function") {
                throw Error("GAME.Key: Invalid listener functions provided.");
            }

            if (GAME.$.isEmptyObj(keys)) {
                document.addEventListener("keydown", listener);
                document.addEventListener("keyup", listener);
                console.log("GAME.Key: Listener registered. Adding the key too.", code)
            } else {
                console.log("GAME.Key: Already registered the listener, just adding the key.", code)
            }

            keys[code] = {keydown: handlerDown, keyup: handlerUp, pressed: false};
        },

        // Remove key handlers
        remove: function(code) {
            console.log("GAME.Key: Removing handler", code)
            if (keys.hasOwnProperty(code) >= 0) {
                delete keys[code];

                if (GAME.$.isEmptyObj(keys)) {
                    console.log("GAME.Key: No more handlers, removing listener.");
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
    }
})();

/**
Example

GAME.Key.add("KeyA", function handlerDown(ev) {
    console.log("Key A pressed", ev);
}, function handlerUp(ev) {
    console.log("Key A released", ev);
});

*/