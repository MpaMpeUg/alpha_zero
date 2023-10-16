const { Record, User } = require("../models");

module.exports.search = async (query) => {
  //if type is sent then search on this type if not search on all types
  switch (query.type) {
    case "users": {
      let users = await searchForUsers(query.q, query.offset, query.limit);
      return users;
    }

    case "record": {
      let records = await searchForRecords(query.q, query.offset, query.limit);
      return records;
    }

    default: {
      let users = await searchForUsers(query.q, query.offset, query.limit);
      let records = searchForRecords(query.q, query.offset, query.limit);

      [users, records] = await Promise.all([users, records]);
      return { users, records };
    }
  }
};

const searchForUsers = async (q, offset, limit) => {
  //options that will be done after getting items of search
  const options = {
    select: "username email",
    skip: offset,
    limit: limit,
  };
  const [items, total] = await User.search(q, options);
  return { items, offset, limit, total };
};

const searchForRecords = async (q, offset, limit) => {
  //options that will be done after getting items of search
  const options = {
    select: "name",
    skip: offset,
    limit: limit,
  };
  const [items, total] = await Record.search(q, options);
  return { items, offset, limit, total };
};
