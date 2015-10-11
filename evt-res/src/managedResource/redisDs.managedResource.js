var resourceManager = require('./resourceManager').getManager();

var _redisRes;
var managedResource = {
    redis: resourceManager.createResource({
        promiseInitResource: function(redisRes){
            _redisRes = redisRes;
            return _redisRes.redisClient.onAsync('connect').then(function () {
                    return _redisRes;
                });
        },
        checkResource: function(){
            if(!_redisRes){
                throw new Error("Resources have not been initialized");
            }
        },
        onUse: function(){},
        onUsed: function(){},
        cleanupResource: function () {
            _redisRes.redisClient.quit();
        }
    })
};

module.exports = managedResource;