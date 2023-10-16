const { searchService } = require("../services");

exports.search = async (req, res, next) => {
  // calls a function that makes the search process and
  // returns the items which their names matche the typed string
  const items = await searchService.search(req.query);
  res.status(200).json(items);
};
