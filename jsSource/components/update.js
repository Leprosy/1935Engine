/**
 * Component that implements an update call to the entity
 * TODO: more than one update call?
 */
GAME.Components.update = {
    currentUpdate: null,

    /**
     * Setups the current update call
     */
    update: function(call, fps) {
        var _this = this;

        this.currentUpdate = GAME.Canvas.registerRefreshCall(function() {
            call(_this);
        }, fps);

        return this;
    },

    /**
     * Stops current update call
     */
    stopUpdate: function() {
        GAME.Canvas.cancelRefreshCall(this.currentUpdate);
    },
}