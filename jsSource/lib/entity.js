/**
 *  Base entity class
 *  
 *  @member id - unique id of the ent
 *  @member name - optional name for the ent
 */
GAME.Ent = class {
    constructor(name, cmpList) {
        // Setup
        this.id = GAME.$.getUID();
        this.name = name;
        this.tags = [];
        this.addCmps(cmpList);

        return this;
    }

    /**
     * Setup attributes of the entity
     * TODO: implement this!
     */
    attr(obj) {
        console.log("adding attrs", obj)

        return this;
    }

    /**
     *  Adds a component to the entity
     */
    addCmps(keyList) {
        if (!GAME.$.isArray(keyList)) {
            keyList = [keyList];
        }

        for (var i = 0; i < keyList.length; ++i) {
            if (GAME.Components.hasOwnProperty(keyList[i])) {
                GAME.$.extend(this, GAME.Components[keyList[i]]);
            } else {
                throw Error("GAME.Ent: Component '" + keyList[i] + "' not found");
            }
        }

        return this;
    }

    /**
     * Sets up obj
     */
    attrs(obj) {
        var keys = Object.keys(obj);

        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];

            if (this.hasOwnProperty(key)) {
                this[key] = obj[key];
            }
        }

        return this;
    }

    /**
     * Removes a component to the entity
     * NOT YET IMPLEMENTED
     */
    removeCmp(key) {
        return this;
    }

    /**
     * Adds a  list of tags to the entity
     */
    addTags(tagList) {
        if (!GAME.$.isArray(tagList)) {
            tagList = [tagList];
        }

        for (var i = 0; i < tagList.length; ++i) {
            this.tags.push(tagList[i]);
        }

        return this;
    }

    /**
     * Removes a tag to the entity
     */
    removeTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        return this;
    }

    /**
     * Checks for tags in the entity
     * @param tagList
     * @returns boolean
     */
    hasTags(tagList) {
        if (!GAME.$.isArray(tagList)) {
            tagList = [tagList];
        }

        for (var i = 0; i < tagList.length; ++i) {
            if (this.tags.indexOf(tagList[i]) < 0) {
                return false;
            }
        }

        return true;
    };
}
/*
// Adds a tag to the entity
GAME.Ent.prototype.addTag = function(tag) {
    this.tags.push(tag);
    return this;
};
// Removes a tag to the entity
GAME.Ent.prototype.removeTag = function(tag) {
    this.tags.splice(this.tags.indexOf(tag), 1);
    return this;
};
// Tests
GAME.Ent.prototype.hasTag = function(tag) {
    return this.tags.indexOf(tag) > -1;
};
GAME.Ent.prototype.hasAllTags = function(tagList) {
    for (var i = 0; i < tagList.length; ++i) {
        if (!this.hasTag(tagList[i])) {
            return false;
        }
    }

    return true;
};
GAME.Ent.prototype.hasCmp = function(cmp) {
    return this.hasOwnProperty(cmp);
};
GAME.Ent.prototype.hasAllCmp = function(cmpList) {
    for (var i in cmpList) {
        if (!this.hasCmp(cmpList[i])) {
            return false;
        }
    }

    return true;
};
*/



/**
 *  Entity group class
 *  
 *  ents: list of entities that this group holds
 */
GAME.EntGroup = function() {
    this.ents = [];
}

// Adds an entity to the list
GAME.EntGroup.prototype.add = function(ent) {
    this.ents.push(ent);
};
// Removes
GAME.EntGroup.prototype.remove = function(ent) {
    
};
// Queries
GAME.EntGroup.prototype.queryTags = function(tagList, fn) {
    
};
GAME.EntGroup.prototype.queryCmp = function(cmpList) {};


/**
 * Base components
 */
GAME.Components = {};
