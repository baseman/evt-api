'use strict';

var aggregateEventItemsKey = require('../config/redis.config').key.aggregateEventItemsKey;

var AggregateEventService = {
  init: function(dep){
    var _ds = dep.dataSource;

    return {
      getAggregateEvent: function(/*aggregateId*/) {
        return _ds.pmGetItemsForKey(aggregateEventItemsKey).then(function(result){
          return { aggregateEventItems: result || [] };
        });
      }
    };
  }
};

module.exports = AggregateEventService;
