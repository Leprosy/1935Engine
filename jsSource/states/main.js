// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        GAME.sprite = new PIXI.Sprite(PIXI.loader.resources.sprites.texture);
        GAME.pixiApp.stage.addChild(GAME.sprite);
    },

    destroy: function() {
    }
});