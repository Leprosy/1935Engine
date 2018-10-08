// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        var frame = 0;

        GAME.player = new GAME.Ent("player", ["actor"])
                              .attr({x: 10, y: 10})
                              .sprite(GAME.Canvas.getTxt("sprites"), 100, 100);

        GAME.player.animate(0, 25, 60);
        GAME.player.update(function(actor) {
            actor.spriteObj.x += 2;
        }, 20);

        setTimeout(function() {
            GAME.player.stopAnimation();
            //GAME.player.stopUpdate();
        }, 4000);
    },

    destroy: function() {
    }
});