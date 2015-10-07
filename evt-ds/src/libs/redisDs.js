var Promise = require("bluebird");

var initRedis = function(resources) {

    var _redisClient = resources.getResource().redisClient;

    var redisDs = {
        promiseInitKeys: function(initKvps){

            var initKvpPromises = [];
            for(var i = 0; i < initKvps.length; i++){
                var kvp = initKvps[i];
                initKvpPromises.push(
                    _redisClient.setnxAsync(kvp.key, kvp.val)
                );
            }

            return Promise.all(initKvpPromises);
        },
        id: {
            promiseUnique: function (key, length) {
                return _redisClient.incrbyAsync(key, length).then(function (response) {
                    var ids = [];
                    var end = length + 1;
                    var start = response - length + 1;
                    for (var i = start; i < end; i++) {
                        ids.push(i);
                    }
                    return ids;
                });
            }
        },
        promiseGetItems: function (key) {
            return _redisClient.lrangeAsync(key, 0, -1)
                .then(function (response) {

                    return response.map(function (strJson) {
                        return JSON.parse(strJson);
                    });

                });
        },
        promiseSetItems: function (key, arrayValue) {
            var cmdVals = arrayValue.map(function (value) {
                return JSON.stringify(value);
            });
            cmdVals.unshift(key);
            return _redisClient.send_commandAsync('rpush', cmdVals);
        }
    };
    return { dataSource: redisDs }
};

module.exports = { initDataSource: initRedis };