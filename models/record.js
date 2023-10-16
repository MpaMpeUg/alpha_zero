const mongoose = require("mongoose");
const searchPlugin = require("./search.plugin");

const Schema = new mongoose.Schema(
  {
    name: { type: String },
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

Schema.plugin(searchPlugin, ["name"]);

module.exports = mongoose.model("Record", Schema);
