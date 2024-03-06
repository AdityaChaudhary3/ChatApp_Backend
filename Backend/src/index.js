import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import cookieParser from 'cookie-parser'

dotenv.config({
    path: './.env'
})

connectDB();

const app = express()

// app.get('/api', (req, res)=>{
//     const response = {hi: "here is app"}
//     // console.log("hii, server works properly")
//     res.send(response)
// })

// connectDB()
// .then(() => {
//     app.listen(process.env.PORT || 5000 , () => {
//         console.log(`server is running at port: ${process.env.PORT}`);
//     })
// })
// .catch((err) => {
//     console.log("MONGO db connection failed !!", err);
// })


app.use(express.json({limit: "16kb"}))
app.use(cookieParser())

import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js'

app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/message", messageRouter)

const PORT = process.env.PORT;

import { Server } from "socket.io";

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
      origin: "http://localhost:3000",
    //   credentials: true,
    },
  });
  
  io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });
      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    
      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
    
      socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
});