// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        GAME.player = new GAME.Ent("player", ["actor", "update"])
                              .actor(GAME.Canvas.getTxt("player"), 50, 40); // TODO: pass only the name of the txt resource?

        GAME.player.setupAnim("idle", [0, 1], 10);
        GAME.player.setupAnim("left", [2, 3], 10);
        GAME.player.setupAnim("right", [4, 5], 10);
        GAME.player.setupUpdate("up", function(obj) { obj.spriteObj.y-=10 }, 60);
        GAME.player.setupUpdate("down", function(obj) { obj.spriteObj.y+=10 }, 60);
        GAME.player.setupUpdate("left", function(obj) { obj.spriteObj.x-=10 }, 60);
        GAME.player.setupUpdate("right", function(obj) { obj.spriteObj.x+=10 }, 60);

        GAME.player.spriteObj.y = 450;
        GAME.player.spriteObj.x = 300;
        GAME.player.startAnim("idle");

        GAME.Key.add("ArrowRight", function(ev) {
            GAME.player.startAnim("right");
            GAME.player.startUpdate("right");
        }, function(ev) {
            GAME.player.startAnim("idle");
            GAME.player.stopUpdate("right");
        });

        GAME.Key.add("ArrowLeft", function(ev) {
            GAME.player.startAnim("left");
            GAME.player.startUpdate("left");
        }, function(ev) {
            GAME.player.startAnim("idle");
            GAME.player.stopUpdate("left");
        });

        GAME.Key.add("ArrowUp", function(ev) {
            GAME.player.startUpdate("up");
        }, function(ev) {
            GAME.player.stopUpdate("up");
        });

        GAME.Key.add("ArrowDown", function(ev) {
            GAME.player.startUpdate("down");
        }, function(ev) {
            GAME.player.stopUpdate("down");
        });

        GAME.Key.add("Space", function(ev) {
            GAME.State.set("demo");
        });
    },

    destroy: function() {
        GAME.Key.removeAll();
    }
});