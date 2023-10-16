const Joi = require("@hapi/joi");

exports.transfer = {
  body: Joi.object().keys({
    amount: Joi.string().required(),
  }),
};
