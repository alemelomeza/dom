module.exports = {
    env: process.env.PROCESS || 'development',
    port: process.env.PORT || 3000,
    db: {
        uri: 'mongodb+srv://api-client:pRZbCQqPo1zpcZLA@cluster0-jjlqh.mongodb.net/api-polygons?retryWrites=true',
        user: 'api-client',
        password: 'pRZbCQqPo1zpcZLA',
        name: 'api-polygons'
    }
}
