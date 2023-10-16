const express = require("express");
const { attachmentController } = require("../../controllers");
const { multer } = require("../../middlewares/upload");
const router = express.Router({ mergeParams: true });

router.post("/", multer, attachmentController.upload);

router
  .route("/:id")
  .get(attachmentController.download)
  .delete(attachmentController.delete);

module.exports = router;
