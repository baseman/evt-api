var Promise = require('bluebird');
var resourceManager = require('resource-manager').resourceManager.getManager();

var _redisRes;
var managedResource = {
    redis: resourceManager.createResource({
        promiseInitResource: function(redisRes) {
            if (!redisRes) {
                throw new Error('invalid parameters for initializing redis resource');
            }

            _redisRes = redisRes;
            console.log('Initializing Redis resources');

            var redisCfg = _redisRes;
            _redisRes.redisClient = _redisRes.pmRedisModule.createClient(redisCfg.redisPort, redisCfg.redisHost, {});
            return new Promise(function (resolve, reject) {
                _redisRes.redisClient.on('connect', function () {
                    console.log('Redis resources initialized');
                    resolve(_redisRes);
                });

                _redisRes.redisClient.on('error', function (e) {
                    reject(e);
                });
            }).then(function (redisRes) {
                return redisRes;
            });
        },
        checkResource: function(){
        },
        onUse: function(){},
        onUsed: function(){},
        cleanupResource: function () {
            console.log('disposing Redis resources');
            _redisRes.redisClient.quit();
            console.log('Redis disposed');
        }
    })
};

module.exports = managedResource;