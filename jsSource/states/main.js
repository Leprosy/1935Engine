// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        var frame = 0;

        GAME.player = new GAME.Ent("player", ["pos", "sprite"])
                              .attr({x: 10, y: 10})
                              .sprite(PIXI.loader.resources.sprites.texture, 100, 100);

        setInterval(function() {
            if (++frame == 27) frame = 0;
            GAME.player.setFrame(frame);
            GAME.player.spriteObj.x += 5;
            GAME.player.spriteObj.y += 0.5;
            GAME.player.spriteObj.rotation += 0.005;
            GAME.player.spriteObj.alpha -= 0.005;
        }, 25);
    },

    destroy: function() {
    }
});