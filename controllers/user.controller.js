const { userService } = require("../services");
const httpStatus = require("http-status");
const AppError = require("../utils/AppError");

/**
 * A middleware that gets the profile of the user
 *
 * @function
 * @author Koodeyo
 * @summary Get The User Profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws AppError 500 Internal Server AppError if not authenticated
 */

exports.getProfile = async (req, res, next) => {
  if (!req.user) {
    return next(
      new AppError(
        "Please Authenticate first",
        httpStatus.INTERNAL_SERVER_AppError
      )
    );
  }
  res.status(httpStatus.OK).send(req.user);
};

/**
 * A middleware that gets a user's profile
 *
 * @function
 * @author Koodeyo
 * @summary Get a User's Profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws AppError 404 Not found if req.params.userId was invalid
 */
exports.getUser = async (req, res, next) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    return next(new AppError("User not found", httpStatus.NOT_FOUND));
  }
  res.status(httpStatus.OK).send(user);
};

/**
 * A middleware that edits the user's profile
 *
 * @function
 * @author Koodeyo
 * @summary Edit the user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @throws AppError 404 Not found if req.params.userId was invalid
 * @throws AppError 400 if req.body.passwordConfirm doesn't match the user's password
 */
exports.editProfile = async (req, res, next) => {
  const user = await userService.findUserByIdAndCheckPassword(
    req.user._id,
    req.body.passwordConfirm
  );
  if (!user) {
    return next(
      new AppError(
        "The password you entered doesn't match your password. Please try again.",
        httpStatus.BAD_REQUEST
      )
    );
  }
  const profile = await userService.editProfile(req.user, req.body);
  res.status(httpStatus.OK).send(profile);
};
