var redisConfig = {
    key: {
        aggregateIdKey: 'AGGREGATE_ID',
        eventIdKey: 'EVENT_ID',
        aggregateItemsKey: 'AGGREGATE_ITEMS',
        eventItemsKey: 'EVENT_ITEMS'
    },
    redisConn: {
        redisPort: 6379,
        redisHost: '127.0.0.1'
    }
};

module.exports = redisConfig;