const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");


// getAllUsers
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json(error)
  }
}

// get a user
const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findById(id)

    if (user) {
      const { password, ...otherDetails } = user._doc;
      res.status(200).json(otherDetails)
    } else {
      res.status(404).json("No such user exists")
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

//update a user
const updateUser = async (req, res) => {
  const { id } = req.params;

  const { currentUserId, password } = req.body;

  if (id === currentUserId) {
    try {

      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can update only your own profile");
  }
}

// Delete User 
const deleteUser = async (req, res) => {
  const { id } = req.params;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User deleted successsfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can delete only your own profile");
  }
}


// follow a user 
const followUser = async (req, res) => {
  const { id } = req.params;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followinguser = await UserModel.findById(currentUserId);

      if (!followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $push: { followers: currentUserId } });
        await followinguser.updateOne({ $push: { following: id } });
        const users = await UserModel.find();
        res.status(200).json({ users });
      } else {
        res.status(403).json("User is Already followed by you");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

// Unfollow User
const unfollowUser = async (req, res) => {
  const { id } = req.params;

  const { currentUserId } = req.body;

  if (currentUserId === id) {
    res.status(403).json("Action forbidden");
  } else {
    try {
      const followUser = await UserModel.findById(id);
      const followinguser = await UserModel.findById(currentUserId);

      if (followUser.followers.includes(currentUserId)) {
        await followUser.updateOne({ $pull: { followers: currentUserId } });
        await followinguser.updateOne({ $pull: { following: id } });
        const users = await UserModel.find();
        res.status(200).json({ users });
      } else {
        res.status(403).json("User is not followed by you")
      }
    } catch (error) {
      res.status(500).json(error)
    }
  }
}

module.exports = { getAllUsers, getUser, updateUser, deleteUser, followUser, unfollowUser }