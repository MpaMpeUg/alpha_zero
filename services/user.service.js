const { User } = require("../models");
const authService = require("./auth.service");

/**
 * A method that find user with the given userData and check password with the given password
 *
 * @function
 * @public
 * @async
 * @author Koodeyo
 * @summary find user and check password
 * @param {Object} userData - User data to find with
 * @param {String} password - User password
 * @returns {Document} `user` if user found and password is correct
 * @returns {null} `null` if user not found or password is wrong
 */
const findUserAndCheckPassword = async (userData, password) => {
  const user = await User.findOne(userData).select("+password");
  if (!user || !(await authService.checkPassword(password, user.password))) {
    return null;
  }
  return user;
};

/**
 * Find user by `userId` and check if `password` is correct
 *
 * @function
 * @public
 * @async
 * @author Koodeyo
 * @param {String} userId - User ID
 * @param {String} password - User password
 * @summary Find user by `userId` and check if `password` is correct
 * @returns {Document} `user` if user found and password is correct
 * @returns {null} `null` if user is not found or password is not correct
 */
const findUserByIdAndCheckPassword = async (userId, password) => {
  const user = await User.findById(userId).select("+password");
  if (!user || !(await authService.checkPassword(password, user.password))) {
    return null;
  }
  return user;
};

/**
 * A method that create user with the given data
 *
 * @function
 * @public
 * @async
 * @author Koodeyo
 * @summary Create new user
 * @param {Object} userData - User data to find with
 * @returns {Document} `newUser` if user is created
 * @returns {null} `null` if failed
 */
const createUser = async (userData) => {
  if (userData.id) {
    return await User.updateOne({ _id: userData.id }, userData);
  } else {
    return await User.create(userData);
  }
};

/**
 * A method that gets the User By its ID
 *
 * @function
 * @author Koodeyo
 * @summary Get a User By ID
 * @param {Object} userId - The Id of the user
 * @returns {null} if user was not found
 * @returns {Document} if a user was found
 */

const getUserById = async (userId) => {
  const user = await User.findById(userId, {
    username: 0,
    password: 0,
  });
  return user;
};

/**
 * Get user with `userData`
 *
 * @function
 * @public
 * @async
 * @author Koodeyo
 * @param {Object} userData - User data to find with
 * @summary Get user with `userData`
 * @returns {Document} `user` with the given `userData`
 */
const getUser = async (userData) => {
  const user = await User.findOne(userData);
  return user;
};

const deleteUser = async (userId) => {
  const user = await User.findByIdAndRemove(userId);
  return user;
};

module.exports = {
  deleteUser,
  findUserAndCheckPassword,
  findUserByIdAndCheckPassword,
  createUser,
  getUserById,
  getUser,
};
