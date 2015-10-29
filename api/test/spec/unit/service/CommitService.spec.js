var Promise = require('bluebird');

var _dependencies = require('../system/dependencies');
var _commitService = require('../../../../controllers/CommitService');

function assertAggregate(expect, expected, actual) {
    expect(actual.id).toBeGreaterThan(0);
    expect(actual.aggregateType).toEqual(expected.aggregateType);
}

function assertAggregateEvent(expect, expected, actual) {
    expect(actual.id).toBeGreaterThan(0);
    expect(actual.aggregateEventType).toEqual(expected.aggregateEventType);
    expect(actual.version).toEqual(expected.version);
    expect(actual.aggregate.id).toBeGreaterThan(0);
    expect(actual.aggregate.aggregateType).toEqual(expected.aggregate.aggregateType);
}

function assertContainsValidIdKey(expect, key) {
    expect(key === 'AGGREGATE_ID' || key === 'AGGREGATE_EVENT_ID').toBeTruthy();
}

function assertContainsValidItemsKey(expect, key) {
    expect(key === 'AGGREGATE_ITEMS' || key === 'AGGREGATE_EVENT_ITEMS').toBeTruthy();
}

function assertEventAggregate(expect, aggregate, eventAggregate) {
    expect(aggregate.id).toEqual(eventAggregate.id);
    expect(aggregate.aggregateType).toEqual(eventAggregate.aggregateType);
}

var inputAggs = [
    { id: "0", type: "commitment" },
    { id: "0", type: "commitment" },
    { id: "0", type: "commitment" }
];
var inputEvts = [
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[0] }},
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[0] }},
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[0] }},
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[1] }},
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[1] }},
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[1] }},
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[2] }},
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[2] }},
    { aggregateEvent: { id: "0", type: "committed", version: 1, aggregate: inputAggs[2] }}
];
var input = { commitAggregateBody: { commitAggregateItems: [
    { commitAggregate: { aggregate: inputAggs[0], aggregateEventItems: [
        inputEvts[0], inputEvts[1], inputEvts[2]
    ] } },
    { commitAggregate: { aggregate: inputAggs[1], aggregateEventItems: [
        inputEvts[3], inputEvts[4], inputEvts[5]
    ] } },
    { commitAggregate: { aggregate: inputAggs[2], aggregateEventItems: [
        inputEvts[6], inputEvts[7], inputEvts[8]
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
                assertInitKvp(expect, {key: 'AGGREGATE_EVENT', val: 0}, actual[1]);
                return Promise.resolve();
            },
            id: {
                pmMakeUniqueIds: function(key, count){
                    var _count = count;

                    assertContainsValidIdKey(expect, key);
                    return new Promise(function(resolve){
                        var maxId = _count + 1;
                        var ids = [];
                        for(var i = 1; i < maxId; i++){
                            ids.push(i);
                        }

                        resolve(ids);
                    });
                }
            },
            pmSetItems: function(key, value){
                assertContainsValidItemsKey(expect, key);

                if(key === 'AGGREGATE'){
                    assertAggregate(expect, inputAggs[0], value.aggregateItems[0].aggregate);
                    assertAggregate(expect, inputAggs[1], value.aggregateItems[1].aggregate);
                    assertAggregate(expect, inputAggs[2], value.aggregateItems[2].aggregate);
                }

                if(key.indexOf('AGGREGATE_EVENT') !== -1){
                    assertAggregateEvent(expect, inputEvts[0].aggregateEvent, value[0].aggregateEvent);
                    assertAggregateEvent(expect, inputEvts[1].aggregateEvent, value[1].aggregateEvent);
                    assertAggregateEvent(expect, inputEvts[2].aggregateEvent, value[2].aggregateEvent);
                    assertAggregateEvent(expect, inputEvts[3].aggregateEvent, value[3].aggregateEvent);
                    assertAggregateEvent(expect, inputEvts[4].aggregateEvent, value[4].aggregateEvent);
                    assertAggregateEvent(expect, inputEvts[5].aggregateEvent, value[5].aggregateEvent);
                    assertAggregateEvent(expect, inputEvts[6].aggregateEvent, value[6].aggregateEvent);
                    assertAggregateEvent(expect, inputEvts[7].aggregateEvent, value[7].aggregateEvent);
                    assertAggregateEvent(expect, inputEvts[8].aggregateEvent, value[8].aggregateEvent);
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

                assertEventAggregate(expect, commitAggregateItems[0].commitAggregate.aggregate, commitAggregateItems[0].commitAggregate.aggregateEventItems[0].aggregateEvent.aggregate);
                assertEventAggregate(expect, commitAggregateItems[0].commitAggregate.aggregate, commitAggregateItems[0].commitAggregate.aggregateEventItems[1].aggregateEvent.aggregate);
                assertEventAggregate(expect, commitAggregateItems[0].commitAggregate.aggregate, commitAggregateItems[0].commitAggregate.aggregateEventItems[2].aggregateEvent.aggregate);
                assertEventAggregate(expect, commitAggregateItems[1].commitAggregate.aggregate, commitAggregateItems[1].commitAggregate.aggregateEventItems[0].aggregateEvent.aggregate);
                assertEventAggregate(expect, commitAggregateItems[1].commitAggregate.aggregate, commitAggregateItems[1].commitAggregate.aggregateEventItems[1].aggregateEvent.aggregate);
                assertEventAggregate(expect, commitAggregateItems[1].commitAggregate.aggregate, commitAggregateItems[1].commitAggregate.aggregateEventItems[2].aggregateEvent.aggregate);
                assertEventAggregate(expect, commitAggregateItems[2].commitAggregate.aggregate, commitAggregateItems[2].commitAggregate.aggregateEventItems[0].aggregateEvent.aggregate);
                assertEventAggregate(expect, commitAggregateItems[2].commitAggregate.aggregate, commitAggregateItems[2].commitAggregate.aggregateEventItems[1].aggregateEvent.aggregate);
                assertEventAggregate(expect, commitAggregateItems[2].commitAggregate.aggregate, commitAggregateItems[2].commitAggregate.aggregateEventItems[2].aggregateEvent.aggregate);

                expect(result).toEqual('Success');
            })
            .finally(function(){
                done();
            });
    });
});