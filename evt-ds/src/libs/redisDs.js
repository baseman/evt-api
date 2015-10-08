var Promise = require("bluebird");

var initRedis = function(resources) {

    var _redisClient = resources.getResource().redisClient;

    var redisDs = {
        pmInitKeys: function(initKvps){

            var pmInitKvp = [];
            for(var i = 0; i < initKvps.length; i++){
                var kvp = initKvps[i];
                pmInitKvp.push(
                    _redisClient.setnxAsync(kvp.key, kvp.val)
                );
            }

            return Promise.all(pmInitKvp);
        },
        id: {
            pmUnique: function (key, length) {
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
        pmGetItemsForKey: function (key) {
            return _redisClient.lrangeAsync(key, 0, -1)
                .then(function (response) {

                    return response.map(function (strJson) {
                        return JSON.parse(strJson);
                    });

                });
        },
        pmSetItems: function (key, arrayValue) {
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