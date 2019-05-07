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
        },
        clear: function() {
            pixiApp.stage.removeChildren();
        },
        getApp: function() {
            return pixiApp;
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
                var component = GAME.$.clone(GAME.Components[keyList[i]]);
                Object.assign(this, component);
            } else {
                throw Error("GAME.Ent: Component '" + keyList[i] + "' not found");
            }
        }
        return this;
    }
    attrs(obj) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            if (this.hasOwnProperty(key)) {
                this[key] = obj[key];
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
        if (keys.hasOwnProperty(event.code)) {
            if (typeof pre === "function") {
                console.log("GAME.Key: Pre-call method.");
                var result = pre(event);
                if (!result) {
                    console.log("GAME.Key: Handler aborted by the pre-call method.");
                    return;
                }
            }
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
        add: function(code, handlerDown, handlerUp) {
            if (typeof handlerDown !== "function") {
                throw Error("GAME.Key: At least keydown handler listener functions should be provided.");
            }
            if (GAME.$.isEmptyObj(keys)) {
                document.addEventListener("keydown", listener);
                document.addEventListener("keyup", listener);
                console.log("GAME.Key: Listener registered. Adding the key too.", code);
            } else {
                console.log("GAME.Key: Already registered the listener, just adding the key.", code);
            }
            keys[code] = {
                keydown: handlerDown,
                keyup: handlerUp,
                pressed: false
            };
        },
        remove: function(code) {
            console.log("GAME.Key: Removing handler", code);
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
    };
}();

GAME.Load = function() {
    function baseName(str) {
        var base = new String(str).substring(str.lastIndexOf("/") + 1);
        if (base.lastIndexOf(".") != -1) {
            base = base.substring(0, base.lastIndexOf("."));
        }
        return base;
    }
    return {
        list: function(obj) {
            for (var i = 0; i < obj.files.length; ++i) {
                PIXI.loader.add(baseName(obj.files[i]), obj.files[i]);
            }
            PIXI.loader.on("progress", function(a, b, c) {
                console.debug("Load State: Progress", this, a, b, c);
                obj.progress(a, b, c);
            }).on("error", function(a, b, c) {
                obj.error(a, b, c);
                throw Error("Load State: error loading resource", this, a, b, c);
            }).load(obj.finish());
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
    clone: function(obj) {
        var clone = {};
        for (var i in obj) {
            if (obj[i] != null && typeof obj[i] == "object") {
                clone[i] = this.clone(obj[i]);
            } else {
                clone[i] = obj[i];
            }
        }
        return clone;
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
    animations: {},
    updated: {},
    currentAnimation: null,
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
    setupAnim: function(name, frames, fps) {
        this.animations[name] = {
            frames: frames,
            fps: fps,
            index: 0
        };
    },
    startAnim: function(name) {
        this.stopAnim();
        var _this = this;
        this.currentAnimation = GAME.Canvas.registerRefreshCall(function() {
            var frames = _this.animations[name].frames;
            if (_this.animations[name].index >= frames.length) {
                _this.animations[name].index = 0;
            }
            _this.setFrame(frames[_this.animations[name].index++]);
        }, this.animations[name].fps);
    },
    stopAnim: function() {
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
    updates: {},
    currentUpdates: {},
    setupUpdate: function(name, call, fps) {
        this.updates[name] = {
            call: call,
            fps: fps
        };
    },
    startUpdate: function(name) {
        if (this.currentUpdates.hasOwnProperty(name)) {
            return;
        }
        if (!this.updates.hasOwnProperty(name)) {
            throw Error(`Update Component: no update call called ${name}`);
            return;
        }
        var _this = this;
        this.currentUpdates[name] = GAME.Canvas.registerRefreshCall(function() {
            _this.updates[name].call(_this);
        }, _this.updates[name].fps);
        return this;
    },
    stopUpdate: function(name) {
        GAME.Canvas.cancelRefreshCall(this.currentUpdates[name]);
        delete this.currentUpdates[name];
    }
};

GAME.State.add("demo", {
    name: "Demo",
    init: function() {
        GAME.bg1 = new GAME.Ent("bg1", [ "bg", "update" ]).bg(GAME.Canvas.getTxt("demo-bg-back"), 800, 600);
        GAME.bg2 = new GAME.Ent("bg2", [ "bg", "update" ]).bg(GAME.Canvas.getTxt("demo-bg-middle"), 800, 600);
        GAME.bg3 = new GAME.Ent("bg3", [ "bg", "update" ]).bg(GAME.Canvas.getTxt("demo-bg-front"), 800, 600);
        GAME.player = new GAME.Ent("player", [ "actor", "update" ]).actor(GAME.Canvas.getTxt("demo-player"), 100, 100);
        GAME.player.setupAnim("idle", [ 10 ], 60);
        GAME.player.setupAnim("walk", [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ], 60);
        GAME.bg1.setupUpdate("scroll", function(bg) {
            bg.scrollX(-1);
        }, 60);
        GAME.bg2.setupUpdate("scroll", function(bg) {
            bg.scrollX(-5);
        }, 60);
        GAME.bg3.setupUpdate("scroll", function(bg) {
            bg.scrollX(-10);
        }, 60);
        GAME.player.spriteObj.y = 450;
        GAME.player.spriteObj.x = 300;
        GAME.player.startAnim("idle");
        GAME.Key.add("ArrowRight", function(ev) {
            GAME.bg1.startUpdate("scroll");
            GAME.bg2.startUpdate("scroll");
            GAME.bg3.startUpdate("scroll");
            GAME.player.startAnim("walk");
        }, function(ev) {
            GAME.bg1.stopUpdate("scroll");
            GAME.bg2.stopUpdate("scroll");
            GAME.bg3.stopUpdate("scroll");
            GAME.player.startAnim("idle");
        });
        GAME.Key.add("Space", function(ev) {
            GAME.State.set("main_menu");
        });
    },
    destroy: function() {
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});

GAME.State.add("load", {
    name: "Loading",
    init: function() {
        GAME.Canvas.init($("#screen")[0]);
        GAME.Load.list({
            files: [ "img/player.png", "img/demo-player.png", "img/demo-bg-back.png", "img/demo-bg-middle.png", "img/demo-bg-front.png" ],
            progress: function(a, b, c) {
                console.debug("loading...");
            },
            error: function(a, b, c) {
                console.debug("error loading...");
            },
            finish: function() {
                GAME.Key.add("Space", function(ev) {
                    GAME.State.set("demo");
                });
            }
        });
    },
    destroy: function() {
        GAME.Key.removeAll();
    }
});

GAME.State.add("main_menu", {
    name: "Main Menu",
    init: function() {
        GAME.player = new GAME.Ent("player", [ "actor", "update" ]).actor(GAME.Canvas.getTxt("player"), 50, 40);
        GAME.player.setupAnim("idle", [ 0, 1 ], 10);
        GAME.player.setupAnim("left", [ 2, 3 ], 10);
        GAME.player.setupAnim("right", [ 4, 5 ], 10);
        GAME.player.setupUpdate("up", function(obj) {
            obj.spriteObj.y -= 10;
        }, 60);
        GAME.player.setupUpdate("down", function(obj) {
            obj.spriteObj.y += 10;
        }, 60);
        GAME.player.setupUpdate("left", function(obj) {
            obj.spriteObj.x -= 10;
        }, 60);
        GAME.player.setupUpdate("right", function(obj) {
            obj.spriteObj.x += 10;
        }, 60);
        GAME.player.spriteObj.y = 450;
        GAME.player.spriteObj.x = 300;
        GAME.player.startAnim("idle");
        GAME.Key.add("ArrowRight", function(ev) {
            GAME.player.startAnim("right");
            GAME.player.startUpdate("right");
        }, function(ev) {
            GAME.player.startAnim("idle");
            GAME.player.stopUpdate("right");
        });
        GAME.Key.add("ArrowLeft", function(ev) {
            GAME.player.startAnim("left");
            GAME.player.startUpdate("left");
        }, function(ev) {
            GAME.player.startAnim("idle");
            GAME.player.stopUpdate("left");
        });
        GAME.Key.add("ArrowUp", function(ev) {
            GAME.player.startUpdate("up");
        }, function(ev) {
            GAME.player.stopUpdate("up");
        });
        GAME.Key.add("ArrowDown", function(ev) {
            GAME.player.startUpdate("down");
        }, function(ev) {
            GAME.player.stopUpdate("down");
        });
        GAME.Key.add("Space", function(ev) {
            GAME.State.set("demo");
        });
    },
    destroy: function() {
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
