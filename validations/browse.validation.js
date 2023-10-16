const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

exports.getCategories = {
  query: Joi.object().keys({
    offset: Joi.number().default(0),
    limit: Joi.number().min(1).default(20),
  }),
};

exports.getCategory = {
  params: Joi.object().keys({
    id: Joi.objectId(),
    category: Joi.string(),
  }),
};
