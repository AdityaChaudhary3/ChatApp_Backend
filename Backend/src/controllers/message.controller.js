import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from "../models/user.model.js"
import {Chat} from "../models/chat.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {Message} from "../models/message.model.js"

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
          .populate("sender", "name pic email")
          .populate("chat");
        return res
        .status(200)
        .json(new ApiResponse(200, messages, "All message fetched."))
    } catch (error) {
        throw new ApiError(404, "message not found.")
    }
});

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
        throw new ApiError(400, "All field required.")
    }
  
    const newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };
  
    try {

        let message = await Message.create(newMessage);
  
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });
  
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
        return res
        .status(200)
        .json(new ApiResponse(200, message, "message created."))
    } catch (error) {
        throw new ApiError(400, "Error while creating the message.")
    }
  });

export {
    allMessages,
    sendMessage
}