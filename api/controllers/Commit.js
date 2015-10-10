'use strict';
var dependencies = require('../system/dependencies');
var commitSvc  = require('./CommitService');

var commitSvcInst;
dependencies.pmInitDependencies.then(function(depInst){
  commitSvcInst = commitSvc.init(depInst.forService);
});

module.exports.commit = function commit (req, res, next) {
  var commitAggregate = req.swagger.params['commitAggregate'].value;

  commitSvcInst.pmCommitAggregate(commitAggregate).then(function (result) {
    if (typeof result !== 'undefined') {
      res.setHeader('Content-Type', 'application/json');
      res.end("Success");
    }
    else {
      res.end();
    }
  }).finally(function(){
    next();
  });
};
