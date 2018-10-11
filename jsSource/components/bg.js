/**
 * This component implements a scrollable background
 */
GAME.Components.bg = {
    spriteObj: null,
    texture: null,

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
    }
}