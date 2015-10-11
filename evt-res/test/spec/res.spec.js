var resource = require('../../src/index');

describe("resource", function(){
    it("should give access to all available resource libs", function(){
        expect(resource.managedResource.redis.promiseInitResource).toBeDefined();
        expect(resource.resourceManager).toBeDefined();
    });
});