const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    userId: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    username: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
    },
    likes: {
      type: Array,
    },
    comments: {
      type: Array,
    },
    type: {
      type: String,
    },
    publicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("post", postSchema);

module.exports = Post;
