const { Campaign } = require("../models");

exports.createCampaign = async function (data) {
  return await Campaign.create(data);
};

exports.updateCampaign = async function (id, data) {
  return await Campaign.findByIdAndUpdate(id, data);
};

exports.deleteCampaign = async function (id) {
  return await Campaign.findByIdAndDelete(id);
};
