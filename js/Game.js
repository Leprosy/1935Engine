var GAME = GAME || {};

GAME.ExampleClass = function(args) {};

GAME.ExampleClass.prototype.METHOD = function(args) {};

GAME.ExampleModule = function() {
    var PRIVATESTUFF;
    return {
        PUBLICVAR: "content",
        PUBLICMETHOD: function(args) {}
    };
}();

GAME.Canvas = function() {
    return {};
}();

GAME.config = {
    __version__: "0.01",
    __name__: "Engine demo"
};

GAME.Ent = function(name, cmp) {
    this.id = new Date().getTime().toString(16);
    this.name = name;
    this.tags = [];
    if (GAME.$.isArray(cmp)) {
        for (var i = 0; i < cmp.length; ++i) {
            this.addCmp(cmp[i]);
        }
    }
    return this;
};

GAME.Ent.prototype.addCmp = function(key) {
    if (GAME.Components.hasOwnProperty(key)) {
        this[key] = {};
        GAME.$.extend(this[key], GAME.Components[key]);
        return this;
    } else {
        throw Error("GAME.Ent: Component '" + key + "' not found");
    }
};

GAME.Ent.prototype.removeCmp = function(key) {
    delete this[key];
    return this;
};

GAME.Ent.prototype.addTag = function(tag) {
    this.tags.push(tag);
    return this;
};

GAME.Ent.prototype.removeTag = function(tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
    return this;
};

GAME.Ent.prototype.hasTag = function(tag) {
    return this.tags.indexOf(tag) > -1;
};

GAME.Ent.prototype.hasAllTags = function(tagList) {
    for (var i = 0; i < tagList.length; ++i) {
        if (!this.hasTag(tagList[i])) {
            return false;
        }
    }
    return true;
};

GAME.Ent.prototype.hasCmp = function(cmp) {
    return this.hasOwnProperty(cmp);
};

GAME.Ent.prototype.hasAllCmp = function(cmpList) {
    for (var i in cmpList) {
        if (!this.hasCmp(cmpList[i])) {
            return false;
        }
    }
    return true;
};

GAME.EntGroup = function() {
    this.ents = [];
};

GAME.EntGroup.prototype.add = function(ent) {
    this.ents.push(ent);
};

GAME.EntGroup.prototype.remove = function(ent) {};

GAME.EntGroup.prototype.queryTags = function(tagList, fn) {};

GAME.EntGroup.prototype.queryCmp = function(cmpList) {};

GAME.Components = {};

