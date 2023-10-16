const { google } = require("googleapis");
const { GoogleAuth } = require("google-auth-library");

function DriveService() {
  let auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({
    version: "v3",
    auth: auth.fromJSON({
      /**service account configurations here */
    }),
  });
}

exports.upload = async function upload({ folder, fileName, mimeType, body }) {
  const driveService = DriveService();

  const metadata = {
    name: fileName,
    parents: [folder],
  };

  const media = {
    mimeType,
    body,
  };

  return driveService.files.create({
    resource: metadata,
    media,
    fields: "id",
  });
};

exports.getFileStream = async function getFileStream(fileId) {
  const driveService = DriveService();
  let { data } = await driveService.files.get(
    {
      fileId: fileId,
      alt: "media",
    },
    { responseType: "stream" }
  );

  return data;
};

exports.deleteFile = function deleteFile(fileId) {
  const driveService = DriveService();

  return driveService.files.delete({
    fileId,
  });
};

exports.listFiles = function listFiles() {
  const driveService = DriveService();
  return driveService.files.list({
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  });
};
