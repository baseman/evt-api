var ds = require('evt-ds');

var dsInjected = ds.getDs({dsType: 'injected'});

var dependencies = {
    getForService: function(dsFx){
        return { dataSource: dsInjected.initDataSource(dsFx).dataSource };
    }
};

module.exports = dependencies;