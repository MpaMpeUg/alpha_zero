const express = require("express");
const { statsController } = require("../../controllers");
const catchAsync = require("../../utils/catchAsync");
const router = express.Router({ mergeParams: true });

router.route("/").get(catchAsync(statsController.all));
router.route("/monthly").get(catchAsync(statsController.monthly));

module.exports = router;
