import {Router} from 'express';
import { 
    registerUser,
    allUsers,
    loginUser
} from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
// import { protect } from '../middlewares/auth.middleware.js'

const router = Router()

router.route("/").get(verifyJWT, allUsers);
// router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", loginUser);

export default router;