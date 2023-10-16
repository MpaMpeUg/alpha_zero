const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

/**
 * Schema that checks that the request is valid for search endpoint
 *
 * @property {object} query An object containing the URL query parameters
 * @property {string} query.q the typed string by the user to match item's name in database
 * @property {string} query.type the type of  item the user want to search in
 * @property {number} query.limit Maximum number of elements in the response
 * @property {number} query.offset index of the first element to return
 */

exports.search = {
  query: Joi.object().keys({
    q: Joi.any() //the string to serch with should be string
      .required(), //its required
    type: Joi.string() // type of item should be string and its optional
      .valid("candidate", "staff"), 
    offset: Joi.number().default(0), //offset should be a number but it is optional so if not sent its default value is zero
    limit: Joi.number() //limit should be a number  (optional)
      .min(1) // if sent its minimum should be 1
      .max(50) // if sent its maximum should be 50
      .default(20), //it is optional so if not sent its default value is zero
    "X-Access-Token": Joi.string(),
  }),
};
