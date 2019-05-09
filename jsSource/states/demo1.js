// Main menu state.
GAME.State.add("demo1", {
    name: "Demo 1",

    init: function() {
        GAME.player = new GAME.Ent("player", ["actor", "update"]);
        GAME.player.actor.init(GAME.Canvas.getTxt("player"), 50, 40); // TODO: pass only the name of the txt resource?

        // Animations and updates
        GAME.player.actor.setupAnim("idle", [0, 1], 10);
        GAME.player.actor.setupAnim("left", [2, 3], 10);
        GAME.player.actor.setupAnim("right", [4, 5], 10);
        GAME.player.update.setupUpdate("main", function(obj) {
            var speed = 10;
            obj.actor.y += (-speed * GAME.Key.isPressed("ArrowUp") +
                                speed * GAME.Key.isPressed("ArrowDown"));
            obj.actor.x += (-speed * GAME.Key.isPressed("ArrowLeft") +
                                speed * GAME.Key.isPressed("ArrowRight"));

            if (obj.actor.y < 0) obj.actor.y = 0;
            if (obj.actor.y > 550) obj.actor.y = 550;
            if (obj.actor.x < 0) obj.actor.x = 0;
            if (obj.actor.x > 750) obj.actor.x = 750;

            if (GAME.Key.isPressed("ArrowLeft")) {
                GAME.player.actor.startAnim("left");
            } else if(GAME.Key.isPressed("ArrowRight")) {
                GAME.player.actor.startAnim("right");
            } else {
                GAME.player.actor.startAnim("idle");
            }
        }, 60);

        // Start state
        GAME.player.actor.y = 450;
        GAME.player.actor.x = 300;
        GAME.player.actor.startAnim("idle");
        GAME.player.update.startUpdate("main");

        GAME.Key.add("Space", function(ev) {
            GAME.State.set("main_menu");
        });
    },

    destroy: function() {
        GAME.player.destroy();
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
