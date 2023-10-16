const Configstore = require("configstore");
const config = new Configstore("appStore");
const extend = require("xtend");

function Store() {
  this.admin = "admins";
}

Store.prototype.updateAdmin = function (username, data = {}) {
  let admin = this.getAdmin(username);
  config.set(`${this.admin}.${data.username}`, extend(admin, data));
};

Store.prototype.resetAdmin = function (username) {
  config.delete(`${this.admin}.${username}`);
};

Store.prototype.getAdmin = function (username) {
  return config.get(`${this.admin}.${username}`);
};

Store.prototype.getAdmins = function () {
  return this.getAll(this.admin);
};

Store.prototype.getAll = function (prefix) {
  let values = config.get(prefix);
  let output = [];
  if (values) {
    Object.keys(values).forEach((key) => {
      output.push(values[key]);
    });
  }
  return output;
};

module.exports = Store;