GAME.Key = function() {
    var keys = {};
    var pre = null;
    var post = null;
    var listener = function(event) {
        console.log("GAME.Key: Event fired.", event);
        if (keys.hasOwnProperty(event.code)) {
            if (typeof pre === "function") {
                console.log("GAME.Key: Pre-call method.");
                var result = pre(event);
                if (!result) {
                    console.log("GAME.Key: Handler aborted by the pre-call method.");
                    return;
                }
            }
            console.log("GAME.Key: Registered key pressed", event);
            keys[event.code]();
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
        add: function(code, handler) {
            if (typeof handler !== "function") {
                throw Error("GAME.Key: Invalid listener function provided.");
            }
            if (GAME.$.isEmptyObj(keys)) {
                document.addEventListener("keydown", listener);
                console.log("GAME.Key: Listener registered. Adding the key too.", code);
            } else {
                console.log("GAME.Key: Already registered the listener, just adding the key.", code);
            }
            keys[code] = handler;
        },
        remove: function(code) {
            console.log("GAME.Key: Removing handler", code);
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
    };
}();

GAME.State = function() {
    var states = {};
    var currentState = null;
    return {
        add: function(key, obj) {
            if (GAME.$.isObj(obj)) {
                obj._id = key;
                states[key] = obj;
            } else {
                throw Error("GAME.State: Adding invalid state object.");
            }
        },
        set: function(key, scope) {
            if (typeof states[key] !== "undefined") {
                if (GAME.$.isObj(currentState) && typeof currentState.destroy === "function") {
                    console.log("%cGAME.State." + currentState._id + " ended", "font-weight: bold");
                    currentState.destroy();
                }
                currentState = states[key];
                if (typeof currentState.init === "function") {
                    currentState.scope = scope;
                    console.log("%cGAME.State." + key + " started", "font-weight: bold");
                    currentState.init();
                }
            } else {
                throw Error("GAME.State: That state object isn't registered.");
            }
        },
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
    };
}();

GAME.$ = {
    taldo: "OAW",
    isObj: function(thing) {
        return thing instanceof Object && thing.constructor === Object;
    },
    isEmptyObj: function(thing) {
        return this.isObj(thing) && Object.keys(thing).length === 0;
    },
    isArray: function(thing) {
        return Object.prototype.toString.call(thing) === "[object Array]";
    },
    inArray: function(obj, list) {
        for (var i = 0; i < list.length; ++i) {
            if (list[i] === obj) return true;
        }
        return false;
    },
    remove: function(arr, elem) {
        var index = arr.indexOf(elem);
        if (index >= 0) {
            arr.splice(index, 1);
        }
    },
    extend: function(source, newObj) {
        var keys = Object.keys(newObj);
        for (var i = 0; i < keys.length; ++i) {
            if (Array.isArray(newObj[keys[i]])) {
                source[keys[i]] = [];
            } else {
                source[keys[i]] = newObj[keys[i]];
            }
        }
    },
    die: function(str) {
        if (typeof str === "undefined" || str === "") {
            return 0;
        }
        try {
            var plus = str.split("+");
            var plusAdd = 0;
            var die = plus[0];
            for (var i = 1; i < plus.length; ++i) {
                plusAdd += 1 * plus[i];
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
        } catch (e) {
            console.error("Game.Utils.die: Bad die string", str);
            return 0;
        }
    },
    getRnd: function(obj) {
        var keys = Object.keys(obj);
        var index = Math.round(Math.random() * (keys.length - 1));
        return keys[index];
    },
    log: function(str) {
        $("#console").prepend("> " + str + "\n");
    }
};

GAME.Components.pos = {
    x: 0,
    y: 0,
    ang: 0,
    rotR: function() {
        this.ang = this.ang + Math.PI / 2;
    },
    rotL: function() {
        this.ang = this.ang - Math.PI / 2;
    },
    getFwd: function() {
        var x = Math.round(this.x + Math.sin(this.ang));
        var y = Math.round(this.y + Math.cos(this.ang));
        return {
            x: x,
            y: y
        };
    },
    getBck: function() {
        var x = Math.round(this.x - Math.sin(this.ang));
        var y = Math.round(this.y - Math.cos(this.ang));
        return {
            x: x,
            y: y
        };
    },
    moveFwd: function() {
        var pos = this.getFwd();
        this.x = pos.x;
        this.y = pos.y;
    },
    moveBck: function() {
        var pos = this.getBck();
        this.x = pos.x;
        this.y = pos.y;
    },
    toString: function() {
        return this.x + "-" + this.y;
    },
    equals: function(pos) {
        return this.x === pos.x && this.y === pos.y;
    }
};

GAME.State.add("load", {
    name: "Loading",
    init: function() {
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas");
        GAME.pixiApp = new PIXI.Application();
        $("#screen")[0].appendChild(GAME.pixiApp.view);
        PIXI.loader.add("sprites", "img/sprites.png").on("progress", function(a, b, c) {
            console.log("Load State: Progress", this, a, b, c);
        }).load(function() {
            GAME.State.set("main_menu");
        });
    },
    destroy: function() {}
});

GAME.State.add("main_menu", {
    name: "Main Menu",
    init: function() {
        GAME.sprite = new PIXI.Sprite(PIXI.loader.resources.sprites.texture);
        GAME.pixiApp.stage.addChild(GAME.sprite);
    },
    destroy: function() {}
});
