const express = require('express')
const http = require('http')
const app = express()
//creating http server with express app
const server = http.createServer(app)
//configuring .env file 
require('dotenv').config();

const port = process.env.port || 8000;

//creating routes
const routes = require('./routes/route')


app.use(express.urlencoded({ extended: false }))

app.use(express.json());

app.use('/translate', routes)

//listening on port 8000

server.listen(port, () => {
    console.log(`Listening server on port : ${port}`);
})