const bcrypt = require("bcrypt");

module.exports = {
  async checkPassword(password, hashedPassword) {
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
    return isPasswordMatch;
  },

  cleanObject(obj) {
    let newObj = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key] === Object(obj[key])) {
        newObj[key] = obj[key];
      } else if (obj[key] !== undefined) newObj[key] = obj[key];
    });
    return newObj;
  },
};
