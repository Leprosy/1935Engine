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
        addText: function(text, x, y, style) {
            style = new PIXI.TextStyle(style);
            text = new PIXI.Text(text, style);
            text.x = x;
            text.y = y;
            pixiApp.stage.addChild(text);
            return text;
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
        this.cmps = [];
        this.addCmps(cmpList);
        return this;
    }
    attr(obj) {
        return this;
    }
    addCmps(keyList) {
        if (!GAME.$.isArray(keyList)) {
            keyList = [ keyList ];
        }
        for (var i = 0; i < keyList.length; ++i) {
            var cmpName = keyList[i];
            if (GAME.Components.hasOwnProperty(keyList[i]) && this.cmps.indexOf(cmpName) < 0) {
                var component = GAME.$.clone(GAME.Components[cmpName]);
                component.parent = this;
                this[cmpName] = component;
                this.cmps.push(cmpName);
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
            if (this.tags.indexOf(tagList[i]) < 0) {
                this.tags.push(tagList[i]);
            }
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
    destroy() {
        for (var i = 0; i < this.cmps.length; ++i) {
            if (typeof this[this.cmps[i]].destroy === "function") {
                this[this.cmps[i]].destroy();
            }
        }
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
            PIXI.loader.on("progress", function(ev, elem) {
                console.debug("Load State: Progress", this, ev, elem);
                if (typeof obj.progress === "function") {
                    obj.progress(ev, elem);
                }
            }).on("error", function(ev, elem) {
                if (typeof obj.error === "function") {
                    obj.error(ev, elem);
                }
                throw Error("Load State: error loading resource", this, ev, elem);
            }).load(function(ev, list) {
                console.debug("Load State: Finish", this, ev, list);
                if (typeof obj.finish === "function") {
                    obj.finish(ev, list);
                }
            });
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
                    console.debug("%cGAME.State." + currentState._id + " ended", "font-weight: bold");
                    currentState.destroy();
                }
                currentState = states[key];
                if (typeof currentState.init === "function") {
                    currentState.scope = scope;
                    console.debug("%cGAME.State." + key + " started", "font-weight: bold");
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
    currentAnimationId: null,
    init: function(txt, width, height) {
        this.texture = txt;
        this.height = height;
        this.width = width;
        this.setFrame(0);
        this.spriteObj = GAME.Canvas.addSprite(this.texture);
        this.spriteObj.anchor.set(.5);
        this.__defineSetter__("x", function(x) {
            this.spriteObj.x = x;
        });
        this.__defineSetter__("y", function(y) {
            this.spriteObj.y = y;
        });
        this.__defineGetter__("x", function() {
            return this.spriteObj.x;
        });
        this.__defineGetter__("y", function() {
            return this.spriteObj.y;
        });
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
        if (this.currentAnimation === name) {
            return;
        }
        this.stopAnim();
        this.currentAnimation = name;
        this.animations[name].index = 0;
        var _this = this;
        this.currentAnimationId = GAME.Canvas.registerRefreshCall(function() {
            var frames = _this.animations[name].frames;
            if (_this.animations[name].index >= frames.length) {
                _this.animations[name].index = 0;
            }
            _this.setFrame(frames[_this.animations[name].index++]);
        }, this.animations[name].fps);
    },
    stopAnim: function() {
        if (this.currentAnimationId !== null) {
            GAME.Canvas.cancelRefreshCall(this.currentAnimationId);
            this.currentAnimation = null;
            this.currentAnimationId = null;
        }
    },
    destroy: function() {
        this.stopAnim();
    }
};

GAME.Components.bg = {
    spriteObj: null,
    texture: null,
    init: function(txt, width, height) {
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
        }
        var _this = this;
        this.currentUpdates[name] = GAME.Canvas.registerRefreshCall(function() {
            _this.updates[name].call(_this.parent);
        }, _this.updates[name].fps);
    },
    stopUpdate: function(name) {
        GAME.Canvas.cancelRefreshCall(this.currentUpdates[name]);
        delete this.currentUpdates[name];
    },
    destroy: function() {
        for (var update in this.currentUpdates) {
            this.stopUpdate(update);
        }
    }
};

GAME.State.add("demo1", {
    name: "Demo 1",
    init: function() {
        this.player = new GAME.Ent("player", [ "actor", "update" ]);
        this.player.actor.init(GAME.Canvas.getTxt("player"), 50, 40);
        this.player.actor.setupAnim("idle", [ 0, 1 ], 10);
        this.player.actor.setupAnim("left", [ 2, 3 ], 10);
        this.player.actor.setupAnim("right", [ 4, 5 ], 10);
        this.player.update.setupUpdate("main", function(obj) {
            var speed = 10;
            obj.actor.y += -speed * GAME.Key.isPressed("ArrowUp") + speed * GAME.Key.isPressed("ArrowDown");
            obj.actor.x += -speed * GAME.Key.isPressed("ArrowLeft") + speed * GAME.Key.isPressed("ArrowRight");
            if (obj.actor.y < 0) obj.actor.y = 0;
            if (obj.actor.y > 550) obj.actor.y = 550;
            if (obj.actor.x < 0) obj.actor.x = 0;
            if (obj.actor.x > 750) obj.actor.x = 750;
            if (GAME.Key.isPressed("ArrowLeft")) {
                obj.actor.startAnim("left");
            } else if (GAME.Key.isPressed("ArrowRight")) {
                obj.actor.startAnim("right");
            } else {
                obj.actor.startAnim("idle");
            }
        }, 60);
        this.player.actor.y = 450;
        this.player.actor.x = 300;
        this.player.actor.startAnim("idle");
        this.player.update.startUpdate("main");
        GAME.Key.add("Escape", function(ev) {
            GAME.State.set("main_menu");
        });
    },
    destroy: function() {
        this.player.destroy();
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});

GAME.State.add("demo2", {
    name: "Demo 2",
    init: function() {
        this.bg1 = new GAME.Ent("bg1", [ "bg", "update" ]);
        this.bg2 = new GAME.Ent("bg2", [ "bg", "update" ]);
        this.bg3 = new GAME.Ent("bg3", [ "bg", "update" ]);
        this.bg1.bg.init(GAME.Canvas.getTxt("demo-bg-back"), 800, 600);
        this.bg2.bg.init(GAME.Canvas.getTxt("demo-bg-middle"), 800, 600);
        this.bg3.bg.init(GAME.Canvas.getTxt("demo-bg-front"), 800, 600);
        this.bg1.bg.spriteObj.filters = [ new PIXI.filters.BlurFilter(2) ];
        this.bg2.bg.spriteObj.filters = [ new PIXI.filters.BlurFilter(1) ];
        this.bg1.update.setupUpdate("scroll", function(obj) {
            obj.bg.scrollX(-1);
        }, 60);
        this.bg2.update.setupUpdate("scroll", function(obj) {
            obj.bg.scrollX(-5);
        }, 60);
        this.bg3.update.setupUpdate("scroll", function(obj) {
            obj.bg.scrollX(-10);
        }, 60);
        this.player2 = new GAME.Ent("player", [ "actor", "update" ]);
        this.player2.actor.init(GAME.Canvas.getTxt("demo-player"), 100, 100);
        this.player2.actor.setupAnim("idle", [ 10 ], 60);
        this.player2.actor.setupAnim("walk", [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25 ], 60);
        this.player2.actor.y = 450;
        this.player2.actor.x = 300;
        this.player2.actor.startAnim("idle");
        var _this = this;
        GAME.Key.add("ArrowRight", function(ev) {
            _this.bg1.update.startUpdate("scroll");
            _this.bg2.update.startUpdate("scroll");
            _this.bg3.update.startUpdate("scroll");
            _this.player2.actor.startAnim("walk");
        }, function(ev) {
            _this.bg1.update.stopUpdate("scroll");
            _this.bg2.update.stopUpdate("scroll");
            _this.bg3.update.stopUpdate("scroll");
            _this.player2.actor.startAnim("idle");
        });
        GAME.Key.add("Escape", function(ev) {
            GAME.State.set("main_menu");
        });
    },
    destroy: function() {
        this.player2.destroy();
        this.bg1.destroy();
        this.bg2.destroy();
        this.bg3.destroy();
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});

GAME.State.add("load", {
    name: "Loading",
    init: function() {
        GAME.Canvas.init($("#screen")[0]);
        GAME.Key.init();
        var text = GAME.Canvas.addText("Loading...", 40, 40, {
            fontFamily: "Arial",
            fill: "#fff",
            fontSize: 24,
            fontWeight: "bold"
        });
        GAME.Load.list({
            files: [ "img/player.png", "img/demo-player.png", "img/demo-bg-back.png", "img/demo-bg-middle.png", "img/demo-bg-front.png", "img/logo.png" ],
            progress: function(ev, elem) {
                var prog = Math.round(ev.progress);
                text.text = `Loading...${prog}%`;
            },
            error: function(a, b, c) {
                console.debug("Error loading...");
            },
            finish: function() {
                text.text = "Press Space";
                GAME.Key.add("Space", function(ev) {
                    GAME.State.set("main_menu");
                });
            }
        });
    },
    destroy: function() {
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});

GAME.State.add("main_menu", {
    name: "Main Menu",
    init: function() {
        var style = {
            fontFamily: "Arial",
            fill: "#fff",
            fontSize: 24,
            fontWeight: "bold"
        };
        var logo = new GAME.Ent("logo", [ "actor" ]);
        logo.actor.init(GAME.Canvas.getTxt("logo"), 282, 156);
        logo.actor.x = GAME.Canvas.getApp().screen.width / 2;
        logo.actor.y = 100;
        GAME.Canvas.addText("1935Engine demo", 40, 240, style);
        GAME.Canvas.addText("(Arrows to select, Space to start)", 40, 270, style);
        var selected = 1;
        var text1 = GAME.Canvas.addText("Run Demo 1 *", 40, 350, style);
        var text2 = GAME.Canvas.addText("Run Demo 2", 40, 380, style);
        GAME.Key.add("ArrowUp", function() {
            selected = 1;
            text1.text = "Run Demo 1 *";
            text2.text = "Run Demo 2";
        });
        GAME.Key.add("ArrowDown", function() {
            selected = 2;
            text1.text = "Run Demo 1";
            text2.text = "Run Demo 2 *";
        });
        GAME.Key.add("Space", function() {
            GAME.State.set("demo" + selected);
        });
    },
    destroy: function() {
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
