const Twitter = require("twitter");

const client = Twitter({
  consumer_key: '51PXnmtJIkwV0jT1fMusLvwby',
  consumer_secret: 'PfYaJWhUy9wYRmdZQIz9SWvFYdTtKmPKsVeLIzK9DnpuCZGv1T',
  access_token_key: '1329446670992601095-6jl4YBIP6zSgBoi0XJ3B3QnLxABgsN',
  access_token_secret: 'OHxAN1JjUoiP6AvYU1eTjM8nd8hyTqvdzlvnG6MRfO7n1'
});

module.exports = client;