var Promise = require('bluebird');
Promise.longStackTraces();
var pmRedis = Promise.promisifyAll(require('redis'));

var _resourceManager = require('resource-manager').resourceManager.getManager();
var _redisManagedRes = require('../../src/index').managedResource.redis;

var redisCfg = require('./config/functional.config').redis;
var _redisDs = require('../../src/datasource/redisDs');

var _testKeys = redisCfg.key;

var _redisRes;
function pmBeforeEach() {
    return _redisManagedRes.promiseInitResource({
        redisConfig: redisCfg,
        pmRedisModule: pmRedis
    }).then(function (redisRes) {
        _redisRes = redisRes;
        return _redisRes.redisClient.flushdbAsync();
    }).then(function () {
        return _redisDs.initDataSource(_redisRes).dataSource;
    });
}

function afterEach(done, pmTest) {
    pmTest.catch(function(e){
        expect(e).toBeUndefined(e.stack);
    }).finally(function(){
        _resourceManager.cleanUpResources();
        done();
    });
}

describe('redis data source', function() {

    function assertArraysAreEqual(expect, val, actual) {
        expect(actual[0].blah).toEqual(val[0].blah);
        expect(actual[1].blah).toEqual(val[1].blah);
        expect(actual[2].blah).toEqual(val[2].blah);
    }

    var expected = [
        {blah: 'blah1'},
        {blah: 'blah2'},
        {blah: 'blah3'}
    ];

    it('should be able to generate a unique id', function (done) {
        var _dataSource;

        var pmTest = pmBeforeEach().then(function (redisDs) {
            _dataSource = redisDs;
            return _dataSource.pmInitKeys([{key: _testKeys.testIdKey, val: 0}]);
        }).then(function () {
            var count = 3;
            return _dataSource.id.pmMakeUniqueIds(_testKeys.testIdKey, count);
        }).then(function (value) {
            expect(value[0]).toNotEqual(value[1]);
            expect(value[0]).toNotEqual(value[2]);
            expect(value[1]).toNotEqual(value[2]);
        });

        afterEach(done, pmTest);
    });

    it('should be able to retrieve json data for a key', function (done) {
        var _dataSource;
        var pmTest = pmBeforeEach().then(function (dataSource) {
                _dataSource = dataSource;
                var cmdVals = expected.map(function (value) {
                    return JSON.stringify(value);
                });
                cmdVals.unshift(_testKeys.testItemsKey);
                return _redisRes.redisClient.send_commandAsync('rpush', cmdVals);
            }).then(function () {
                return _dataSource.pmGetItemsForKey(_testKeys.testItemsKey);
            }).then(function (actual) {
                assertArraysAreEqual(expect, expected, actual);
            });

        afterEach(done, pmTest);
    });
});