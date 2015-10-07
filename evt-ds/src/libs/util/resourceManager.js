function tryGet(fxName, options) {
    var fx = options[fxName];

    if(!fx){
        throw new Error(fxName + ' has not been defined');
    }
    return fx;
}
var __cleanUps = [];
var __manager = {
    createResource: function(options){

        var _initResource = tryGet('initResource', options);
        var _checkResource = tryGet('checkResource', options);
        var _cleanupResource = tryGet('cleanupResource', options);
        var _getResource = tryGet('getResource', options);
        var _onUse = tryGet('onUse', options);
        var _onUsed = tryGet('onUsed', options);

        __cleanUps.push(_cleanupResource);

        return {
            initResource: function(dep){
                _initResource(dep);
                _checkResource();
            },
            checkResource: function(){
                _checkResource();
            },
            getResource: function(){
                return _getResource();
            },
            onUse: function(callback){
                _onUse(callback);
            },
            onUsed: function(callback){
                _onUsed(callback);
            }
        }
    },
    cleanUpResources: function(){
        for(var i = 0; i < __cleanUps.length; i++){
            __cleanUps[i]()
        }
    }
};

var resourceManager = {
    getManager: function(){
        return __manager;
    }
};

module.exports = resourceManager;