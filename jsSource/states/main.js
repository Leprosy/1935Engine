// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        var frame = 0;

        GAME.player = new GAME.Ent("player", ["pos", "sprite"])
                              .attr({x: 10, y: 10})
                              .sprite(GAME.Canvas.getTxt("sprites"), 100, 100);

        GAME.player.animate(0, 25, 60);

        setTimeout(function() {
            GAME.player.stopAnimation()
        }, 4000);
    },

    destroy: function() {
    }
});