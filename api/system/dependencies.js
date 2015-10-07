var Promise = require('bluebird');

var redis = Promise.promisifyAll(require('redis'));
var ds = require('evt-ds');

var resources = require('./resources');

resources.onCleanup();
resources.redis.initResource({redisClient: redis.createClient(6379, '127.0.0.1')});

var _dataSource = ds.getDs({dsType: 'redis'}).initDataSource(resources.redis).dataSource;

var dependencies = {
    getForService: function(){
        return { dataSource: _dataSource };
    }
};

module.exports = dependencies;