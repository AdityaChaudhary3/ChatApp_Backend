import express from "express"
import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})

const app = express()

const port = process.env.PORT || 5000;

app.get('/api', (req, res)=>{
    const response = {hi: "here is app"}
    // console.log("hii, server works properly")
    res.send(response)
})

app.listen(port, ()=>{
    console.log(`Server at http://localhost:${port}`);
})