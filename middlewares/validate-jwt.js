const { request, response } = require("express");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const validateJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No token given",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_OR_PRIVATE_KEY);
    const authUser = await User.findById(uid);

    req.uid = uid;
    req.authUser = authUser;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

module.exports = { validateJWT };
