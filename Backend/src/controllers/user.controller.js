import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import {User} from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
};


const registerUser = asyncHandler(async (req,res) => {

    console.log("in registed user.")
    const {name, email, password} = req.body
    
    if (!name || !email || !password) {
        res.status(400);
        throw new ApiError(400,"Please Enter all the Feilds");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new ApiError(409,"User already exists");
    }


    const user = await User.create({
        name,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully.")
    )
})


const loginUser = asyncHandler(async (req, res) => {

    const {email, password} = req.body

    const user = await User.findOne({ email });

    const options = {
        httpOnly: true,
        secure: true
    }

    const accessToken = await generateToken(user._id)

    if (user && (await user.matchPassword(password))) {
        res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200,
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
            },
            "User loggedIn suceessfully."
            ));
      } else {
        throw new ApiError(401,"Invalid Email or Password");
    }

})


const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    // res.send(users);
    return res
    .status(200)
    .json(new ApiResponse(200, users, "user fetched."))
})


export {
    registerUser,
    loginUser,
    allUsers
}