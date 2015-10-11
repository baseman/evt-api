'use strict';

var aggregateKey = require('../config/redis.config').key.aggregateIdKey;

var aggregateService = {
  init: function(dep){
    var _ds = dep.dataSource;

    return {
      getAggregate: function(/*aggregateId*/) {
        return _ds.pmGetItemsForKey(aggregateKey)
            .then(function (result) {
              return { aggregateItems: result || [] };
            });
      }
    }
  }
};

module.exports = aggregateService;