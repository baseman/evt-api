'use strict';

var eventKey = require('../system/resources').key.getKeys().eventKey;

var EventService = {
  init: function(dep){
    var _ds = dep.dataSource;

    return {
      getEvent: function(/*aggregateId*/) {
        return _ds.dataSource.pmGetItemsForKey(eventKey).then(function(result){
          return { eventItems: result || [] };
        });
      }
    };
  }
};

module.exports = EventService;
