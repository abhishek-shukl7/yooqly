// config/redis.js
const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL
}); // default localhost:6379

client.on('error', err => console.error('Redis error:', err));
client.connect(); // for redis v4+

module.exports = client;
