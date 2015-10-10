var ds = require('evt-ds');

var resources = require('./resources');

resources.onCleanup();
var pmInitDependencies = resources.redis
    .promiseInitResource({
        redisConn: { redisPort: 6379, redisHost: '127.0.0.1'}
    }).then(function(redisRes) {
        var redisDs = ds.getDs({dsType: 'redis'})
            .initDataSource(redisRes.redisClient).dataSource;

        redisDs.pmInitKeys([
            {key: keys.aggregateKey, val: 0},
            {key: keys.eventKey, val: 0}
        ]);

        return { forService: { dataSource: redisDs } };
    });

module.exports = { pmInitDependencies: pmInitDependencies };
