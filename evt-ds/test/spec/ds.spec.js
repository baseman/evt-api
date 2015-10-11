var ds = require('../../src/index');

describe("data source", function(){
    it("should give access to all available data sources", function(){
        expect(ds.getDs({dsType: 'redis'}).initDataSource).toBeDefined();
        expect(ds.getDs({dsType: 'injected'}).initDataSource).toBeDefined();
        expect(ds.getDs({dsType: 'invalidType'})).toBeUndefined();
    });
});