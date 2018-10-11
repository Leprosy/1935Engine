var GAME = {
    name: "1935EngineApp",
    version: "0.1"
};

var TALDO = {};

TALDO.MyClass = class {
    constructor(name) {
        this.name = name;
    }
    hello() {
        return `hello, ${this.name}`;
    }
};

TALDO.MyModule = {
    name: "module",
    value: 66,
    hello: function(name) {
        return `hello, ${name}`;
    }
};

TALDO.Another = function() {
    var num = 1;
    return {
        getNum: function() {
            return ++num;
        },
        sayHi: function(str) {
            return `Hello, ${str}`;
        }
    };
}();

GAME.ExampleClass = class {
    constructor() {}
    method(args) {
        return true;
    }
};

GAME.ExampleModule = function() {
    var PRIVATESTUFF;
    return {
        PUBLICVAR: "content",
        PUBLICMETHOD: function(args) {}
    };
}();

GAME.Canvas = function() {
    var pixiApp;
    var refreshCalls = [];
    var refreshCycle = function(callTime) {
        for (var i = 0; i < refreshCalls.length; ++i) {
            var call = refreshCalls[i].call;
            var fps = refreshCalls[i].fps;
            var lastRefresh = refreshCalls[i].lastRefresh;
            if ((callTime - lastRefresh) / 1e3 > 1 / fps) {
                call(lastRefresh, callTime);
                refreshCalls[i].lastRefresh = callTime;
            }
        }
        requestAnimationFrame(refreshCycle);
    };
    return {
        init: function(DOMelem) {
            PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas");
            pixiApp = new PIXI.Application();
            DOMelem.appendChild(pixiApp.view);
            requestAnimationFrame(refreshCycle);
        },
        addSprite: function(texture) {
            var sprite = new PIXI.Sprite(texture);
            pixiApp.stage.addChild(sprite);
            return sprite;
        },
        addTilingSprite: function(texture, width, height) {
            var tsprite = new PIXI.TilingSprite(texture, width, height);
            pixiApp.stage.addChild(tsprite);
            return tsprite;
        },
        getTxt: function(textureName) {
            return PIXI.loader.resources[textureName].texture;
        },
        registerRefreshCall: function(call, fps) {
            var id = GAME.$.getUID();
            refreshCalls.push({
                id: id,
                fps: fps,
                call: call,
                lastRefresh: performance.now()
            });
            return id;
        },
        cancelRefreshCall: function(id) {
            var call = refreshCalls.filter(obj => {
                return obj.id === id;
            });
            if (call.length > 0) {
                var index = refreshCalls.indexOf(call[0]);
                refreshCalls.splice(index, 1);
            }
        },
        getRefreshCallList: function() {
            return refreshCalls;
        }
    };
}();

GAME.Ent = class {
    constructor(name, cmpList) {
        this.id = GAME.$.getUID();
        this.name = name;
        this.tags = [];
        this.addCmps(cmpList);
        return this;
    }
    attr(obj) {
        console.log("adding attrs", obj);
        return this;
    }
    addCmps(keyList) {
        if (!GAME.$.isArray(keyList)) {
            keyList = [ keyList ];
        }
        for (var i = 0; i < keyList.length; ++i) {
            if (GAME.Components.hasOwnProperty(keyList[i])) {
                GAME.$.extend(this, GAME.Components[keyList[i]]);
            } else {
                throw Error("GAME.Ent: Component '" + keyList[i] + "' not found");
            }
        }
        return this;
    }
    removeCmp(key) {
        return this;
    }
    addTags(tagList) {
        if (!GAME.$.isArray(tagList)) {
            tagList = [ tagList ];
        }
        for (var i = 0; i < tagList.length; ++i) {
            this.tags.push(tagList[i]);
        }
        return this;
    }
    removeTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        return this;
    }
    hasTags(tagList) {
        if (!GAME.$.isArray(tagList)) {
            tagList = [ tagList ];
        }
        for (var i = 0; i < tagList.length; ++i) {
            if (this.tags.indexOf(tagList[i]) < 0) {
                return false;
            }
        }
        return true;
    }
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
    },
    getUID: function() {
        return new Date().getTime().toString(16);
    }
};

