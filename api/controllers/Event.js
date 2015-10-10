'use strict';
var dependencies = require('../system/dependencies');
var evtSvc = require('./EventService');

var eventSvcInst;
dependencies.pmInitDependencies.then(function(depInst){
  eventSvcInst = evtSvc.init(depInst.forService);
});

module.exports.getEvent = function getEvent (req, res, next) {
  var aggregateId = req.swagger.params['aggregateId'].value;

  eventSvcInst.getEvent(aggregateId).then(function (result) {
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