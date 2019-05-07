// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        var style = {
            fontFamily: 'Arial',
            fontSize: 36,
            fontWeight: 'bold',
            fill: ['#cccccc', '#000000'], // gradient
            stroke: '#ffffff',
            strokeThickness: 2
        };

        GAME.Canvas.addText("1935Engine demo", 40, 40, style);
        GAME.Canvas.addText("(Arrows to select, Space to start)", 40, 80, style);
        var selected = 1;
        var text1 = GAME.Canvas.addText("Run Demo 1 *", 40, 150, style);
        var text2 = GAME.Canvas.addText("Run Demo 2", 40, 190, style);

        GAME.Key.add("ArrowUp", function() {
            selected = 1;
            text1.text = "Run Demo 1 *";
            text2.text = "Run Demo 2";
        });
        GAME.Key.add("ArrowDown", function() {
            selected = 2;
            text1.text = "Run Demo 1";
            text2.text = "Run Demo 2 *";
        });
        GAME.Key.add("Space", function() {
            GAME.State.set("demo" + selected);
        });
    },

    destroy: function() {
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
