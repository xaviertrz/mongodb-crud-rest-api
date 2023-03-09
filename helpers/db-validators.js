const Role = require("../models/role");
const User = require("../models/user");

const isRoleValid = async (role) => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`The role ${role} does not exist`);
  }
};

const emailExists = async (email) => {
  const findedEmail = await User.findOne({ email });
  if (findedEmail) {
    throw new Error(`The email ${email} already exists`);
  }
};

const isIdValid = async (id) => {
  console.log(id)
  const findedUserById = await User.findOne({ id });
  console.log(findedUserById)
  if (!findedUserById) {
    throw new Error(`The id ${id} doesn't exists.`);
  }
};

module.exports = {
  isRoleValid,
  emailExists,
  isIdValid,
};
