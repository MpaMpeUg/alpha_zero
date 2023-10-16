const { campaignService } = require("../services");
const xtend = require("xtend");

exports.createCampaign = async function (req, res) {
  let data = xtend(req.body, { user: req.session.user.id });
  let campaign = await campaignService.createCampaign(data);
  res.json(campaign);
};

exports.updateCampaign = async function (req, res) {
  let campaign = await campaignService.updateCampaign(req.params.id, req.body);
  res.json(campaign);
};

exports.deleteCampaign = async function (req, res) {
  let campaign = await campaignService.deleteCampaign(req.params.id);
  res.json(campaign);
};
