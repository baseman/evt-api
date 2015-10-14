var Promise = require('bluebird');
Promise.longStackTraces();

var resources = require('evt-res');
var _resourceManager = resources.resourceManager.getManager();
var _redisManagedRes = resources.managedResource.redis;

var _redis = Promise.promisifyAll(require('redis'));
var _redisDs = require('../../../src/datasource/redisDs');

var redisConfig = require('./config/redis.config');

var _testKeys = redisConfig.key;

var _redisRes;
function pmInitDataSource() {
    return _redisManagedRes.promiseInitResource({redisClient: _redis.createClient(6379, '127.0.0.1')})
        .then(function(redisRes) {
            _redisRes = redisRes;
            return _redisRes.redisClient.flushdbAsync();
        })
        .then(function(){
            return _redisDs.initDataSource(_redisRes).dataSource;
        });
}

describe('redis data source', function(){

    afterEach(function(){
        if(_redisRes.redisClient){
            _resourceManager.cleanUpResources();
            _redisRes.redisClient = null;
        }
    });

    function assertArraysAreEqual(expect, val, actual) {
        expect(actual[0].blah).toEqual(val[0].blah);
        expect(actual[1].blah).toEqual(val[1].blah);
        expect(actual[2].blah).toEqual(val[2].blah);
    }

    var expected = [
        { blah: 'blah1' },
        { blah: 'blah2' },
        { blah: 'blah3' }
    ];

    it('should be able to generate a unique id', function(done){
        var _dataSource;

        pmInitDataSource().then(function(redisDs){
            _dataSource = redisDs;
            return _dataSource.pmInitKeys([{key: _testKeys.testIdKey, val: 0}]);
        }).then(function(){
            var count = 3;
            return _dataSource.id.pmMakeUniqueIds(_testKeys.testIdKey, count);
        }).then(function(value){
            expect(value[0]).toNotEqual(value[1]);
            expect(value[0]).toNotEqual(value[2]);
            expect(value[1]).toNotEqual(value[2]);
        }).catch(function(e){
            console.error(e.stack);
            expect(e).toBeUndefined();
        }).finally(function(){
            done();
        });
    });

    it('should be able to retrieve json data for a key', function(done){
        var _dataSource;
        pmInitDataSource().then(function(dataSource) {
            _dataSource = dataSource;
            var cmdVals = expected.map(function (value) {
                return JSON.stringify(value);
            });
            cmdVals.unshift(_testKeys.testItemsKey);
            return _redisRes.redisClient.send_commandAsync('rpush', cmdVals);
        }).then(function(){
            return _dataSource.pmGetItemsForKey(_testKeys.testItemsKey);
        }).then(function(actual){
            assertArraysAreEqual(expect, expected, actual);
        }).catch(function(e){
            console.error(e.stack);
            expect(e).toBeUndefined();
        }).finally(function(){
            done();
        });
    });
});