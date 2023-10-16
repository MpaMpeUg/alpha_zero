const mongoose = require("mongoose");
const statisticsPlugin = require("./statistics.plugin");

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please select user!"],
    },
    amount: { type: Number, required: [true, "Please enter amount!"] },
    currency: { type: String, required: [true, "Please select currency!"] },
    idType: {
      type: String,
      enum: ["MSISDN", "ACCOUNT_NO"],
      required: [true, "Please select ID type!"],
    },
    idValue: {
      type: String,
      required: [true, "Please add ID!"],
    },
    status: {
      type: String,
      default: "pending",
      enum: ["Pending", "Received"],
    },
    transactionId: { type: String },
    transferId: { type: String },
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

Schema.pre("save", async function (next) {
  /**
   * check balance before withdraw or transfer!
   */
  let user = await this.model("User").findById(this.user);
  let balance = await user.accountBalance;

  if (this.amount > balance) {
    return next(new Error("INSUFFICIENT BALANCE"));
  }

  next();
});

Schema.plugin(statisticsPlugin);

module.exports = mongoose.model("Withdraw", Schema);
