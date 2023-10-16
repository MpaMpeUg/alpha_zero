const mongoose = require("mongoose");
const statisticsPlugin = require("./statistics.plugin");

const Schema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      // required: [true, "Please select campaign!"],
    },
    donorEmail: { type: String },
    donorName: { type: String, default: "anonymous" },
    comment: { type: String },
    amount: { type: Number, required: [true, "Please enter amount!"] },
    currency: { type: String, required: [true, "Please select currency!"], default: "EUR" },
    status: { type: String, enum: ["Pending", "Received"], default: "Pending" },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

Schema.plugin(statisticsPlugin);

module.exports = mongoose.model("Fund", Schema);
