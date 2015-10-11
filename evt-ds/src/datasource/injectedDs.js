var _injectedDs;

module.exports = { initDataSource: function(injectedDs){
    _injectedDs = injectedDs;
    return { dataSource: _injectedDs };
}};