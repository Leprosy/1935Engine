// Loading state...preloader and resource management
GAME.State.add("load", {
    name: "Loading",

    init: function() {
        // Init some systems
        GAME.Canvas.init($("#screen")[0]);
        GAME.Key.init();

        // A label
        var text = GAME.Canvas.addText("Loading...", 40, 40, {
            fontFamily: 'Arial',
            fill: '#fff',
            fontSize: 24,
            fontWeight: 'bold'});

        // Loader for assets, go to main_menu
        GAME.Load.list({files: ["img/player.png", "img/demo-player.png", "img/demo-bg-back.png",
                                "img/demo-bg-middle.png","img/demo-bg-front.png", "img/logo.png"],
                        progress: function(ev, elem) {
                            text.text = `Loading...${ev.progress}%`;
                        },
                        error: function(a, b, c) { // Error callback
                            console.debug("Error loading...");
                        },
                        finish: function() { // End callback
                            text.text = "Press Space";

                            GAME.Key.add("Space", function(ev) {
                                GAME.State.set("main_menu");
                            });
                        }});
    },

    destroy: function() {
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
