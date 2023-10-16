const { Attachment } = require("../models");

exports.add = async function (data) {
  return await Attachment.create(data);
};

exports.get = async function (query) {
  return await Attachment.find(query);
};

exports.getOne = async function (id) {
  return await Attachment.findById(id);
};

exports.delete = async function (query) {
  return await Attachment.deleteMany(query);
};
