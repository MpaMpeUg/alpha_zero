const Joi = require("@hapi/joi");

exports.login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

exports.updatePassword = {
  body: Joi.object().keys({
    currentPassword: Joi.string().required(),
    password: Joi.string().required().min(5),
    passwordConfirm: Joi.string().required(),
  }),
};

exports.resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().min(5),
    passwordConfirm: Joi.string().required(),
  }),
  params: Joi.object().keys({
    token: Joi.string().required().min(8),
  }),
};
