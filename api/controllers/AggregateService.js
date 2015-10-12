'use strict';

var aggregateItemsKey = require('../config/redis.config').key.aggregateItemsKey;

var aggregateService = {
  init: function(dep){
    var _ds = dep.dataSource;

    return {
      getAggregate: function(/*aggregateId*/) {
          console.log('TRY!');
        return _ds.pmGetItemsForKey(aggregateItemsKey)
            .then(function (result) {
                console.log('SUCCESS!');
                return { aggregateItems: result || [] };
            });
      }
    }
  }
};

module.exports = aggregateService;