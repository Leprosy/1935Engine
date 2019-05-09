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
    animations: {},
    updated: {},
    currentAnimation: null,
    currentAnimationId: null,

    /**
     * Setup actor data
     */
    actor: function(txt, width, height) {
        this.texture = txt;
        this.height = height;
        this.width = width;
        this.setFrame(0);
        this.spriteObj = GAME.Canvas.addSprite(this.texture);

        return this;
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
    setupAnim: function(name, frames, fps) {
        this.animations[name] = {
            frames: frames,
            fps: fps,
            index: 0
        };
    },

    /**
     * Starts an animation
     */
    startAnim: function(name) {
        // Don't do anything if it's the current animation
        if (this.currentAnimation === name) {
            return;
        }

        this.stopAnim();
        this.currentAnimation = name;
        var _this = this;

        this.currentAnimationId = GAME.Canvas.registerRefreshCall(function() {
            var frames = _this.animations[name].frames;

            if (_this.animations[name].index >= frames.length) {
                _this.animations[name].index = 0;
            }

            _this.setFrame(frames[_this.animations[name].index++]);
        }, this.animations[name].fps);
    },

    /**
     * Stop current animation
     */
    stopAnim: function() {
        if (this.currentAnimationId !== null) {
            GAME.Canvas.cancelRefreshCall(this.currentAnimationId);
            this.currentAnimation = null;
            this.currentAnimationId = null;
        }
    },

    /**
     * Called when the entity is destroyed
     */
     destroy: function() {
         this.stopAnim();
     }
};
