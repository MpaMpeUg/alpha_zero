const xtend = require("xtend");
const moment = require("moment");

module.exports = function (schema) {
  schema.statics = xtend(schema.statics, {
    countPerMonth: async function (query = {}) {
      const startYear = moment().startOf("year").toDate();
      const stopYear = moment().endOf("year").toDate();

      let stats = await this.aggregate([
        {
          $match: xtend(query, {
            $expr: {
              $and: [
                { $gte: ["$createdAt", startYear] },
                { $lte: ["$createdAt", stopYear] },
              ],
            },
          }),
        },
        {
          $group: {
            _id: {
              year: {
                $year: "$createdAt",
              },
              month: {
                $month: "$createdAt",
              },
            },
            count: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]);

      const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const data = stats.map(({ _id, count }) => xtend(_id, { count }));

      return months.map((month) => {
        let index = data.findIndex((item) => item.month === month);
        return index >= 0 ? data[index].count : 0;
      });
    },

    Amount: async function (query = {}) {
      let [total] = await this.aggregate([
        { $match: query },
        {
          $group: {
            _id: undefined,
            amount: { $sum: "$amount" },
          },
        },
      ]);

      return total ? total.amount : 0;
    },
  });
};
