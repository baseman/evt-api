var dsItems = {
    redis: require('./datasource/redisDs'),
    injected: require('./datasource/injectedDs')
};

var ds = {
    managedResource: {
        redis: require('./managedResource/redisDs.managedResource').redis
    },
    getDs: function(config){
        return dsItems[config.dsType];
    }
};

module.exports = ds;