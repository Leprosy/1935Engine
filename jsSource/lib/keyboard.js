/**
 *  Keyboard module
 */
GAME.Key = (function() {
    var keys = {};
    var pressed = [];

    var listener = function(event) {
        if (event.type === "keydown") {
            if (pressed.indexOf(event.code) < 0) {
                pressed.push(event.code);
            }

            if (keys.hasOwnProperty(event.code) && typeof keys[event.code].keydown === "function") {
                keys[event.code].keydown(event);
            }
        }

        if (event.type === "keyup") {
            if (pressed.indexOf(event.code) >= 0) {
                pressed.splice(pressed.indexOf(event.code), 1);
            }

            if (keys.hasOwnProperty(event.code) && typeof keys[event.code].keyup === "function") {
                keys[event.code].keyup(event);
            }
        }
    };

    return {
        init: function() {
            document.addEventListener("keydown", listener);
            document.addEventListener("keyup", listener);
            console.debug("GAME.Key: Listener registered.");
        },

        end: function() {
            document.removeEventListener("keydown", listener);
            document.removeEventListener("keyup", listener);
            console.debug("GAME.Key: No more handlers, removing listener.");
        },

        add: function(code, handlerDown, handlerUp) {
            if (typeof handlerDown !== "function") {
                throw Error("GAME.Key: At least keydown handler listener functions should be provided.");
            }

            keys[code] = {
                keydown: handlerDown,
                keyup: handlerUp
            };
        },

        // Remove key handlers
        remove: function(code) {
            if (keys.hasOwnProperty(code) >= 0) {
                delete keys[code];
            } else {
                throw Error("GAME.Key: Code doesn't have an event attached.", code);
            }
        },

        removeAll: function() {
            for (var key in keys) {
                this.remove(key);
            }
        },

        isPressed: function(code) {
            return pressed.indexOf(code) >= 0;
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
