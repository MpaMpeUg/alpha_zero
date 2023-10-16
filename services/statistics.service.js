const { User } = require("../models");

exports.monthly = async function (query) {
  let users = await User.countPerMonth(query);

  return { users };
};

exports.all = async function (query) {
  let users = await User.countDocuments(query);

  return { users };
};
