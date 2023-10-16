module.exports = function (schema, fields) {
  schema.statics = {
    ...schema.statics,
    makePartialSearchQueries: function (q, assertions = "") {
      if (!q) return {};
      return {
        $or: fields.map((field) => {
          return { [field]: { $regex: new RegExp(`${assertions}${q}`, "gi") } };
        }),
      };
    },
    searchPartial: function (q, opts, assertions = "") {
      return this.find(this.makePartialSearchQueries(q, assertions)).populate(
        opts.populate
      );
    },
    search: async function (q, opts) {
      if (!opts.where) opts.where = {};

      let total = this.searchPartial(q, {}, "^").countDocuments();
      let data = this.searchPartial(q, opts, "^")
        .where(opts.where)
        .skip(opts.skip)
        .limit(opts.limit)
        .select(opts.select)
        .populate(opts.populate);
      [data, total] = await Promise.all([data, total]);

      if (!data.length && !total) {
        total = this.searchPartial(q, {}, "").countDocuments();
        data = this.searchPartial(q, opts, "")
          .where(opts.where)
          .skip(opts.skip)
          .limit(opts.limit)
          .select(opts.select);
        [data, total] = await Promise.all([data, total]);
      }
      return [data, total];
    },
  };
};
