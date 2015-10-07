'use strict';

var eventKey = require('../system/resources').key.getKeys().eventKey;

var EventService = {
  init: function(dep){
    var _dep = dep;

    return {
      getEvent: function(/*aggregateId*/) {
        return _dep.dataSource.promiseGetItems(eventKey).then(function(result){
          return { eventItems: result || [] };
        });
      }
    };
  }
};

module.exports = EventService;
