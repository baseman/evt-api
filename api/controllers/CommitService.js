'use strict';

var Promise = require('bluebird');
var key = require('../config/redis.config').key;

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
                var eventItems = [];
                var aggregateItems = [];

                return _ds.id.pmMakeUniqueIds(key.aggregateIdKey, commitItems.length)
                    .then(function(aggregateIds){
                        assignAllCommitItems(commitItems, aggregateItems, eventItems, aggregateIds);
                        return _ds.id.pmMakeUniqueIds(key.eventIdKey, eventItems.length);
                    }).then(function(eventIds){
                        for(var e = 0; e < eventItems.length; e++){
                            eventItems[e].event.id = eventIds[e];
                        }
                        return Promise.all([
                            _ds.pmSetItems(key.aggregateItemsKey, aggregateItems ),
                            _ds.pmSetItems(key.aggregateItemsKey, eventItems )
                        ]);
                    }).then(function(){
                        return "Success";
                    });
            }
        };
    }
};

module.exports = commitmentService;