const { Fund } = require("../models");

exports.fundCampaign = async function (data) {
  return await Fund.create(data);
};

exports.totalFunds = async function (query) {
  return await Fund.Amount(query);
};

exports.countCampaignBackers = async function (query) {
  return await Fund.countDocuments(query);
};
