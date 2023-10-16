const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const constants = require("../constants");
const crypto = require("crypto");

/**
 * Generate Authentication token
 *
 * @function
 * @public
 * @async
 * @author Koodeyo
 * @summary Generate Authentication token
 * @param {String} userId User ID
 * @returns {String} `token` authentication token
 */
const generateAuthToken = (user) => {
  return jwt.sign(user, constants.SECRET_KEY, {
    // expiresIn: "30 days",
  });
};

/**
 * Check if password is correct
 *
 * @function
 * @public
 * @async
 * @author Koodeyo
 * @param {String} password
 * @param {String} hashedPassword
 * @summary Check if password is correct
 * @returns {Boolean} `isPasswordMatch` is `true` the password is correct
 */
const checkPassword = async (password, hashedPassword) => {
  const isPasswordMatch = await bcrypt.compare(password, hashedPassword);
  return isPasswordMatch;
};

/**
 * Create password reset token
 *
 * @function
 * @public
 * @author Koodeyo
 * @param {Document} user User
 * @summary Create password reset token
 * @returns {String} `resetToken`
 */
const createPasswordResetToken = (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const passwordResetToken = getHashedToken(resetToken);

  const passwordResetExpires = Date.now() + 10 * 60 * 1000;

  user.passwordResetExpires = passwordResetExpires;
  user.passwordResetToken = passwordResetToken;

  return resetToken;
};

/**
 * Create verify token
 *
 * @function
 * @public
 * @author Koodeyo
 * @param {Document} user User
 * @summary Create verify token
 * @returns {String} `verifyToken`
 */
const createVerifyToken = (user) => {
  const verifyToken = crypto.randomBytes(32).toString("hex");

  const HashedVerifyToken = getHashedToken(verifyToken);

  user.verifyToken = HashedVerifyToken;

  return verifyToken;
};

/**
 * Hash token
 *
 * @function
 * @public
 * @author Koodeyo
 * @param {String} token Token to be hashed
 * @summary Hash token
 * @returns {String} `hashedToken`
 */
const getHashedToken = (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
};

module.exports = {
  generateAuthToken,
  checkPassword,
  createPasswordResetToken,
  getHashedToken,
  createVerifyToken,
};
