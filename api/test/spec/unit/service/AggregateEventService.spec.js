var Promise = require('bluebird');

var _dependencies = require('../system/dependencies');
var _aggregateEventService = require('../../../../controllers/AggregateEventService');

describe('Aggregate Event Service', function(){
    it('should promise JSON', function(done){
        var expected = { aggregateEventItems: [{"type":"added","aggregateType":"calculation","aggregateId":1,"version":2,"data":{"addVal":101}}] };

        var dsFx = {
            pmGetItemsForKey: function(key){
                expect(key).toEqual('AGGREGATE_EVENT_ITEMS');
                return new Promise(function(resolve){
                    resolve(expected.aggregateEventItems);
                });
            }
        };

        var aggregateEventService = _aggregateEventService.init(_dependencies.getForService(dsFx));
        aggregateEventService.getAggregateEvent()
            .then(function(result){
                expect(result).toEqual(expected);
            })
            .finally(function(){
                done();
            });
    });

    it('should promise JSON get with empty data', function(done) {
        var expected = { aggregateEventItems: [] };

        var dsFx = {
            pmGetItemsForKey: function(key){
                expect(key).toEqual('AGGREGATE_EVENT_ITEMS');
                return new Promise(function(resolve){
                    resolve(null);
                });
            }
        };

        var aggregateEventService = _aggregateEventService.init(_dependencies.getForService(dsFx));
        aggregateEventService.getAggregateEvent()
            .then(function(result){
                expect(result).toEqual(expected);
            })
            .finally(function(){
                done();
            });
    });
});