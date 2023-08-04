const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    userHandler: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    profilePicture: String,
    coverPicture: String,
    about: String,
    livesIn: String,
    worksAt: String,
    followers: [],
    following: [],
  },
  {
    timestamps: true
  }
)

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;