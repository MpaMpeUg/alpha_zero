const { promisify } = require("util");
const constants = require("../constants");
const { User } = require("../models");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const httpStatus = require("http-status");

exports.authenticateAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(new AppError("NO PERMISSIONS", httpStatus.FORBIDDEN));
  }
  next();
};

/**
 * Authentication middleware
 *
 * @version 1.0.0
 * @throws AppError 401 if no/wrong token passed
 * @author Koodeyo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @description takes user token to authenticate user
 * @summary User Authentication
 */
exports.authenticate = async (req, res, next) => {
  //catch users sessions
  if (req.session.user) {
    req.user = req.session.user;
    return next();
  }

  // getting token and check if it is there
  let token = req.header("X-Access-Token") || req.query["X-Access-Token"];

  if (!token) {
    return next(new AppError("Please log in.", httpStatus.UNAUTHORIZED));
  }

  // verification token
  let payload;
  try {
    payload = await promisify(jwt.verify)(token, constants.SECRET_KEY);
  } catch (er) {
    return next(
      new AppError(
        "Session expired! Please log out, then log in again!",
        httpStatus.UNAUTHORIZED
      )
    );
  }

  if (!payload.isAdmin) {
    // check if user still exists
    const user = await User.findById(payload.id);

    if (!user) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          httpStatus.UNAUTHORIZED
        )
      );
    }

    // check if user changed password
    if (user.changedPasswordAfter(payload.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          httpStatus.UNAUTHORIZED
        )
      );
    }

    req.user = user;
  } else {
    req.user = payload;
  }

  next();
};

/**
 * @version 1.0.0
 * @throws AppError 403 if user doesn`t have permission
 * @author Koodeyo
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {String} roles authorized roles
 * @description give permission to users based on roles
 * @summary User Authorization
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          httpStatus.FORBIDDEN
        )
      );
    }
    next();
  };
};
