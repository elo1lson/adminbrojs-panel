const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  guild: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  message_id: {
    type: String,
    required: true,
  },
  guild_name: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  youtube_url: {
    type: String,
    required: false,
  },
  ping: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Message", PostSchema);
