var _resourceManager = require('evt-ds').resourceManager.instance;

var _keys = {
    aggregateKey: 'AGGREGATE',
    eventKey: 'EVENT'
};

var resources = {
    key: {
        getKeys: function(){
            return _keys;
        }
    },
    redis: _resourceManager.createResource({
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
            console.log('end redis');
            _redisResources.redisClient.quit();
        }
    }),
    onCleanup: function () {
        // attach user callback to the process event emitter
        // if no callback, it will still exit gracefully on Ctrl-C
        var _cleanup = _resourceManager.cleanUpResources || function(){};
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
        process.on('uncaughtException', function(e) {
            console.log('Uncaught Exception...');
            console.log(e.stack);
            process.exit(99);
        });
    }
};

module.exports = resources;