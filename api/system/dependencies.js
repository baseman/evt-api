var Promise = require('bluebird');
var redis = Promise.promisifyAll(require('redis'));

var ds = require('evt-ds');
var managedResources = ds.managedResource;

var redisCfg = require('../config/redis.config');

var _redisDs;
var _resourceManager = require('resource-manager').resourceManager.getManager();

function onCleanup() {
    // attach user callback to the process event emitter
    // if no callback, it will still exit gracefully on Ctrl-C
    var _cleanup = _resourceManager.cleanUpResources || function () {};
    process.on('cleanup', _cleanup);

    // do app specific cleaning before exiting
    process.on('exit', function () {
        process.emit('cleanup');
    });

    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
        console.log('Ctrl-C...');
        process.exit(2);
    });

    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function (e) {
        console.log('Uncaught Exception...');
        console.log(e.stack);
        process.exit(99);
    });
}

onCleanup();
var pmInitDependencies = managedResources.redis.promiseInitResource({
    pmRedisModule: redis, redisPort: redisCfg.redisConn.redisPort, redisHost: redisCfg.redisConn.redisHost
}).then(function(redisRes) {
    _redisDs = ds.getDs({dsType: 'redis'}).initDataSource(redisRes).dataSource;

    return _redisDs.pmInitKeys([
        {key: redisCfg.key.aggregateIdKey, val: 0},
        {key: redisCfg.key.aggregateEventIdKey, val: 0}
    ]);
}).then(function() {
    return {forService: {dataSource: _redisDs}};
});

module.exports = { pmInitDependencies: pmInitDependencies };
