import express from "express"
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import cookieParser from 'cookie-parser'

dotenv.config({
    path: './.env'
})

const app = express()

// app.get('/api', (req, res)=>{
//     const response = {hi: "here is app"}
//     // console.log("hii, server works properly")
//     res.send(response)
// })

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`server is running at port: ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!", err);
})


app.use(express.json({limit: "16kb"}))
app.use(cookieParser())

import userRouter from './routes/user.route.js';
import chatRouter from './routes/chat.route.js';
import messageRouter from './routes/message.route.js'

app.use("/api/user", userRouter)
app.use("/api/chat", chatRouter)
app.use("/api/message", messageRouter)
