// Main menu state.
GAME.State.add("demo2", {
    name: "Demo 2",

    init: function() {
        this.bg1 = new GAME.Ent("bg1", ["bg", "update"]);
        this.bg2 = new GAME.Ent("bg2", ["bg", "update"]);
        this.bg3 = new GAME.Ent("bg3", ["bg", "update"]);
        this.bg1.bg.init(GAME.Canvas.getTxt("demo-bg-back"), 800, 600);
        this.bg2.bg.init(GAME.Canvas.getTxt("demo-bg-middle"), 800, 600);
        this.bg3.bg.init(GAME.Canvas.getTxt("demo-bg-front"), 800, 600);
        this.bg1.bg.spriteObj.filters = [new PIXI.filters.BlurFilter(2)];
        this.bg2.bg.spriteObj.filters = [new PIXI.filters.BlurFilter(1)];
        this.bg1.update.setupUpdate("scroll", function(obj) { obj.bg.scrollX(-1); }, 60);
        this.bg2.update.setupUpdate("scroll", function(obj) { obj.bg.scrollX(-5); }, 60);
        this.bg3.update.setupUpdate("scroll", function(obj) { obj.bg.scrollX(-10); }, 60);

        this.player2 = new GAME.Ent("player", ["actor", "update"]);
        this.player2.actor.init(GAME.Canvas.getTxt("demo-player"), 100, 100);
        this.player2.actor.setupAnim("idle", [10], 60);
        this.player2.actor.setupAnim("walk", [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25], 60);
        this.player2.actor.y = 480;
        this.player2.actor.x = 300;
        this.player2.actor.startAnim("idle");

        var _this = this;

        GAME.Key.add("ArrowRight", function(ev) {
            _this.bg1.update.startUpdate("scroll");
            _this.bg2.update.startUpdate("scroll");
            _this.bg3.update.startUpdate("scroll");
            _this.player2.actor.startAnim("walk");
        }, function(ev) {
            _this.bg1.update.stopUpdate("scroll");
            _this.bg2.update.stopUpdate("scroll");
            _this.bg3.update.stopUpdate("scroll");
            _this.player2.actor.startAnim("idle");
        });

        GAME.Key.add("Escape", function(ev) {
            GAME.State.set("main_menu");
        });
    },

    destroy: function() {
        this.player2.destroy();
        this.bg1.destroy();
        this.bg2.destroy();
        this.bg3.destroy();
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
