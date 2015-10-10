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

        var _fPromiseInitResource = tryGet('promiseInitResource', options);
        var _promiseInitResource;
        var _fCheckResource = tryGet('checkResource', options);
        var _fCleanupResource = tryGet('cleanupResource', options);
        var _fOnUse = tryGet('onUse', options);
        var _fOnUsed = tryGet('onUsed', options);

        __cleanUps.push(
            function(){
                if(_promiseInitResource && _promiseInitResource.isFulfilled()){ //if resource available
                    _fCleanupResource();
                }
            });

        return {
            promiseInitResource: function(dep){
                _promiseInitResource =_fPromiseInitResource(dep);

                return _promiseInitResource.then(function(resources){
                    _fCheckResource();
                    return resources;
                });
            },
            checkResource: function(){
                _fCheckResource();
            },
            onUse: function(callback){
                _fOnUse(callback);
            },
            onUsed: function(callback){
                _fOnUsed(callback);
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