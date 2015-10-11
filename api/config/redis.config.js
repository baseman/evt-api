var redisConfig = {
    key: {
        aggregateIdKey: 'AGGREGATE_ID',
        eventIdKey: 'EVENT_ID'
    },
    redisConn: {
        redisPort: 6379,
        redisHost: '127.0.0.1'
    }
};

module.exports = redisConfig;