// Loading state...preloader and resource management
GAME.State.add("load", {
    name: "Loading",

    init: function() {
        // Init canvas
        GAME.Canvas.init($("#screen")[0]);

        // Loader for assets, go to main_menu
        GAME.Load.list({files: ["img/player.png", "img/demo-player.png", "img/demo-bg-back.png",
                                "img/demo-bg-middle.png","img/demo-bg-front.png"],
                        progress: function(a, b, c) {
                            console.debug("loading...");
                        },
                        error: function(a, b, c) { // Error callback
                            console.debug("error loading...");
                        },
                        finish: function() { // End callback
                            GAME.Key.add("Space", function(ev) {
                                GAME.State.set("demo");
                            });
                        }});
    },

    destroy: function() {
        GAME.Key.removeAll();
    }
});
