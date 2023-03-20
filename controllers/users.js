const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

const usersGet = async (req = request, res = response) => {
  const { limit = 5, since = 0 } = req.query;
  const query = { state: true };

  const resp = await Promise.all([
    User.countDocuments(query),
    User.find(query).limit(Number(limit)).skip(Number(since)),
  ]);

  const [total, users] = resp;

  res.json({ total, users });
};

const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...rest } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest);

  res.json({
    msg: "put API - controller",
    user,
  });
};

const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);
  await user.save();

  res.json({
    user,
  });
};

const usersPatch = (req = request, res = response) => {
  res.json({
    msg: "patch API - controller",
  });
};

const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;
  const uid = req.uid;
  const authUser = req.authUser;
  console.log(authUser)

  if (!authUser) {
    return res.status(401).json({
      msg: "Error - User not found",
    });
  }

  if (!authUser.state) {
    return res.status(401).json({
      msg: "Error - Disabled user",
    });
  }

  /* For physical delete
  const deletedUser = await User.findByIdAndDelete(id) */

  const deletedUser = await User.findByIdAndUpdate(id, {
    state: false,
  });

  res.json({
    deletedUser,
    authUser,
    uid,
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersPatch,
  usersDelete,
};
