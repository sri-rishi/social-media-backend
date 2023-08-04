const express = require("express");
const { getUser, updateUser, deleteUser, followUser, unfollowUser, getAllUsers } = require("../controllers/user.controller");
const authVerify = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getUser);
router.post("/:id", authVerify, updateUser);
router.delete("/:id", authVerify, deleteUser);
router.post("/:id/follow", authVerify, followUser);
router.post("/:id/unfollow", authVerify, unfollowUser)

module.exports = router;