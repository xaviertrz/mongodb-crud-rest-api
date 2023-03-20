const { Router } = require("express");
const { check } = require("express-validator");

const {
  usersGet,
  usersPut,
  usersPost,
  usersPatch,
  usersDelete,
} = require("../controllers/users");

const {
  isRoleValid,
  emailExists,
  isIdValid,
} = require("../helpers/db-validators");

const { validateFields, validateJWT, validateRole } = require("../middlewares");

const router = Router();

router.get("/", usersGet);

router.put(
  "/:id",
  [
    check("id", "Invalid ID").isMongoId(),
    check("id").custom(isIdValid),
    validateFields,
  ],
  usersPut
);

router.post(
  "/",
  [
    check("email", "Invalid email").isEmail(),
    check("email").custom(emailExists),
    check("name", "Name is required").not().isEmpty(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("role").custom(isRoleValid),
    validateFields,
  ],
  usersPost
);

router.patch("/", usersPatch);

router.delete(
  "/:id",
  [
    validateJWT,
    validateRole("USER_ROLE", "ADMIN_ROLE"),
    check("id", "Invalid ID").isMongoId(),
    /* check("id").custom(isIdValid), */
    validateFields,
  ],
  usersDelete
);

module.exports = router;
