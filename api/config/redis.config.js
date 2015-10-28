var redisConfig = {
    key: {
        aggregateIdKey: 'AGGREGATE_ID',
        aggregateEventIdKey: 'AGGREGATE_EVENT_ID',
        aggregateItemsKey: 'AGGREGATE_ITEMS',
        aggregateEventItemsKey: 'AGGREGATE_EVENT_ITEMS'
    },
    redisConn: {
        redisPort: 6379,
        redisHost: '127.0.0.1'
    }
};

module.exports = redisConfig;