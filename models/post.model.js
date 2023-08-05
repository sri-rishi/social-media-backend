const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    text: String,
  },
  {
    timestamps: true
  }
);

const PostSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    desc: String,
    likes: {
      likedBy: [],
      likeCount: Number
    },
    image: String,
    comments: [commentSchema],
    scheduledTime: Date,
    sharedTo: []
  },
  {
    timestamps: true
  }
)

const PostModel = mongoose.model("Posts", PostSchema);

module.exports = PostModel