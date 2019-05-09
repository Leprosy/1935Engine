// Main menu state.
GAME.State.add("demo1", {
    name: "Demo 1",

    init: function() {
        this.player = new GAME.Ent("player", ["actor", "update"]);
        this.player.actor.init(GAME.Canvas.getTxt("player"), 50, 40); // TODO: pass only the name of the txt resource?

        // Animations and updates
        this.player.actor.setupAnim("idle", [0, 1], 10);
        this.player.actor.setupAnim("left", [2, 3], 10);
        this.player.actor.setupAnim("right", [4, 5], 10);
        this.player.update.setupUpdate("main", function(obj) {
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
                obj.actor.startAnim("left");
            } else if(GAME.Key.isPressed("ArrowRight")) {
                obj.actor.startAnim("right");
            } else {
                obj.actor.startAnim("idle");
            }
        }, 60);

        // Start state
        this.player.actor.y = 450;
        this.player.actor.x = 300;
        this.player.actor.startAnim("idle");
        this.player.update.startUpdate("main");

        GAME.Key.add("Escape", function(ev) {
            GAME.State.set("main_menu");
        });
    },

    destroy: function() {
        this.player.destroy();
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
