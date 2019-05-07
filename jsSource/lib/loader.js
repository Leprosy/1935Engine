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

            PIXI.loader.on("progress", function(ev, elem) {
                console.debug("Load State: Progress", this, ev, elem);

                if (typeof obj.progress === "function") {
                    obj.progress(ev, elem);
                }
            }).on("error", function(ev, elem) {
                if (typeof obj.error === "function") {
                    obj.error(ev, elem);
                }

                throw Error("Load State: error loading resource", this, ev, elem);
            }).load(function(ev, list) {
                console.debug("Load State: Finish", this, ev, list);

                if (typeof obj.finish === "function") {
                    obj.finish(ev, list);
                }
            });
        },
    };
})();
