const express = require("express");
const { campaignController } = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const router = express.Router({ mergeParams: true });

router.route("/").post(catchAsync(campaignController.createCampaign));

router
  .route("/:id")
  .patch(catchAsync(campaignController.updateCampaign))
  .put(catchAsync(campaignController.updateCampaign))
  .delete(catchAsync(campaignController.deleteCampaign));

module.exports = router;
