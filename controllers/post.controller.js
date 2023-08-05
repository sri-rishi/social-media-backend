const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const mongoose = require("mongoose");
const axios = require("axios");
const CronJob = require("cron").CronJob;

const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json({ posts })
  } catch (error) {
    res.status(500).json(error);
  }
}

// Create new Post 
const createPost = async (req, res) => {
  const newPost = new PostModel(req.body);

  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get a post 
const getSinglePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update a Post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body })
      res.status(200).json(post)
    } else {
      res.status(403).json("Action forbidden")
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

// Delete a Post

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).json("post Deleted");
    } else {
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// like/dislike a post
const likePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json(post)
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json(post)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

// share a post
const sharePost = async (req, res) => {
  const { id } = req.params;
  const { receiverId } = req.body;

  try {
    const post = await PostModel.findById(id);

    if (post) {
      if (receiverId !== post.userId) {
        await post.updateOne({ $push: { sharedTo: receiverId } });
        res.status(200).json(post)
      } else {
        res.status(403).json("Action Forbidden")
      }
    } else {
      res.status(404).json("Post not found")
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

// Timeline posts
const getTimelinePosts = async (req, res) => {
  const userId = req.params.id;

  try {
    const currentUserPosts = await PostModel.find({ userId: userId });
    const sharedPosts = await PostModel.find({ sharedTo: userId })
    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts"
        }
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0
        }
      }
    ])
    const timelinePosts = [...currentUserPosts, ...sharedPosts, ...followingPosts[0].followingPosts].sort((a, b) => b.createdAt - a.createdAt)
    res.status(200).json(timelinePosts)
  } catch (error) {
    res.status(500).json(error)
  }
}

// callback for scheduling post
const postScheduledPost = async (post) => {
  try {
    const response = await axios.post('https://social-media-backend.sririshi.repl.co/posts/', post);
    console.log(`Successfully posted scheduled post "${post.title}"`);
  } catch (error) {
    console.error(`Error posting scheduled post "${post.title}": ${error.message}`);
  }
};

// schedule Post 
const schedulePost = async () => {
  const posts = await PostModel.find({ scheduledTime: { $lte: new Date() } }).exec();
  for (const post of posts) {
    try {
      await postScheduledPost(post);
      console.log(post);
    } catch (error) {
      console.error(error)
    }

    await PostModel.deleteOne({ _id: post._id }).exec();
  }
}

const job = new CronJob("* 1 * * * *", schedulePost);

job.start();

// Create new comment 
const createComment = async (req, res) => {
  const postId = req.params.id;
  let commentObj = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post) {
      await post.updateOne({ $push: { comments: commentObj } });
      res.status(200).json(post)
    } else {
      res.staus(404).json("Post not found")
    }
  } catch (error) {
    res.status(500).json(error)
  }
}


// Delete a comment 
const deleteComment = async (req, res) => {
  const postId = req.params.id;
  const commentId = req.params.commentId;
  const { userId } = req.body;
  console.log(req.params)

  try {
    const post = await PostModel.findById(postId);

    if (post) {
      const comment = post.comments.find(comment => comment._id.equals(commentId));

      if (comment.userId === userId) {
        await post.updateOne({ $pull: { comments: comment } })
        res.status(200).json(post);
      } else {
        res.status(403).json("Acion Forbidden")
      }
    } else {
      res.status(404).json("Post not found")
    }

  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = { getAllPosts, createPost, getSinglePost, updatePost, deletePost, likePost, getTimelinePosts, createComment, deleteComment, sharePost }