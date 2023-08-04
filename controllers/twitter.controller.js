const client = require("../models/twitter.model");

const getTweets = async (req, res) => {
  client.get('statuses/user_timeline', (error, tweet, response) => {
    if (error) {
      res.status(500).send({ message: error.message });
    } else {
      res.send({ tweet });
    }
  });
};
module.exports = getTweets;