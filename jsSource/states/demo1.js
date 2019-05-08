// Main menu state.
GAME.State.add("demo1", {
    name: "Demo 1",

    init: function() {
        GAME.player = new GAME.Ent("player", ["actor", "update"])
                              .actor(GAME.Canvas.getTxt("player"), 50, 40); // TODO: pass only the name of the txt resource?

        // Animations and updates
        GAME.player.setupAnim("idle", [0, 1], 10);
        GAME.player.setupAnim("left", [2, 3], 10);
        GAME.player.setupAnim("right", [4, 5], 10);
        GAME.player.setupUpdate("main", function(obj) {
            var speed = 10;
            obj.spriteObj.y += (-speed * GAME.Key.isPressed("ArrowUp") +
                                speed * GAME.Key.isPressed("ArrowDown"));
            obj.spriteObj.x += (-speed * GAME.Key.isPressed("ArrowLeft") +
                                speed * GAME.Key.isPressed("ArrowRight"));

            if (obj.spriteObj.y < 0) obj.spriteObj.y = 0;
            if (obj.spriteObj.y > 550) obj.spriteObj.y = 550;
            if (obj.spriteObj.x < 0) obj.spriteObj.x = 0;
            if (obj.spriteObj.x > 750) obj.spriteObj.x = 750;

            if (GAME.Key.isPressed("ArrowLeft")) {
                GAME.player.startAnim("left");
            } else if(GAME.Key.isPressed("ArrowRight")) {
                GAME.player.startAnim("right");
            } else {
                GAME.player.startAnim("idle");
            }
        }, 60);

        // Start state
        GAME.player.spriteObj.y = 450;
        GAME.player.spriteObj.x = 300;
        GAME.player.startAnim("idle");
        GAME.player.startUpdate("main");

        GAME.Key.add("Space", function(ev) {
            GAME.State.set("main_menu");
        });
    },

    destroy: function() {
        GAME.player.stopAnim();
        GAME.player.stopUpdate("main");
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
