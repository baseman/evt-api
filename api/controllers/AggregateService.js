'use strict';
var aggregateKey = require('../system/resources').key.getKeys().aggregateKey;

var aggregateService = {
  init: function(dep){
    var _dep = dep;

    return {
      getAggregate: function(/*aggregateId*/) {
        //todo: change pmGetItemsForKey to pmGetItemsForPrefixedKey(aggregateKey, '*')
        return _dep.dataSource.pmGetItemsForKey(aggregateKey)
            .then(function (result) {
              return { aggregateItems: result || [] };
            });
      }
    }
  }
};

module.exports = aggregateService;
