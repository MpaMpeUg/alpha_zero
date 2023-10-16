const express = require("express");
const router = express.Router();
const xtend = require("xtend");
const mongoose = require("mongoose");
const moment = require("moment");
const {
  browseService,
  donateService,
  campaignService,
} = require("../services");

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}

function authenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect(`/sign_in?redirect=${req.path}`);
  }
  next();
}

router.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

router.get("/", function (req, res) {
  res.render("index", { title: "HOME" });
});

router.get("/sign_in", isLoggedIn, function (req, res) {
  res.render("sign_in", { title: "SIGN IN" });
});

router.get("/sign_up", isLoggedIn, function (req, res) {
  res.render("sign_up", { title: "SIGN UP" });
});

router.get("/sign_out", function (req, res) {
  req.session.user = undefined;
  res.redirect("/");
});

router.get("/create_campaign", authenticated, function (req, res) {
  res.render("create_campaign", { title: "CREATE CAMPAIGN" });
});

router.get("/contact_us", function (req, res) {
  res.render("contact_us", { title: "CONTACT US" });
});

router.get("/about_us", function (req, res) {
  res.render("about_us", { title: "ABOUT US" });
});

router.get("/coming_soon", function (req, res) {
  res.render("coming_soon", { title: "COMING SOON" });
});

router.get("/transfer", authenticated, function (req, res) {
  res.render("transfer", { title: "TRANSFER FUNDS" });
});

router.get("/health_info", function (req, res) {
  res.render("health_info", { title: "HEALTH INFO" });
});

router.get("/campaigns", async function (req, res) {
  let { data, total } = await browseService.findCategories("campaigns", {
    offset: 0,
    limit: 25,
  });

  data = data.map(async (item) =>
    xtend(item.toJSON(), {
      funds: await item.funds,
      percentage: await item.percentage,
      backers: await item.backers,
    })
  );

  res.render("campaigns", {
    title: "CAMPAIGNS",
    campaigns: await Promise.all(data),
  });
});

router.get("/campaigns/:id", async function (req, res) {
  const campaign = await browseService.findCategory({
    id: req.params.id,
    category: "campaign",
  });

  const funds = await campaign.funds;
  const backers = await campaign.backers;
  const donors = await campaign.donors;

  res.render("campaign_details", {
    title: `CAMPAIGN #${req.params.id}`,
    campaign: xtend(campaign.toJSON(), {
      funds,
      percentage: Math.floor((funds / campaign.goal) * 100),
      backers,
      donors,
    }),
  });
});

module.exports = router;
