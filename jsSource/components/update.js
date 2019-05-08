/**
 * Component that implements an update call to the entity
 */
GAME.Components.update = {
    updates: {},
    currentUpdates: {},

    /**
     * Setups the current update call
     */
    setupUpdate: function(name, call, fps) {
        this.updates[name] = {
            call: call,
            fps: fps
        };
    },
    startUpdate: function(name) {
        // If update is currently running, don't do anything
        if (this.currentUpdates.hasOwnProperty(name)) {
            return;
        }

        if (!this.updates.hasOwnProperty(name)) {
            throw Error(`Update Component: no update call called ${name}`);
        }

        var _this = this;

        this.currentUpdates[name] = GAME.Canvas.registerRefreshCall(function() {
            _this.updates[name].call(_this);
        }, _this.updates[name].fps);

        return this;
    },

    /**
     * Stops current update call
     */
    stopUpdate: function(name) {
        GAME.Canvas.cancelRefreshCall(this.currentUpdates[name]);
        delete this.currentUpdates[name];
    }
};
