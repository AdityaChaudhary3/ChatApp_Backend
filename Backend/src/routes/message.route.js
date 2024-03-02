import { Router } from "express";
import{
    allMessages,
    sendMessage
} from "../controllers/message.controller.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router()

router.route("/:chatId").get(verifyJWT, allMessages);
router.route("/").post(verifyJWT, sendMessage);

export default router;