const mongoose = require("mongoose");
const bcryptPlugin = require("mongoose-bcrypt");
const searchPlugin = require("./search.plugin");
const statsPlugin = require("./statistics.plugin");

const Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please Enter username!"],
      unique: [true, "Username already in use!"],
      validate: {
        validator: function (username) {
          return !["admin"].includes(username.toLowerCase());
        },
        message: "Username already taken!",
      },
      lowercase: true,
      trim: true,
    },
    fullName: { type: String, require: [true, "Please enter your name!"] },
    email: {
      type: String,
      required: [true, "Please enter your email address!"],
      unique: [true, "Email already in use!"],
    },
    password: {
      type: String,
      select: false,
      bcrypt: true,
      required: [true, "Please enter password!"],
    },
    roles: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

Schema.virtual("accountBalance").get(async function () {
  //select all user campaigns
  let campaigns = await this.model("Campaign")
    .find({ user: this.id })
    .select("_id");

  // sum all user campaign funds
  let tasks = await Promise.all(
    campaigns.map((campaign) =>
      this.model("Fund").Amount({
        campaign: mongoose.Types.ObjectId(campaign.id),
        status: "Received",
      })
    )
  );

  let funds = tasks.reduce((a, b) => a + b, 0);

  //get user withdraws
  let withdraw = await this.model("Withdraw").Amount({
    user: mongoose.Types.ObjectId(this.id),
    status: "Received",
  });

  //balance
  return funds - withdraw;
});

Schema.plugin(bcryptPlugin, { rounds: 8 });
Schema.plugin(searchPlugin, ["username"]);
Schema.plugin(statsPlugin);

module.exports = mongoose.model("User", Schema);
