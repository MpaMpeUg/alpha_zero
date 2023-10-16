const mongoose = require("mongoose");
const Logger = require("./logger");
const constants = require("./constants");

const database = {};
database.isConnectedToDb = false;

database.isConnected = function isConnected() {
  return database.isConnectedToDb;
};

mongoose.connection.on("error", (err) => {
  Logger.error(`Got error event ${err}`);
});

mongoose.connection.on("disconnected", () => {
  Logger.error("Got disconnected event from database");
  database.isConnectedToDb = false;
});

mongoose.connection.on("reconnected", () => {
  Logger.log("Got reconnected event from database");
  database.isConnectedToDb = true;
});

// mongodb://root:ronnie@mpampe-db.cloud.koodeyo.com:27018/mpampe?authSource=admin
// mongodb+srv://<username>:<password>@mpampe.m77zv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// mongodb://ronlin:RONLINMongos22@mpampe.m77zv.mongodb.net/MpaMpe?retryWrites=true&w=majority
// mongodb+srv://ronlin:RONLINMongos22@mpampe.m77zv.mongodb.net/MpaMpe?retryWrites=true&w=majority
// mongodb+srv://<username>:<password>@mpampe.m77zv.mongodb.net/?retryWrites=true&w=majority
// mongodb+srv://mpampe:<password>@init.tcfwenq.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://emmilly:pacifique@cluster0.rruy4ud.mongodb.net/?retryWrites=true&w=majority

database.connect = function connect() {
  // mongoose.set("debug", process.env.NODE_ENV !== "production");
  mongoose
    .connect('mongodb+srv://newtest:newtest@cluster0.7p3vdwj.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      connectTimeoutMS: 3000,
      useFindAndModify: false,
    })
    .then(() => {
      Logger.log("Successfully connected to system database");
      database.isConnectedToDb = true;
    })
    .catch((err) => {
      Logger.error(
        `An error occurred while trying to connect to the system database, retrying in ${constants.database.connectRetry}s. Err: ${err}`
      );
      setTimeout(database.connect, constants.database.connectRetry * 1000);
    });
};

database.disconnect = function disconnect() {
  if (database.isConnected()) {
    mongoose
      .disconnect()
      .then(() => {
        database.isConnectedToDb = false;
      })
      .catch((err) => {
        Logger.error(
          `An error occurred while trying to disconnect from the system database. Err: ${err}`
        );
      });
  }
};

module.exports = database;
