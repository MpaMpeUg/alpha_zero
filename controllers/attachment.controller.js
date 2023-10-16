const fs = require("fs");
const AppError = require("../utils/AppError");
const httpStatus = require("http-status");
const { attachmentService, googleDriveService } = require("../services");
const xtend = require("xtend");

exports.upload = async (req, res, next) => {
  let file = req.file;

  let { data, status } = await googleDriveService.upload({
    folder: "folder id",
    fileName: file.originalname,
    mimeType: file.mimetype,
    body: fs.createReadStream(file.path),
  });

  if (status === 200) {
    let attachment = await attachmentService.add(
      xtend(file, req.body, data, {
        name: file.originalname,
      })
    );
    res.json(attachment);
  } else {
    next(
      new AppError(
        "Failed to upload attachment",
        httpStatus.UNSUPPORTED_MEDIA_TYPE
      )
    );
  }

  fs.unlinkSync(file.path);
};

exports.download = async (req, res) => {
  let attachment = await attachmentService.getOne(req.params.id);
  let stream = await googleDriveService.getFileStream(attachment.id);
  res.contentType(attachment.mimetype);
  stream.pipe(res);
};

exports.delete = async (req, res) => {
  let attachment = await attachmentService.getOne(req.params.id);
  await googleDriveService.deleteFile(attachment.id);
  await attachmentService.delete({ id: attachment.id });

  res.json(attachment);
};
