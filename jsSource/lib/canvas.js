/**
 *  Canvas module...anything screen related goes here
 */

GAME.Canvas = (function() {
    var pixiApp;
    var refreshCalls = [];
    var refreshCycle = function(callTime) {
        for (var i = 0; i < refreshCalls.length; ++i) {
            var call = refreshCalls[i].call;
            var fps = refreshCalls[i].fps;
            var lastRefresh = refreshCalls[i].lastRefresh;

            if ((callTime - lastRefresh) / 1000 > (1 / fps)) {
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

        /**
         * Clear EVERYTHING
         */
        clear: function() {
            pixiApp.stage.removeChildren();
        },

        getApp: function() {
            return pixiApp;
        }
    };
})();
