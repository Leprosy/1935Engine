// Main menu state.
GAME.State.add("demo1", {
    name: "Demo 1",
    speed: 10,
    width: 50,
    height: 40,
    maxEnemies: 10,

    generateEnemy: function() {
        var name = "enemy" + this.enemies.length;
        var enemy = new GAME.Ent(name, ["actor", "update"]);
        enemy.actor.init(GAME.Canvas.createTxt("player"), this.width, this.height);
        enemy.actor.spriteObj.rotation = Math.PI;
        enemy.actor.spriteObj.tint = 0xFF0000;
        enemy.actor.x = Math.random() * GAME.Canvas.width;
        enemy.actor.y = 0;

        var _this = this;

        enemy.update.setupUpdate("move", function(obj) {
            obj.actor.y += _this.speed / 4;

            if (obj.actor.y > GAME.Canvas.height) {
                obj.destroy();
                _this.enemies.splice(_this.enemies.indexOf(obj), 1);
            }
        }, 60);
        enemy.update.startUpdate("move");

        return enemy;
    },

    init: function() {
        var _this = this;

        // Bg
        this.bg = new GAME.Ent("bg", ["bg", "update"]);
        this.bg.bg.init(GAME.Canvas.getTxt("ocean"), 800, 600);
        this.bg.update.setupUpdate("scroll", function(obj) { obj.bg.scrollY(+5); }, 60);
        this.bg.update.startUpdate("scroll");

        // Enemies
        this.enemies = [];

        // Player
        this.player = new GAME.Ent("player", ["actor", "update"]); window.player = this.player;
        this.player.actor.init(GAME.Canvas.createTxt("player"), this.width, this.height); // TODO: pass only the name of the txt resource?

        // Animations
        this.player.actor.setupAnim("idle", [0, 1], 10);
        this.player.actor.setupAnim("left", [2, 3], 10);
        this.player.actor.setupAnim("right", [4, 5], 10);
        this.player.actor.setupAnim("death", [6, 7, 8, 9, 10], 10, function() {
            GAME.State.set("main_menu");
        });

        // Player update
        this.player.update.setupUpdate("main", function(obj) {
            if (_this.player.hasTags("dead")) return;

            // Check movement
            obj.actor.y += (-_this.speed * GAME.Key.isPressed("ArrowUp") +
                            _this.speed * GAME.Key.isPressed("ArrowDown"));
            obj.actor.x += (-_this.speed * GAME.Key.isPressed("ArrowLeft") +
                            _this.speed * GAME.Key.isPressed("ArrowRight"));

            if (obj.actor.y < 0) obj.actor.y = 0; // TODO: use height/widht and screen dims to do this
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

            // Collisions
            for (var i = 0; i < _this.enemies.length; ++i) {
                if (_this.player.actor.intersects(_this.enemies[i].actor)) {
                    _this.player.addTags("dead");
                    _this.player.actor.startAnim("death");
                    //GAME.State.set("main_menu");
                    //return;
                }
            }

            // Spawn enemies
            if (Math.random() * 100 < 2 && _this.enemies.length < _this.maxEnemies) {
                var enemy = _this.generateEnemy();
                _this.enemies.push(enemy);
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
        for (var i = 0; i < this.enemies.length; ++i) {
            this.enemies[i].destroy();
        }

        this.bg.destroy();
        this.player.destroy();
        GAME.Canvas.clear();
        GAME.Key.removeAll();
    }
});
