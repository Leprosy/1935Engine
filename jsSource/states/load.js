// Loading state...preloader and resource management
GAME.State.add("load", {
    name: "Loading",
    init: function() {
        // Init canvas
        GAME.Canvas.init($("#screen")[0]);

        // Loader for assets, go to main_menu
        PIXI.loader // TODO: Refactor this in a proper module
            .add("player", "img/player.png")
            .add("demo-player", "img/demo-player.png")
            .add("demo-bg-back", "img/demo-bg-back.png")
            .add("demo-bg-middle", "img/demo-bg-middle.png")
            .add("demo-bg-front", "img/demo-bg-front.png")
            .on("progress", function(a, b, c) {
                console.debug("Load State: Progress", this, a, b, c);
            })
            .on("error", function(a, b, c) {
                throw Error("Load State: error loading resource", this, a, b, c);
            })
            .load(function() {
                GAME.Key.add("Space", function(ev) {
                    GAME.State.set("demo");
                });
                //GAME.State.set("demo");
            });

    },
    destroy: function() {
        GAME.Key.removeAll();
    }
});