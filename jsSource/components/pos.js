/**
 * pos : Base component for position objects
 */
GAME.Components.pos = {
    x: 0,
    y: 0,
    ang: 0,

    rotR: function() {
        this.ang = (this.ang + Math.PI / 2)// % (Math.PI * 2);
    },
    rotL: function() {
        this.ang = (this.ang - Math.PI / 2)// % (Math.PI * 2);
    },
    getFwd: function() {
        var x = Math.round(this.x + Math.sin(this.ang));
        var y = Math.round(this.y + Math.cos(this.ang));

        return { x: x, y : y};
    },
    getBck: function() {
        var x = Math.round(this.x - Math.sin(this.ang));
        var y = Math.round(this.y - Math.cos(this.ang));

        return { x: x, y : y};
    },
    moveFwd: function() {
        var pos = this.getFwd();
        this.x = pos.x;
        this.y = pos.y;
    },
    moveBck: function() {
        var pos = this.getBck();
        this.x = pos.x;
        this.y = pos.y;
    },

    toString: function() {
        return this.x + "-" + this.y;
    },

    equals: function(pos) {
        return this.x === pos.x && this.y === pos.y;
    }
}