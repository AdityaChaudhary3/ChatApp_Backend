import {Router} from 'express';
import { 
    registerUser,
    allUsers,
    loginUser,
    logoutUser
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
// import { protect } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/").get(verifyJWT, allUsers);
// router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.route("/login").post(loginUser);
// router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser)

export default router;