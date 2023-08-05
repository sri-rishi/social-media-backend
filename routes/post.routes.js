const express = require("express");
const { getAllPosts, createPost, getSinglePost, updatePost, deletePost, likePost, getTimelinePosts, createComment, deleteComment, sharePost } = require("../controllers/post.controller");
const authVerify = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", getAllPosts);
router.post("/", authVerify, createPost);
router.get("/:id", getSinglePost);
router.post("/:id", authVerify, updatePost);
router.delete("/:id", authVerify, deletePost)
router.post("/:id/like", authVerify, likePost);
router.post("/:postId/share", authVerify, sharePost)
router.get("/:id/timeline", authVerify, getTimelinePosts);

router.post("/:id/comments", authVerify, createComment)
router.delete("/:id/comments/:commentId", authVerify, deleteComment)
module.exports = router;