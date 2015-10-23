var local = '127.0.0.1';
var redisConfig = {
    redis: {
        key: {
            testIdKey: 'test_key',
            testItemsKey: 'testItemsKey'
        },
        redisHost: local,
        redisPort: 6379
    }
};

module.exports = redisConfig;