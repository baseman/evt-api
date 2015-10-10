'use strict';

var Promise = require('bluebird');
var keys = require('../system/resources').key.getKeys();

function assignId(commitAggregate, uniqueId) {
    commitAggregate.aggregate.id = uniqueId;
    var events = commitAggregate.eventItems;
    for(var i = 0; i < events; i++){
        events[i].aggregate.id = uniqueId
    }
}
function assignCommitItem(commitAggregate, aggregates, events) {
    aggregates.push({aggregate: commitAggregate.aggregate});
    for(var i = 0; i < commitAggregate.eventItems.length; i++){
        events.push(commitAggregate.eventItems[i]);
    }
}
function assignAllCommitItems(commitItems, aggregates, events, aggregateIds){
    for(var a = 0; a < commitItems.length; a++){
        var commitItem = commitItems[a];
        assignId(commitItem.commitAggregate, aggregateIds[a]);
        assignCommitItem(commitItem.commitAggregate, aggregates, events);
    }
}

var commitmentService = {
    init: function (dep) {
        var _ds = dep.dataSource;

        return {
            pmCommitAggregate: function(data) {

                var commitItems = data.commitAggregateBody.commitAggregateItems;
                var events = [];
                var aggregates = [];

                return _pmInitCommitService.then(function(){
                        return _ds.pmMakeUniqueIds(keys.aggregateKey, commitItems.length);
                    }).then(function(aggregateIds){
                        assignAllCommitItems(commitItems, aggregates, events, aggregateIds);
                        return _ds.pmMakeUniqueIds(keys.eventKey, events.length);
                    }).then(function(eventIds){
                        for(var e = 0; e < events.length; e++){
                            events[e].event.id = eventIds[e];
                        }
                        return Promise.all([
                            _ds.pmSetItems(keys.aggregateKey, { aggregateItems: aggregates }),
                            _ds.pmSetItems(keys.eventKey, { eventItems: events })
                        ]);
                    }).then(function(){
                        return "Success";
                    });
            }
        };
    }
};

module.exports = commitmentService;
