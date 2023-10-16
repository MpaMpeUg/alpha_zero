const Joi = require("@hapi/joi");
const httpStatus = require("http-status");
const { pick } = require("lodash");
const xtend = require("xtend");
const AppError = require("../utils/AppError");

const validate = (schema) => (req, res, next) => {
  if (!req.query.skipValidation) {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
      .prefs({
        errors: {
          label: "key",
        },
      })
      .validate(object);

    if (error) {
      const errorMessage = error.details
        .map((details) => details.message)
        .join(", ");
      return next(new AppError(errorMessage, httpStatus.BAD_REQUEST));
    }

    Object.assign(req, value);
  }

  req.query = xtend(req.query, { skipValidation: undefined });
  return next();
};

module.exports = validate;
