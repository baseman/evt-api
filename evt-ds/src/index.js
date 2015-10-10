var dsItems = {
    redis: require('./libs/redisDs'),
    injected: require('./libs/injectedDs')
};

var ds = {
    getDs: function(config){
        return dsItems[config.dsType];
    }
};

module.exports = ds;