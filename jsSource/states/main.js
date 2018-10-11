// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        GAME.bg1 = new GAME.Ent("bg1", ["bg", "update"])
                          .bg(GAME.Canvas.getTxt("bg-back"), 800, 600);
        GAME.bg2 = new GAME.Ent("bg2", ["bg", "update"])
                          .bg(GAME.Canvas.getTxt("bg-middle"), 800, 600);
        GAME.bg3 = new GAME.Ent("bg3", ["bg", "update"])
                          .bg(GAME.Canvas.getTxt("bg-front"), 800, 600);
        GAME.player = new GAME.Ent("player", ["actor", "update"])
                              .attr({x: 10, y: 10})
                              .actor(GAME.Canvas.getTxt("sprites"), 100, 100);

        GAME.player.spriteObj.y = 450; // Do this with attr
        GAME.player.animate(0, 25, 60);
        GAME.player.update(function(actor) { actor.spriteObj.x += 2 }, 60);
        GAME.bg1.update(function(bg) { bg.scrollX(-1) }, 60);
        GAME.bg2.update(function(bg) { bg.scrollX(-5) }, 60);
        GAME.bg3.update(function(bg) { bg.scrollX(-10) }, 60);

        setTimeout(function() {
            GAME.player.stopAnimation();
            GAME.player.stopUpdate();
            GAME.bg1.stopUpdate();
            GAME.bg2.stopUpdate();
            GAME.bg3.stopUpdate();
        }, 4000);
    },

    destroy: function() {
    }
});