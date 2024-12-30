const os = require('os')
require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'tcb-ff',
      script: 'tcb-ff',
      watch: false,
      instances: os.cpus().length,
      exec_mode: 'cluster',
      env: {
        'KAFKA_BROKER': process.env.KAFKA_BROKER,
        'KAFKA_TOPIC': process.env.KAFKA_TOPIC,
        'REDIS_URL': process.env.REDIS_URL
      }
    }
  ]
};
