/**
 * Loaders, helpers and other utils & tools
 */
GAME.$ = {
    // The basic variable of all leprosystems software artifacts
    taldo: "OAW",

    // Several type checks & utils
    isObj: function(thing) {
        return thing instanceof Object && thing.constructor === Object;
    },
    isEmptyObj: function(thing) {
        return this.isObj(thing) && Object.keys(thing).length === 0;
    },
    isArray: function(thing) {
        return (Object.prototype.toString.call(thing) === '[object Array]');
    },
    inArray: function(obj, list) {
        for (var i = 0; i < list.length; ++i) {
            if (list[i] === obj) return true;
        }

        return false;
    },
    // Remove from array
    remove: function(arr, elem) {
        var index = arr.indexOf(elem);

        if (index >= 0) {
            arr.splice(index, 1);
        }
    },

    // Object cloning
    clone: function(obj) {
        var clone = {};

        for (var i in obj) {
            if (obj[i] != null && typeof(obj[i]) == "object") {
                clone[i] = this.clone(obj[i]);
            } else {
                clone[i] = obj[i];
            }
        }

        return clone;
    },

    // This implements RPG dice notation
    die: function(str) {
        if (typeof str === "undefined" || str === "") {
            return 0;
        }

        try {
            //xdy+z => x dices of y faces, ie (random(y) * x) + z
            var plus = str.split("+");
            var plusAdd = 0;
            var die = plus[0];

            for (var i = 1; i < plus.length; ++i) {
                plusAdd += (1 * plus[i]);
            }

            die = die.split("d");
            var factor = 1 * die[0];
            var faces = 1 * die[1];
            var result = 0;

            for (var i = 0; i < factor; ++i) {
                var addDie = Math.round(Math.random() * (faces - 1) + 1);
                result += addDie;
            }

            result += plusAdd;

            return result;
        } catch(e) {
            console.error("Game.Utils.die: Bad die string", str);
            return 0;
        }
    },

    // Get a random object from a map
    getRnd: function(obj) {
        var keys = Object.keys(obj);
        var index = Math.round(Math.random() * (keys.length - 1));

        return keys[index];
    },

    // Output data to the game console
    log: function(str) {
        $("#console").prepend("> " + str + "\n");
    },

    getUID: function() {
        return new Date().getTime().toString(32) + '_' + Math.random().toString(36).substr(2, 9);
    }
};
