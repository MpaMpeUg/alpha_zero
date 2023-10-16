const express = require("express");
const { browseController } = require("../../controllers");
const { browseValidation } = require("../../validations");
const catchAsync = require("../../utils/catchAsync.js");
const validate = require("../../middlewares/validate");
const router = express.Router({ mergeParams: true });

router
  .route("/:category")
  .get(
    validate(browseValidation.getCategories),
    catchAsync(browseController.getCategories)
  );

router
  .route("/:category/:id")
  .get(
    validate(browseValidation.getCategory),
    catchAsync(browseController.getCategory)
  );

module.exports = router;
