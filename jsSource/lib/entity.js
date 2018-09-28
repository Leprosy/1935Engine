var GAME = GAME || {};

/**
 *  Base entity class
 *  
 *  id: unique id of the ent
 *  name: optional name for the ent
 *  tags: list of tags for this ent
 *  data: Placeholder for user data
 *  group: the ent group that holds this ent, if any
 */
GAME.Ent = function(name, cmp) {
    // Setup
    this.id = new Date().getTime().toString(16);
    this.name = name;
    this.tags = [];

    // Add components, if any
    if (GAME.$.isArray(cmp)) {
        for (var i = 0; i < cmp.length; ++i) {
            this.addCmp(cmp[i]);
        }
    }

    // Chain API
    return this;
};

// Adds a component to the entity
GAME.Ent.prototype.addCmp = function(key) {
    if (GAME.Components.hasOwnProperty(key)) {
        this[key] = {};
        GAME.$.extend(this[key], GAME.Components[key]);
        return this;
    } else {
        throw Error("GAME.Ent: Component '" + key + "' not found");
    }
};
// Removes a component to the entity
GAME.Ent.prototype.removeCmp = function(key) {
    delete this[key];
    return this;
};
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
