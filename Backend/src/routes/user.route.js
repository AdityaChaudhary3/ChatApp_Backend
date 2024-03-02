import {Router} from 'express';
import { 
    registerUser,
    allUsers,
    loginUser,
    logoutUser
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

router.route("/").get(verifyJWT, allUsers);
router.route("/").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post( verifyJWT, logoutUser)

export default router;