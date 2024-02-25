import express, { response } from "express"

const app = express()

const port = process.env.PORT || 3000;

app.get('/api', (req, res)=>{
    const response = {hi: "here is app"}
    // console.log("hii, server works properly")
    res.send(response)
})

app.listen(port, ()=>{
    console.log(`Server at http://localhost:${port}`);
})