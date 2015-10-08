var Promise = require('bluebird');

var _dependencies = require('../system/dependencies');
var _commitService = require('../../../../controllers/CommitService');

function assertAggregate(expect, expected, actual) {
    expect(actual.id).toBeGreaterThan(0);
    expect(actual.type).toEqual(expected.type);
}

function assertEvent(expect, expected, actual) {
    expect(actual.id).toBeGreaterThan(0);
    expect(actual.type).toEqual(expected.type);
    expect(actual.version).toEqual(expected.version);
    expect(actual.aggregate.id).toBeGreaterThan(0);
    expect(actual.aggregate.type).toEqual(expected.aggregate.type);
}

function assertContainsValidKey(expect, key) {
    expect(key === 'AGGREGATE' || key === 'EVENT').toBeTruthy();
}

function assertEventAggregate(expect, aggregate, eventAggregate) {
    expect(aggregate.id).toEqual(eventAggregate.id);
    expect(aggregate.type).toEqual(eventAggregate.type);
}

var inputAggregates = [
    { id: "0", type: "commitment" },
    { id: "0", type: "commitment" },
    { id: "0", type: "commitment" }
];
var inputEvents = [
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[0] }},
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[0] }},
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[0] }},
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[1] }},
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[1] }},
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[1] }},
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[2] }},
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[2] }},
    { event: { id: "0", type: "committed", version: 1, aggregate: inputAggregates[2] }}
];
var input = { commitAggregateBody: { commitAggregateItems: [
    { commitAggregate: { aggregate: inputAggregates[0], eventItems: [
        inputEvents[0], inputEvents[1], inputEvents[2]
    ] } },
    { commitAggregate: { aggregate: inputAggregates[1], eventItems: [
        inputEvents[3], inputEvents[4], inputEvents[5]
    ] } },
    { commitAggregate: { aggregate: inputAggregates[2], eventItems: [
        inputEvents[6], inputEvents[7], inputEvents[8]
    ] } }
]} };

function assertInitKvp (expect, expected, actual) {
    expect(actual.key).toEqual(expected.key);
    expect(actual.val).toEqual(expected.val);
}
describe('Commit Service', function(){
    it('should promise set Aggregate and Event JSON', function(done){
        var dsFx = {
            pmInitKeys: function(actual){
                assertInitKvp(expect, {key: 'AGGREGATE', val: 0}, actual[0]);
                assertInitKvp(expect, {key: 'EVENT', val: 0}, actual[1]);
                return Promise.resolve();
            },
            pmMakeUniqueIds: function(key, count){
                var _count = count;

                assertContainsValidKey(expect, key);
                return new Promise(function(resolve){
                    var maxId = _count + 1;
                    var ids = [];
                    for(var i = 1; i < maxId; i++){
                        ids.push(i);
                    }

                    resolve(ids);
                });
            },
            pmSetItems: function(key, value){
                assertContainsValidKey(expect, key);

                if(key === 'AGGREGATE'){
                    assertAggregate(expect, inputAggregates[0], value.aggregateItems[0].aggregate);
                    assertAggregate(expect, inputAggregates[1], value.aggregateItems[1].aggregate);
                    assertAggregate(expect, inputAggregates[2], value.aggregateItems[2].aggregate);
                }

                if(key.indexOf('EVENT') !== -1){
                    assertEvent(expect, inputEvents[0].event, value.eventItems[0].event);
                    assertEvent(expect, inputEvents[1].event, value.eventItems[1].event);
                    assertEvent(expect, inputEvents[2].event, value.eventItems[2].event);
                    assertEvent(expect, inputEvents[3].event, value.eventItems[3].event);
                    assertEvent(expect, inputEvents[4].event, value.eventItems[4].event);
                    assertEvent(expect, inputEvents[5].event, value.eventItems[5].event);
                    assertEvent(expect, inputEvents[6].event, value.eventItems[6].event);
                    assertEvent(expect, inputEvents[7].event, value.eventItems[7].event);
                    assertEvent(expect, inputEvents[8].event, value.eventItems[8].event);
                }

                return new Promise(function(resolve){
                    resolve(true);
                });
            }
        };

        var commitService = _commitService.init(_dependencies.getForService(dsFx));
        commitService.pmCommitAggregate(input)
            .then(function(result){

                var commitAggregateItems = input.commitAggregateBody.commitAggregateItems;

                assertEventAggregate(expect, commitAggregateItems[0].commitAggregate.aggregate, commitAggregateItems[0].commitAggregate.eventItems[0].event.aggregate);
                assertEventAggregate(expect, commitAggregateItems[0].commitAggregate.aggregate, commitAggregateItems[0].commitAggregate.eventItems[1].event.aggregate);
                assertEventAggregate(expect, commitAggregateItems[0].commitAggregate.aggregate, commitAggregateItems[0].commitAggregate.eventItems[2].event.aggregate);
                assertEventAggregate(expect, commitAggregateItems[1].commitAggregate.aggregate, commitAggregateItems[1].commitAggregate.eventItems[0].event.aggregate);
                assertEventAggregate(expect, commitAggregateItems[1].commitAggregate.aggregate, commitAggregateItems[1].commitAggregate.eventItems[1].event.aggregate);
                assertEventAggregate(expect, commitAggregateItems[1].commitAggregate.aggregate, commitAggregateItems[1].commitAggregate.eventItems[2].event.aggregate);
                assertEventAggregate(expect, commitAggregateItems[2].commitAggregate.aggregate, commitAggregateItems[2].commitAggregate.eventItems[0].event.aggregate);
                assertEventAggregate(expect, commitAggregateItems[2].commitAggregate.aggregate, commitAggregateItems[2].commitAggregate.eventItems[1].event.aggregate);
                assertEventAggregate(expect, commitAggregateItems[2].commitAggregate.aggregate, commitAggregateItems[2].commitAggregate.eventItems[2].event.aggregate);

                expect(result).toEqual('Success');
            })
            .finally(function(){
                done();
            });
    });
});