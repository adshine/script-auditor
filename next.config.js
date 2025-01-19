/** @type {import('next').NextConfig} */

// Increase EventEmitter max listeners
require('events').EventEmitter.defaultMaxListeners = 15;

const nextConfig = {
  // Your existing config here
}

module.exports = nextConfig 