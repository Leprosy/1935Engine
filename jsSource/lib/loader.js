/**
 *  Loader module
 */
GAME.Load = (function() {

    function baseName(str) {
        var base = new String(str).substring(str.lastIndexOf('/') + 1);

        if (base.lastIndexOf(".") != -1) {
            base = base.substring(0, base.lastIndexOf("."));
        }

        return base;
    }

    return {
        list: function(obj) {
            for (var i = 0; i < obj.files.length; ++i) {
                PIXI.loader.add(baseName(obj.files[i]), obj.files[i]);
            }

            PIXI.loader.on("progress", function(a, b, c) {
                console.debug("Load State: Progress", this, a, b, c);
                obj.progress(a, b, c);
            }).on("error", function(a, b, c) {
                obj.error(a, b, c);
                throw Error("Load State: error loading resource", this, a, b, c);
            }).load(obj.finish());
        },
    }
})();
