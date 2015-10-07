var resourceManager = require('../../../src/libs/util/resourceManager').getManager();

var _redisResources;

var _keys = {
    testKey: 'test_key'
};

var testResources = {
    key: {
        getKeys: function(){
            return _keys;
        }
    },
    redis: resourceManager.createResource({
        initResource: function(redisResources){
            _redisResources = redisResources;
        },
        checkResource: function(){
            if(!_redisResources){
                throw new Error("Resources have not been initialized");
            }
        },
        getResource: function(){
            return _redisResources;
        },
        onUse: function(){},
        onUsed: function(){},
        cleanupResource: function () {
            _redisResources.redisClient.quit();
        }
    })
};

module.exports = testResources;