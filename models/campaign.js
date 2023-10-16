const mongoose = require("mongoose");
const moment = require("moment");

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is Required!"],
    },
    category: { type: String, required: [true, "Please select category"] },
    title: { type: String, required: [true, "Please add title"] },
    goal: { type: Number, required: [true, "Please set your goal!"] },
    currency: { type: String, default: "UGX" },
    address: { type: String, required: [true, "Select Address"] },
    district: { type: String, required: [true, "Select District"] },
    startDate: { type: Date },
    endDate: { type: Date },
    shortDescription: { type: String },
    description: { type: String, required: [true, "Please add description"] },
    endMethod: { type: String, default: "goal_achieve" },
    video: { type: String },
    photo: { type: String },
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

Schema.virtual("backers").get(async function () {
  return await this.model("Fund").countDocuments({ campaign: this.id });
});

Schema.virtual("funds").get(async function () {
  return await this.model("Fund").Amount({
    campaign: mongoose.Types.ObjectId(this.id),
  });
});

Schema.virtual("donors").get(async function () {
  const donors = await this.model("Fund")
    .find({
      campaign: mongoose.Types.ObjectId(this.id),
    })
    .populate("donor");

  return donors.map((donor) => {
    return {
      name: donor?.donor?.fullName || donor.donorName || "anonymous",
      amount: donor.amount,
      currency: donor.currency,
      comment: donor.comment,
      date: new Date(donor.createdAt).toDateString(),
    };
  });
});

Schema.virtual("percentage").get(async function () {
  return ((await this.funds) / this.goal) * 100;
});

Schema.virtual("daysLeft").get(function () {
  return Math.abs(
    moment(this.startDate, "YYYY-MM-DD")
      .startOf("day")
      .diff(moment(this.endDate, "YYYY-MM-DD").startOf("day"), "days")
  );
});

module.exports = mongoose.model("Campaign", Schema);
