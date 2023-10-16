const express = require("express");
const { donateController } = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const router = express.Router({ mergeParams: true });

router
  .route("/fund/:campaignId")
  .post(catchAsync(donateController.fundCampaign));

router
  .route("/fund")
  .post(catchAsync(donateController.fundMpaMpe));

module.exports = router;
