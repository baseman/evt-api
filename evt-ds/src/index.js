var resourceManager = require('./libs/util/resourceManager');
var dsItems = {
    redis: require('./libs/redisDs'),
    injected: require('./libs/injectedDs')
};

var ds = {
    resourceManager: { instance: resourceManager.getManager() },
    getDs: function(config){
        return dsItems[config.dsType];
    }
};

module.exports = ds;