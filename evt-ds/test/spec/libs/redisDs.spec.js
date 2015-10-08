var Promise = require("bluebird");
Promise.longStackTraces();

var _resourceManager = require('../../../src/libs/util/resourceManager').getManager();

var _redis = Promise.promisifyAll(require("redis"));
var _redisDs = require('../../../src/libs/redisDs');
var _resources = require("../system/redisDs.resource.js");

var _testKeys = _resources.key.getKeys();

var _client;
function initDataSource() {
    _resources.redis.initResource({redisClient: _redis.createClient(6379, '127.0.0.1')});
    _client = _resources.redis.getResource().redisClient;

    return _client.flushdbAsync()
        .then(function(){
            return _redisDs.initDataSource(_resources.redis).dataSource;
        });
}

describe("redis data source", function(){

    afterEach(function(){
        if(_client){
            _resourceManager.cleanUpResources();
            _client = null;
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

    it("should be able to check for uninitialized resources", function(){
        expect(function(){
            _redisDs.initDataSource(_resources);
            }).toThrow();

    });

    it("should be able to generate a unique id", function(done){
        var _dataSource;

        initDataSource().then(function(redisDs){
            _dataSource = redisDs;
            return _dataSource.pmInitKeys([{key: _testKeys.testKey, val: 0}]);
        }).then(function(){
            var count = 3;
            return _dataSource.id.pmUnique(_testKeys.testKey, count)
        }).then(function(value){
            expect(value[0]).toNotEqual(value[1]);
            expect(value[0]).toNotEqual(value[2]);
            expect(value[1]).toNotEqual(value[2]);
        }).finally(function(){
            done();
        });
    });

    it("should be able to retrieve json data for a key", function(done){
        var _dataSource;
        initDataSource().then(function(dataSource) {
            _dataSource = dataSource;
            var cmdVals = expected.map(function (value) {
                return JSON.stringify(value);
            });
            cmdVals.unshift(_testKeys.testKey);
            return _client.send_commandAsync('rpush', cmdVals)
        }).then(function(){
            return _dataSource.pmGetItemsForKey(_testKeys.testKey);
        }).then(function(actual){
            assertArraysAreEqual(expect, expected, actual);
        }).finally(function(){
            done();
        });
    });

    it("should be able to retrieve json data for a prefixed key (eg. aggregate:1)", function(done){
        var _dataSource;
        initDataSource().then(function(dataSource) {
            _dataSource = dataSource;
            var cmdVals = expected.map(function (value) {
                return JSON.stringify(value);
            });
            cmdVals.unshift(_testKeys.testKey);
            return _client.send_commandAsync('rpush', cmdVals)
        }).then(function(){
            return _dataSource.pmGetItemsForKey(_testKeys.testKey);
        }).then(function(actual){
            assertArraysAreEqual(expect, expected, actual);
        }).finally(function(){
            done();
        });
    });
});