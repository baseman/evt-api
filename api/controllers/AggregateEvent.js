'use strict';
var dependencies = require('../system/dependencies');
var aggregateEventService = require('./AggregateEventService');

var aggEvtSvcInst;
dependencies.pmInitDependencies.then(function(depInst){
  aggEvtSvcInst = aggregateEventService.init(depInst.forService);
});

module.exports.getAggregateEvent = function getAggregateEvent (req, res, next) {
  var aggregateId = req.swagger.params['aggregateId'].value;

  aggEvtSvcInst.getAggregateEvent(aggregateId).then(function (result) {
    if (typeof result !== 'undefined') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result || {}, null, 2));
    }
    else {
      res.end();
    }
  }).catch(function(e){
    console.error(e);
    res.statusCode = 500;
    res.end('server encountered an issue');
  }).finally(function(){
    next();
  });
};