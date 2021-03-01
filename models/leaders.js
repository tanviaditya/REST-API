const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const leaderScheme = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    details: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    abbr: {
      type: String,
    },
    designation: {
      type: String,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

var Leaders = mongoose.model("Leader", leaderScheme);

module.exports = Leaders;
