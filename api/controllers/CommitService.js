'use strict';

var Promise = require('bluebird');
var key = require('../config/redis.config').key;

function assignId(commitAgg, uniqueId) {
    commitAgg.aggregate.id = uniqueId;
    var aggEvts = commitAgg.aggregateEventItems;
    for(var i = 0; i < aggEvts; i++){
        aggEvts[i].aggregate.id = uniqueId
    }
}
function assignCommitItem(commitAgg, aggs, aggEvts) {
    aggs.push({aggregate: commitAgg.aggregate});
    for(var i = 0; i < commitAgg.aggregateEventItems.length; i++){
        aggEvts.push(commitAgg.aggregateEventItems[i]);
    }
}
function assignAllCommitItems(commitItems, aggs, aggEvts, aggIds){
    for(var a = 0; a < commitItems.length; a++){
        var commitItem = commitItems[a];
        assignId(commitItem.commitAggregate, aggIds[a]);
        assignCommitItem(commitItem.commitAggregate, aggs, aggEvts);
    }
}

var commitmentService = {
    init: function (dep) {
        var _ds = dep.dataSource;

        return {
            pmCommitAggregate: function(data) {

                var _commitItems = data.commitAggregateBody.commitAggregateItems;
                var _aggEvts = [];
                var _aggs = [];

                return _ds.id.pmMakeUniqueIds(key.aggregateIdKey, _commitItems.length)
                    .then(function(aggIds){
                        assignAllCommitItems(_commitItems, _aggs, _aggEvts, aggIds);
                        return _ds.id.pmMakeUniqueIds(key.aggregateEventIdKey, _aggEvts.length);
                    }).then(function(aggEvtIds){
                        for(var e = 0; e < _aggEvts.length; e++){
                            _aggEvts[e].aggregateEvent.id = aggEvtIds[e];
                        }
                        return Promise.all([
                            _ds.pmSetItems(key.aggregateItemsKey, _aggs ),
                            _ds.pmSetItems(key.aggregateEventItemsKey, _aggEvts )
                        ]);
                    }).then(function(){
                        return "Success";
                    });
            }
        };
    }
};

module.exports = commitmentService;