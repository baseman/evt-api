var Promise = require('bluebird');
var redis = Promise.promisifyAll(require('redis'));

var _resourceManager = require('evt-util').resourceManager.getManager();

var _keys = {
    aggregateKey: 'AGGREGATE_ID',
    eventKey: 'EVENT_ID'
};

var _redisRes = {
    redisPort: null,
    redisHost: null,
    redisClient: null
};

var resources = {
    key: {
        getKeys: function () {
            return _keys;
        }
    },
    redis: _resourceManager.createResource({
        promiseInitResource: function (redisRes) {

            _redisRes = redisRes;
            _redisRes.redisClient = redis.createClient(
                _redisRes.redisConn.redisPort,
                _redisRes.redisConn.redisHost);

            return _redisRes.redisClient
                .onAsync('connect').then(function () {
                    return _redisRes;
                });
        },
        checkResource: function () {
            if (!_redisRes) {
                throw new Error("Resources have not been initialized");
            }
        },
        onUse: function () {
        },
        onUsed: function () {
        },
        cleanupResource: function () {
            console.log('end redis');
            _redisRes.redisClient.quit();
        }
    }),
    onCleanup: function () {
        // attach user callback to the process event emitter
        // if no callback, it will still exit gracefully on Ctrl-C
        var _cleanup = _resourceManager.cleanUpResources || function () {
            };
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
};

module.exports = resources;