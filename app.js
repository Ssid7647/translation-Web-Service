const express = require('express')
const http = require('http')
const app = express()
//creating http server with express app
const server = http.createServer(app)
//configuring .env file 
require('dotenv').config();

const port = process.env.PORT || 8000;

//creating routes
const routes = require('./routes/route')


const aws= require('aws-sdk')


app.use(express.urlencoded({ extended: false }))

app.use(express.json());

app.use( routes)
/*app.get('/',(req,res)=>
{
    res.status(200).send("ok");
})*/

//listening on port 8000

server.listen(port, () => {
    console.log(`Listening server on port : ${port}`);
})