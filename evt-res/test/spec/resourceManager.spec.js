var resourceManager = require('../../src/managedResource/resourceManager');

describe("resource factory" , function(){

    var _instance;
    beforeEach(function(){
        _instance = resourceManager.getManager();
    });

    it("should create resources", function(){
        var actual = _instance.createResource({
            promiseInitResource: function(){},
            checkResource: function(){},
            cleanupResource: function(){},
            onUse: function(){},
            onUsed: function(){}
        });

        expect(actual.promiseInitResource).toBeDefined();
        expect(actual.checkResource).toBeDefined();
        expect(actual.onUse).toBeDefined();
        expect(actual.onUsed).toBeDefined();
    });

    it("should not create resources without proper implementation", function(){
        expect(function(){
            _instance.createResource({
                checkResource: function(){},
                cleanupResource: function(){},
                onUse: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("promiseInitResource has not been defined"));

        expect(function(){
            _instance.createResource({
                promiseInitResource: function(){},
                cleanupResource: function(){},
                onUse: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("checkResource has not been defined"));

        expect(function(){
            _instance.createResource({
                promiseInitResource: function(){},
                checkResource: function(){},
                onUse: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("cleanupResource has not been defined"));

        expect(function(){
            _instance.createResource({
                promiseInitResource: function(){},
                checkResource: function(){},
                cleanupResource: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("onUse has not been defined"));

        expect(function(){
            _instance.createResource({
                promiseInitResource: function(){},
                checkResource: function(){},
                cleanupResource: function(){},
                onUse: function(){}
            })
        }).toThrow(new Error("onUsed has not been defined"));
    });

    it("should cleanup resources", function(){
        _instance.cleanUpResources();
    });
});