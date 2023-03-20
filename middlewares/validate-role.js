const validateRole = (...roles) => {
  return (req, res, next) => {
    if (!req.authUser) {
      return res.status(500).json({
        msg: "Error - A token is needed",
      });
    }

    const { role } = req.authUser;

    if (!roles.includes(role)) {
      return res.status(401).json({
        msg: `Error - Action needs specific role.`,
      });
    }
    next();
  };
};

module.exports = {
  validateRole,
};
