/**
 *  Canvas module...anything screen related goes here
 */

GAME.Canvas = (function() {
    var pixiApp;

    return {
        init: function(DOMelem) {
            PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas");
            pixiApp = new PIXI.Application();
            DOMelem.appendChild(pixiApp.view);
        },

        addSprite: function(texture) {
            var sprite = new PIXI.Sprite(texture);
            pixiApp.stage.addChild(sprite);
            return sprite;
        },

        getTxt: function(textureName) {
            return PIXI.loader.resources[textureName].texture;
        }
    };
})();

