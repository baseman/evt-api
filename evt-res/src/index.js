var resource = {
    managedResource: {
        redis: require('./managedResource/redisDs.managedResource').redis
    },
    resourceManager: require('./managedResource/resourceManager')
};

module.exports = resource;