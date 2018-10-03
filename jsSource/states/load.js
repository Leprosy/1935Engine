// Loading state...preloader and resource management
GAME.State.add("load", {
    name: "Loading",
    init: function() {
        // Init canvas
        GAME.Canvas.init($("#screen")[0]);

        // Loader for assets, go to main_menu
        PIXI.loader
            .add("sprites", "img/sprite.png")
            //.add("spritesheet", "img/sprite.json")
            .on("progress", function(a, b, c) {
                console.log("Load State: Progress", this, a, b, c);
            })
            .load(function() {
                GAME.State.set("main_menu");
            });

    },
    destroy: function() {
    }
});