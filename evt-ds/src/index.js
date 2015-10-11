var dsItems = {
    redis: require('./datasource/redisDs'),
    injected: require('./datasource/injectedDs')
};

var ds = {
    getDs: function(config){
        return dsItems[config.dsType];
    }
};

module.exports = ds;