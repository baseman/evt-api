var injectedDs = require('../../../src/libs/injectedDs');

describe('injected data source', function(){
    it('should allow the user to inject the function definition into the data source', function(){
        var inputVal = 'BLAH';
        var expected = ['blah'];
        var dsFx = {
            blah: function(data){
                expect(data).toEqual(inputVal);
                return expected;
            }
        };

        var dataSource = injectedDs.initDataSource(dsFx).dataSource;
        var actual = dataSource.blah(inputVal);
        expect(actual[0]).toEqual(expected[0])
    });
});