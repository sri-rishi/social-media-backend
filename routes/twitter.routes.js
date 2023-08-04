const express = require("express");
const getTweets = require("../controllers/twitter.controller");
const router = express.Router();

router.get("/user", getTweets);

module.exports = router