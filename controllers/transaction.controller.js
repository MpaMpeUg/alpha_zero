const { transactionService, userService } = require("../services");
const xtend = require("xtend");
const uuid = require("uuid");

exports.initializeTransfer = async function (req, res, next) {
  let data = xtend(req.body, {
    user: req.session.user.id,
    transactionId: uuid.v4(),
  });

  let user = await userService.getUserById(req.session.user.id);
  let balance = await user.accountBalance;

  if (data.amount > balance) {
    return next(new Error("INSUFFICIENT BALANCE"));
  }

  let transfer = await transactionService.initializeTransfer(data);
  req.session.transfer = xtend(data, transfer);
  res.json(req.session.transfer);
};

exports.confirmTransfer = async function (req, res, next) {
  if (!req.session.transfer) {
    return next(new Error("Transaction Expired!"));
  }

  let transfer = await transactionService.confirmTransfer(req.session.transfer);
  req.session.transfer = undefined;
  res.json(transfer);
};
