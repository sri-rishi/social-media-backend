const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const auth = require("./routes/auth.routes");
const users = require("./routes/user.routes");
const posts = require("./routes/post.routes");
const twitter = require("./routes/twitter.routes");


// routes

const app = express();
connectDB();

// middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


//uses of routes
app.get("/", (req, res) => {
  res.send("Social Media Server")
})
app.use("/auth", auth);
app.use("/user", users);
app.use("/posts", posts);
app.use("/twitter", twitter);

const port = process.env.PORT || 8000

app.listen(port, () => console.log(`Server is listening on ${port}`))