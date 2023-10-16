const express = require("express");
const { authController } = require("../../controllers");
const { authValidation } = require("../../validations");
const validate = require("../../middlewares/validate");
const catchAsync = require("../../utils/catchAsync");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(catchAsync(authController.signup))
  .patch(catchAsync(authController.signup));

router
  .route("/login")
  .post(validate(authValidation.login), catchAsync(authController.login));

router.route("/:id").delete(catchAsync(authController.deleteUser));

module.exports = router;
