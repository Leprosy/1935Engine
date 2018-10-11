GAME.Components.bg = {
    spriteObj: null,
    texture: null,
    currentUpdate: null,

    /**
     * "constructor" should return this
     */
    bg: function(txt, width, height) {
        this.texture = txt;
        this.spriteObj = GAME.Canvas.addTilingSprite(this.texture, width, height);

        return this
    },

    scrollX: function(dx) {
        this.spriteObj.tilePosition.x += dx;
    },
    scrollY: function(dy) {
        this.spriteObj.tilePosition.y += dy;
    },

    update: function(call, fps) {
        var _this = this;

        this.currentUpdate = GAME.Canvas.registerRefreshCall(function() {
            call(_this);
        }, fps)
    },

    stopUpdate: function() {
        GAME.Canvas.cancelRefreshCall(this.currentUpdate);
    },
}