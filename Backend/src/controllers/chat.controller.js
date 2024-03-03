import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from "../models/user.model.js"
import {Chat} from "../models/chat.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not sent with request");
        throw new ApiError(400, "UsedId not found.")
    }
  
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
          { users: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");
  
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });
  
    if (isChat.length > 0) {
        return res
        .status(200)
        .json(new ApiResponse(200, isChat[0], "Chat fetched."))
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
        };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res
        .status(200)
        .json(new ApiResponse(200, FullChat, "New chat created"))
      } catch (error) {
            throw new ApiError(400, "Some problem in creating a new chat.");
        }
    }
})

const fetchChats = asyncHandler( async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res
            .status(200)
            .json(new ApiResponse(200, results, "result fetched."))
        });
      } catch (error) {
            throw new ApiError(400, "Error while fetching the all chats of user.");
      }
})

const createGroupChat = asyncHandler( async (req, res ) => {
    if (!req.body.users || !req.body.name) {
        throw new ApiError(400, "All fields are required.")
    }
    
    let users = JSON.parse(req.body.users);
    
    if (users.length < 2) {
        throw new ApiError(400, "More than 2 users are required to form a group chat")
    }
    
    users.push(req.user);
    
    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
    
        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
    
        res
        .status(200)
        .json(new ApiResponse(200, fullGroupChat, "Group chat created."));
    } catch (error) {
        throw new ApiError(400, "Error while creating the group chat.")
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
  
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,
      }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
        throw new ApiError(404,"Chat Not Found");
    } else {
      return res
      .status(200)
      .json(new ApiResponse(200, updatedChat, "Group Chat renamed."))
    }
  });

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    const chat = await Chat.findById(chatId)

    if(chat.groupAdmin.toString() !== req?.user._id.toString()){
        throw new ApiError(400, "you are not group admin. so you can't done this action.")
    }
  
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
    if (!removed) {
        throw new ApiError(404,"Chat Not Found");
    } else {
        return res
        .status(200)
        .json(new ApiResponse(200, removed, "user removed successfully"))
    }
  });
  
const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    const chat = await Chat.findById(chatId)
    console.log(chat)

    if(chat.groupAdmin.toString() !== req?.user._id.toString()){
        throw new ApiError(400, "you are not group admin. so you can't done this action.")
    }
  
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
        throw new ApiError(404,"Chat Not Found");
    } else {
        return res
        .status(200)
        .json(new ApiResponse(200, added, "user addesd successfully."))
    }
  });

export {
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
}