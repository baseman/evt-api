var Promise = require('bluebird');

var _dependencies = require('../system/dependencies');
var _aggregateService = require('../../../../controllers/AggregateService');

describe('Aggregate Service', function(){
    it('should promise JSON get', function(done){

        var expected = {
            aggregateItems: [
                {"aggregateType": "calculation", "val": 0, "version": 1, "aggregateId": 1}
            ]
        };

        var dsFx = {
            pmGetItemsForKey: function(key){
                expect(key).toEqual('AGGREGATE');
                return new Promise(function(resolve){
                    resolve(expected.aggregateItems);
                });
            }
        };

        var aggregateService = _aggregateService.init(_dependencies.getForService(dsFx));
        aggregateService.getAggregate()
            .then(function(result){
                expect(result).toEqual(expected);
            })
            .finally(function(){
                done();
            });
    });

    it('should promise JSON get with empty data', function(done) {
        var expected = { aggregateItems: [] };

        var dsFx = {
            pmGetItemsForKey: function(key){
                expect(key).toEqual('AGGREGATE');
                return new Promise(function(resolve){
                    resolve(null);
                });
            }
        };

        var aggregateService = _aggregateService.init(_dependencies.getForService(dsFx));
        aggregateService.getAggregate()
            .then(function(result){
                expect(result).toEqual(expected);
            })
            .finally(function(){
                done();
            });
    });

    xit('should promise JSON set', function(){
    });
});