/**
 * This component implements a game actor, that have a sprite sheet and animations
 * TODO: Setup animations in a dict & callbacks for events asociated with them.
 */
GAME.Components.actor = {
    spriteObj: null,
    texture: null,
    height: 0,
    width: 0,
    frame: 0,
    currentAnimation: null,
    currentUpdate: null,

    /**
     * Setup actor data
     */
    actor: function(txt, width, height) {
        this.texture = txt;
        this.height = height;
        this.width = width;
        this.setFrame(0);
        this.spriteObj = GAME.Canvas.addSprite(this.texture)

        return this
    },

    /**
     * Sets the current animation frame
     */
    setFrame: function(fr) {
        var x = (fr * this.width) % this.texture.baseTexture.width;
        var y = Math.floor((fr * this.width) / this.texture.baseTexture.width) * this.height;
        this.frame = fr;
        this.texture.frame = new PIXI.Rectangle(x, y, this.width, this.height);
    },

    /**
     * Setups an animation call
     */
    animate: function(start, end, fps) {
        var _this = this;

        this.currentAnimation = GAME.Canvas.registerRefreshCall(function() {
            if (_this.frame++ > end) {
                _this.frame = start;
            }

            _this.setFrame(_this.frame);
        }, fps)
    },

    /**
     * Stops current animation call
     */
    stopAnimation: function() {
        GAME.Canvas.cancelRefreshCall(this.currentAnimation);
    },
}