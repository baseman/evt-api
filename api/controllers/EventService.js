'use strict';

var eventKey = require('../config/redis.config').key.eventIdKey;

var EventService = {
  init: function(dep){
    var _ds = dep.dataSource;

    return {
      getEvent: function(/*aggregateId*/) {
        return _ds.pmGetItemsForKey(eventKey).then(function(result){
          return { eventItems: result || [] };
        });
      }
    };
  }
};

module.exports = EventService;
