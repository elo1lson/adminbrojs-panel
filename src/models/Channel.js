const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  description: {
    type: String,
    required: false,
  },
  ping_name: {
    type: String,
    required: true,
  },
  ping: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  guild: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Channel", Schema);
