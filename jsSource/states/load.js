// Loading state...preloader and resource management
GAME.State.add("load", {
    name: "Loading",

    init: function() {
        // Init canvas
        GAME.Canvas.init($("#screen")[0]);

        // A label
        var text = GAME.Canvas.addText("Loading...", 40, 40, {
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#cccccc', '#000000'], // gradient
            stroke: '#ffffff',
            strokeThickness: 2});

        // Loader for assets, go to main_menu
        GAME.Load.list({files: ["img/player.png", "img/demo-player.png", "img/demo-bg-back.png",
                                "img/demo-bg-middle.png","img/demo-bg-front.png"],
                        progress: function(ev, elem) {
                            text.text = `Loading...${ev.progress}%`;
                        },
                        error: function(a, b, c) { // Error callback
                            console.debug("Error loading...");
                        },
                        finish: function() { // End callback
                            text.text = "Press Space";

                            GAME.Key.add("Space", function(ev) {
                                GAME.State.set("demo");
                            });
                        }});
    },

    destroy: function() {
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
