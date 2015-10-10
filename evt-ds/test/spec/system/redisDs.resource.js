var resourceManager = require('evt-util').resourceManager.getManager();

var _redisResources;

var testKey = 'test_key';
var _keys = {
    testKey: testKey,
    prefix: {
        key: testKey,
        val: 1
    }
};

var testResources = {
    key: {
        getKeys: function(){
            return _keys;
        }
    },
    redis: resourceManager.createResource({
        promiseInitResource: function(redisResources){
            _redisResources = redisResources;
        },
        checkResource: function(){
            if(!_redisResources){
                throw new Error("Resources have not been initialized");
            }
        },
        onUse: function(){},
        onUsed: function(){},
        cleanupResource: function () {
            _redisResources.redisClient.quit();
        }
    })
};

module.exports = testResources;