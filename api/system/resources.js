var resUtil = require('evt-res');
var managedResource = resUtil.managedResource;

var _resourceManager = resUtil.resourceManager.getManager();

var resources = {
    redis: managedResource.redis,
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