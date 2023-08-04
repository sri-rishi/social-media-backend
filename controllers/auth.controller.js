const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env['JWT_SECRET_KEY'];

// registering new user

const registerUser = async (req, res) => {
  const { email, userHandler, password, firstname, lastname } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt)

  const newUser = new UserModel({
    email,
    userHandler,
    password: hashPassword,
    firstname,
    lastname
  });

  try {
    const prevUser = await UserModel.findOne({ userHandler })
    if (prevUser) {
      return res.status(400).json({ message: "userHandler is already registerd" });
    }
    const user = await newUser.save();
    const token = jwt.sign({
      username: user.username, id: user._id
    }, JWT_SECRET_KEY, { expiresIn: "24h" });
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json(error)
  }
}

// login user

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json("Wrong password")
      } else {
        const token = jwt.sign({
          email: user.email, id: user._id
        }, JWT_SECRET_KEY, { expiresIn: "24h" });
        res.status(200).json({ user, token });
      }
    }
    else {
      res.status(404).json("User does not exists");
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = { registerUser, loginUser }