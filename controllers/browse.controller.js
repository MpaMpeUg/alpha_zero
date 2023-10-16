const { browseService } = require("../services");
const AppError = require("../utils/AppError");
const httpStatus = require("http-status");

exports.getCategories = async (req, res, next) => {
  const categories = await browseService.findCategories(
    req.params.category,
    req.query
  );

  res.status(200).json({
    items: categories.data,
    offset: req.query.offset,
    limit: req.query.limit,
    total: categories.total,
  });
};

exports.getCategory = async (req, res, next) => {
  const category = await browseService.findCategory(req.params);
  if (!category)
    return next(
      new AppError(
        "The category with the given ID was not found.",
        httpStatus.NOT_FOUND
      )
    );
  res.status(200).json(category);
};
