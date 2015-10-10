'use strict';
var dependencies = require('../system/dependencies');
var aggregateSvc = require('./AggregateService');

var aggregateSvcInst;
dependencies.pmInitDependencies.then(function(depInst){
    aggregateSvcInst = aggregateSvc.init(depInst.forService);
});

module.exports.getAggregate = function getAggregate (req, res, next) {
    var aggregateId = req.swagger.params['aggregateId'].value;

    aggregateSvcInst.getAggregate(aggregateId)
        .then(function (result) {
            if (typeof result !== 'undefined') {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(result || {}, null, 2));
            }
            else {
                res.end();
            }
        }).catch(function (e) {
            console.error(e.stack);
            res.statusCode = 500;
            res.end('server encountered an issue');
        }).finally(function () {
            next();
        });
};
