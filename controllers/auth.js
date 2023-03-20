const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { generateJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const validPassword = bcryptjs.compareSync(password, user.password);

    if (!user)
      return res
        .status(400)
        .json({ msg: "Authentication error: Emal not found." });

    if (!user.state)
      return res
        .status(400)
        .json({ msg: "Authentication error: Inactive user." });

    if (!validPassword)
      return res
        .status(400)
        .json({ msg: "Authentication error: Invalid password." });

    const token = await generateJWT(user.id);

    res.json({ msg: user, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Something went wrong. Contact an administrator for more.",
    });
  }
};

module.exports = {
  login,
};
