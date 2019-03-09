// Main menu state.
GAME.State.add("demo", {
    name: "Demo",

    init: function() {
        GAME.bg1 = new GAME.Ent("bg1", ["bg", "update"])
                          .bg(GAME.Canvas.getTxt("demo-bg-back"), 800, 600);
        GAME.bg2 = new GAME.Ent("bg2", ["bg", "update"])
                          .bg(GAME.Canvas.getTxt("demo-bg-middle"), 800, 600);
        GAME.bg3 = new GAME.Ent("bg3", ["bg", "update"])
                          .bg(GAME.Canvas.getTxt("demo-bg-front"), 800, 600);
        GAME.player = new GAME.Ent("player", ["actor", "update"])
                              .actor(GAME.Canvas.getTxt("demo-player"), 100, 100); // TODO: pass only the name of the txt resource?

        GAME.player.setupAnim("idle", [10], 60);
        GAME.player.setupAnim("walk", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25], 60);
        GAME.bg1.setupUpdate("scroll", function(bg) { bg.scrollX(-1) }, 60);
        GAME.bg2.setupUpdate("scroll", function(bg) { bg.scrollX(-5) }, 60);
        GAME.bg3.setupUpdate("scroll", function(bg) { bg.scrollX(-10) }, 60);

        GAME.player.spriteObj.y = 450;
        GAME.player.spriteObj.x = 300;
        GAME.player.startAnim("idle");
        //GAME.bg1.spriteObj.filters = [new PIXI.filters.BlurFilter(3)];
        //GAME.bg2.spriteObj.filters = [new PIXI.filters.BlurFilter(2)];

        GAME.Key.add("ArrowRight", function(ev) {
            GAME.bg1.startUpdate("scroll");
            GAME.bg2.startUpdate("scroll");
            GAME.bg3.startUpdate("scroll");
            GAME.player.startAnim("walk");
        }, function(ev) {
            GAME.bg1.stopUpdate("scroll");
            GAME.bg2.stopUpdate("scroll");
            GAME.bg3.stopUpdate("scroll");
            GAME.player.startAnim("idle");
        });

        GAME.Key.add("Space", function(ev) {
            GAME.State.set("main_menu");
        })
    },

    destroy: function() {
        GAME.Key.removeAll();
    }
});