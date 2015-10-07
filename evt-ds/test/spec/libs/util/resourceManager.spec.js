var resourceManager = require('../../../../src/libs/util/resourceManager');

describe("resource factory" , function(){

    var _instance;
    beforeEach(function(){
        _instance = resourceManager.getManager();
    });

    it("should create resources", function(){
        var actual = _instance.createResource({
            initResource: function(){},
            checkResource: function(){},
            cleanupResource: function(){},
            getResource: function(){},
            onUse: function(){},
            onUsed: function(){}
        });

        expect(actual.initResource).toBeDefined();
        expect(actual.checkResource).toBeDefined();
        expect(actual.getResource).toBeDefined();
        expect(actual.onUse).toBeDefined();
        expect(actual.onUsed).toBeDefined();
    });

    it("should not create resources without proper implementation", function(){
        expect(function(){
            _instance.createResource({
                checkResource: function(){},
                cleanupResource: function(){},
                getResource: function(){},
                onUse: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("initResource has not been defined"));

        expect(function(){
            _instance.createResource({
                initResource: function(){},
                cleanupResource: function(){},
                getResource: function(){},
                onUse: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("checkResource has not been defined"));

        expect(function(){
            _instance.createResource({
                initResource: function(){},
                checkResource: function(){},
                getResource: function(){},
                onUse: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("cleanupResource has not been defined"));

        expect(function(){
            _instance.createResource({
                initResource: function(){},
                checkResource: function(){},
                cleanupResource: function(){},
                onUse: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("getResource has not been defined"));

        expect(function(){
            _instance.createResource({
                initResource: function(){},
                checkResource: function(){},
                cleanupResource: function(){},
                getResource: function(){},
                onUsed: function(){}
            })
        }).toThrow(new Error("onUse has not been defined"));

        expect(function(){
            _instance.createResource({
                initResource: function(){},
                checkResource: function(){},
                cleanupResource: function(){},
                getResource: function(){},
                onUse: function(){}
            })
        }).toThrow(new Error("onUsed has not been defined"));
    });

    it("should cleanup resources", function(){
        _instance.cleanUpResources();
    });
});