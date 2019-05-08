// Main menu state.
GAME.State.add("main_menu", {
    name: "Main Menu",

    init: function() {
        var style = {
            fontFamily: 'Arial',
            fill: '#fff',
            fontSize: 24,
            fontWeight: 'bold'
        };

        var logo = new GAME.Ent("logo", ["actor"]).actor(GAME.Canvas.getTxt("logo"), 282, 156);
        logo.spriteObj.y = 40;
        logo.spriteObj.x = 260;

        GAME.Canvas.addText("1935engine demo", 40, 240, style);
        GAME.Canvas.addText("(Arrows to select, Space to start)", 40, 270, style);
        var selected = 1;
        var text1 = GAME.Canvas.addText("Run Demo 1 *", 40, 350, style);
        var text2 = GAME.Canvas.addText("Run Demo 2", 40, 380, style);

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
