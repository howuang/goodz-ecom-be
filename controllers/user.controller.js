const sendResponse = require("../helpers/sendResponse");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const userController = {};
const SALT_ROUND = 10;
userController.getAll = async (req, res) => {
  const result = await User.find();
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully get all users"
  );
};
userController.createByEmailPassword = async (req, res, next) => {
  const { name, email } = req.body;
  let { password } = req.body;
  let result;
  try {
    if (!name || !email || !password) throw new Error("missing input");
    const found = await User.findOne({ email });
    if (found) throw new Error("email already reg");
    //encrypting password
    const salt = await bcrypt.genSalt(SALT_ROUND);
    password = await bcrypt.hash(password, salt);
    result = await User.create({ name, email, password });
  } catch (error) {
    return sendResponse(res, 420, false, result, true, error.message);
  }
  return sendResponse(
    res,
    200,
    true,
    result,
    false,
    "Successfully create user"
  );
};

userController.loginWithEmailPassword = async (req, res, next) => {
  const { email, password } = req.body;
  let result;
  try {
    if (!email || !password) throw new Error("Please input email and pass");
    const user = await User.findOne({ email });
    if (!user) throw new Error("User with the email is not found");
    let isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);
    if (isMatch) {
      result = user;
    } else {
      throw new Error("Password not match");
    }
  } catch (error) {
    return sendResponse(res, 420, false, result, true, error.message);
  }
  return sendResponse(res, 200, true, result, false, "Successfully login user");
};

userController.updateById = (req, res) => {
  res.send("find by id and update");
};
userController.deleteById = (req, res) => {
  res.send("delete by id and update");
};
/** TODO:
 * delete user
 * update user
 * get single user
 * More Security for password !!!
 *
 */

module.exports = userController;
