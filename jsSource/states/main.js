// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        var frame = 0;
        GAME.player = new GAME.Ent("player", ["pos", "sprite"]);
        GAME.player.sprite.create(PIXI.loader.resources.sprites.texture, 100, 100);

        setInterval(function() {
            if (++frame == 27) frame = 0;
            GAME.player.sprite.setFrame(frame);
            GAME.player.sprite.sprite.x +=5;
        }, 50);
    },

    destroy: function() {
    }
});