GAME.Components.actor = {
    spriteObj: null,
    texture: null,
    height: 0,
    width: 0,
    frame: 0,
    currentAnimation: null,
    currentUpdate: null,
    actor: function(txt, width, height) {
        this.texture = txt;
        this.height = height;
        this.width = width;
        this.setFrame(0);
        this.spriteObj = GAME.Canvas.addSprite(this.texture);
        return this;
    },
    setFrame: function(fr) {
        var x = fr * this.width % this.texture.baseTexture.width;
        var y = Math.floor(fr * this.width / this.texture.baseTexture.width) * this.height;
        this.frame = fr;
        this.texture.frame = new PIXI.Rectangle(x, y, this.width, this.height);
    },
    animate: function(start, end, fps) {
        var _this = this;
        this.currentAnimation = GAME.Canvas.registerRefreshCall(function() {
            if (_this.frame++ > end) {
                _this.frame = start;
            }
            _this.setFrame(_this.frame);
        }, fps);
    },
    stopAnimation: function() {
        GAME.Canvas.cancelRefreshCall(this.currentAnimation);
    }
};

GAME.Components.bg = {
    spriteObj: null,
    texture: null,
    bg: function(txt, width, height) {
        this.texture = txt;
        this.spriteObj = GAME.Canvas.addTilingSprite(this.texture, width, height);
        return this;
    },
    scrollX: function(dx) {
        this.spriteObj.tilePosition.x += dx;
    },
    scrollY: function(dy) {
        this.spriteObj.tilePosition.y += dy;
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
    samePos: function(pos) {
        return this.x === pos.x && this.y === pos.y;
    }
};

GAME.Components.update = {
    currentUpdate: null,
    update: function(call, fps) {
        var _this = this;
        this.currentUpdate = GAME.Canvas.registerRefreshCall(function() {
            call(_this);
        }, fps);
        return this;
    },
    stopUpdate: function() {
        GAME.Canvas.cancelRefreshCall(this.currentUpdate);
    }
};

GAME.State.add("load", {
    name: "Loading",
    init: function() {
        GAME.Canvas.init($("#screen")[0]);
        PIXI.loader.add("sprites", "img/sprite.png").add("bg-back", "img/bg-back.png").add("bg-middle", "img/bg-middle.png").add("bg-front", "img/bg-front.png").on("progress", function(a, b, c) {
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
        GAME.bg1 = new GAME.Ent("bg1", [ "bg", "update" ]).bg(GAME.Canvas.getTxt("bg-back"), 800, 600);
        GAME.bg2 = new GAME.Ent("bg2", [ "bg", "update" ]).bg(GAME.Canvas.getTxt("bg-middle"), 800, 600);
        GAME.bg3 = new GAME.Ent("bg3", [ "bg", "update" ]).bg(GAME.Canvas.getTxt("bg-front"), 800, 600);
        GAME.player = new GAME.Ent("player", [ "actor", "update" ]).attr({
            x: 10,
            y: 10
        }).actor(GAME.Canvas.getTxt("sprites"), 100, 100);
        GAME.player.spriteObj.y = 450;
        GAME.player.animate(0, 25, 60);
        GAME.player.update(function(actor) {
            actor.spriteObj.x += 2;
        }, 60);
        GAME.bg1.update(function(bg) {
            bg.scrollX(-1);
        }, 60);
        GAME.bg2.update(function(bg) {
            bg.scrollX(-5);
        }, 60);
        GAME.bg3.update(function(bg) {
            bg.scrollX(-10);
        }, 60);
        setTimeout(function() {
            GAME.player.stopAnimation();
            GAME.player.stopUpdate();
            GAME.bg1.stopUpdate();
            GAME.bg2.stopUpdate();
            GAME.bg3.stopUpdate();
        }, 4e3);
    },
    destroy: function() {}
});
