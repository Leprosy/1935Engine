/**
 * State manager
 */
GAME.State = (function() {
    var states = {};
    var currentState = null;

    return {
        // Adds a state. obj needs to have a structure?
        add: function(key, obj) {
            if (GAME.$.isObj(obj)) {
                obj._id = key;
                states[key] = obj;
            } else {
                throw Error("GAME.State: Adding invalid state object.");
            }
        },

        // Switches the active state
        set: function(key, scope) {
            if (typeof states[key] !== "undefined") {
                if (GAME.$.isObj(currentState) && typeof currentState.destroy === "function") {
                    console.debug("%cGAME.State." + currentState._id + " ended", "font-weight: bold");
                    currentState.destroy();
                }

                currentState = states[key];

                if (typeof currentState.init === "function") {
                    currentState.scope = scope; // allows to pass objects and varibles to the State
                    console.debug("%cGAME.State." + key + " started", "font-weight: bold");
                    currentState.init();
                }
            } else {
                throw Error("GAME.State: That state object isn't registered.");
            }
        },

        // Return current state object
        get: function(key) {
            if (typeof key !== "undefined") {
                if (typeof states[key] !== "undefined") {
                    return states[key];
                } else {
                    throw Error("GAME.State: That state object isn't registered.");
                }
            } else {
                return currentState;
            }
        }
    }
})();



/**
 * Example code for state definition

GAME.State.add("first", {
    taldo: "OAW",
    init: function() {
        console.log("init first state");
    },
    destroy: function() {
        console.log("destroy first state");
    }
});

GAME.State.add("empty", {});

GAME.State.add("second", {
    foo: "bar",
    init: function() {
        console.log("init second state");
    },
    destroy: function() {
        console.log("destroy second state");
    }
});

GAME.State.set("first");
*/
