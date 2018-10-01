GAME.Components.sprite = {
    sprite: null,
    texture: null,
    height: 0,
    width: 0,
    frame: 0,

    create: function(txt, width, height) {
        this.texture = txt;
        this.height = height;
        this.width = width;

        this.setFrame(0);
        this.sprite = new PIXI.Sprite(this.texture);
        GAME.pixiApp.stage.addChild(this.sprite);
    },

    setFrame: function(fr) {
        var x = (fr * this.width) % this.texture.baseTexture.width;
        var y = Math.floor((fr * this.width) / this.texture.baseTexture.width) * this.height;
        this.frame = fr;
        this.texture.frame = new PIXI.Rectangle(x, y, this.width, this.height);
    }
}