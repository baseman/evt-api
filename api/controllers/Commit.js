'use strict';

var dependencies = require('../system/dependencies');
var commitService = require('./CommitService').init(dependencies.getForService());

module.exports.commit = function commit (req, res, next) {
  var commitAggregate = req.swagger.params['commitAggregate'].value;

  commitService.pmCommitAggregate(commitAggregate).then(function (result) {
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
