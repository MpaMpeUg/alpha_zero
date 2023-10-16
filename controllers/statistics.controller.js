const { statisticsService } = require("../services");

exports.all = async (req, res, next) => {
  let data = await statisticsService.all(req.query);
  res.json(data);
};

exports.monthly = async (req, res, next) => {
  let data = await statisticsService.monthly(req.query);
  res.json(data);
};
