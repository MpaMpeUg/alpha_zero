const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  ownedBy: { type: String },
  id: { type: String },
  mimetype: { type: String },
  name: { type: String },
  remarks: { type: String },
  path: { type: String },
});

module.exports = mongoose.model("Attachment", Schema);
