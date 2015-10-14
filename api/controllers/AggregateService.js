'use strict';

var aggregateItemsKey = require('../config/redis.config').key.aggregateItemsKey;

var aggregateService = {
  init: function(dep){
    var _ds = dep.dataSource;

    return {
      getAggregate: function(/*aggregateId*/) {

        return _ds.pmGetItemsForKey(aggregateItemsKey)
            .then(function (result) {
                return { aggregateItems: result || [] };
            });
      }
    }
  }
};

module.exports = aggregateService;