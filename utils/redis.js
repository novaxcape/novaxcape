const Redis = require('ioredis')

if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL must be set before initializing Redis')
}

const client = new Redis(process.env.REDIS_URL)

client.on('error', (err) => {
    console.log('Redis error:', err)
})

client.on('connect', (err) => {
    console.log('Redis successfully connected')
})

module.exports = client

