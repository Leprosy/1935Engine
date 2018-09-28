// Loading state...preloader and resource management
GAME.State.add("load", {
    name: "Loading",
    init: function() {
        // Init PIXI
        PIXI.utils.sayHello(PIXI.utils.isWebGLSupported() ? "WebGL" : "canvas");
        GAME.pixiApp = new PIXI.Application();
        $("#screen")[0].appendChild(GAME.pixiApp.view);

        // Loader for assets, go to main_menu
        PIXI.loader
            .add("sprites", "img/sprites.png")
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