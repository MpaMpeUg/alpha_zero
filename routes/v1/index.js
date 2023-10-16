const express = require("express");
const authMiddleware = require("../../middlewares/auth");
const catchAsync = require("../../utils/catchAsync");
const browseRoute = require("./browse.route");
const searchRoute = require("./search.route");
const authRoute = require("./auth.route");
const statsRoute = require("./statistics.route");
const attachmentRoute = require("./attachment.route");
const meRoute = require("./me.route");
const campaignRoute = require("./campaign.route");
const donationRoute = require("./donation.route");
const transactionRoute = require("./transaction.route");
const router = express.Router();

router.use("/auth", authRoute);
router.use("/attachment", attachmentRoute);
router.use("/donations", donationRoute);
router.use(catchAsync(authMiddleware.authenticate));
router.use("/me", meRoute);
router.use("/browse", browseRoute);
router.use("/search", searchRoute);
router.use("/statistics", statsRoute);
router.use("/campaigns", campaignRoute);
router.use("/transactions", transactionRoute);

module.exports = router;
