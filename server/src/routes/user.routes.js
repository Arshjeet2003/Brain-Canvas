import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { refreshAccessToken } from "../controllers/user.controller.js";

const router = Router();

// register : http://localhost:5000/api/v1/users/register
router.route("/register").post(
  upload.fields([
    {
      name: "username",
    },
  ]),
  registerUser
);

// login : http://localhost:5000/api/v1/users/login
router.route("/login").post(
  upload.fields([
    {
      name: "username",
    },
  ]),
  loginUser
);

// secured route
router.route("/logout").post(verifyJWT, logoutUser);

router.route("refreshtoken").post(refreshAccessToken);

export default router;
