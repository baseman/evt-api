'use strict';

var eventItemsKey = require('../config/redis.config').key.eventItemsKey;

var EventService = {
  init: function(dep){
    var _ds = dep.dataSource;

    return {
      getEvent: function(/*aggregateId*/) {
        return _ds.pmGetItemsForKey(eventItemsKey).then(function(result){
          return { eventItems: result || [] };
        });
      }
    };
  }
};

module.exports = EventService;
