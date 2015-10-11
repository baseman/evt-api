var Promise = require('bluebird');
var redis = Promise.promisifyAll(require('redis'));

var ds = require('evt-ds');

var resources = require('./resources');
var redisCfg = require('../config/redis.config');
var redisConn = redisCfg.redisConn;
var redisKey = redisCfg.key;

var _redisDs;

resources.onCleanup();
var pmInitDependencies = resources.redis.promiseInitResource({
    redisClient: redis.createClient(redisConn.redisPort, redisConn.redisHost)
}).then(function(redisRes) {
    _redisDs = ds.getDs({dsType: 'redis'}).initDataSource(redisRes).dataSource;

    return _redisDs.pmInitKeys([
        {key: redisKey.aggregateIdKey, val: 0},
        {key: redisKey.eventIdKey, val: 0}
    ]);
}).then(function() {
    return {forService: {dataSource: _redisDs}};
});

module.exports = { pmInitDependencies: pmInitDependencies };
