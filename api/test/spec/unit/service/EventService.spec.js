var Promise = require('bluebird');

var _dependencies = require('../system/dependencies');
var _eventService = require('../../../../controllers/EventService');

describe('Event Service', function(){
    it('should promise JSON', function(done){
        var expected = { eventItems: [{"type":"added","aggregateType":"calculation","aggregateId":1,"version":2,"data":{"addVal":101}}] };

        var dsFx = {
            pmGetItemsForKey: function(key){
                expect(key).toEqual('EVENT');
                return new Promise(function(resolve){
                    resolve(expected.eventItems);
                });
            }
        };

        var eventService = _eventService.init(_dependencies.getForService(dsFx));
        eventService.getEvent()
            .then(function(result){
                expect(result).toEqual(expected);
            })
            .finally(function(){
                done();
            });
    });

    it('should promise JSON get with empty data', function(done) {
        var expected = { eventItems: [] };

        var dsFx = {
            pmGetItemsForKey: function(key){
                expect(key).toEqual('EVENT');
                return new Promise(function(resolve){
                    resolve(null);
                });
            }
        };

        var eventService = _eventService.init(_dependencies.getForService(dsFx));
        eventService.getEvent()
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