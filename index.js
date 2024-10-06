const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const app = express();
const cookieparser = require('cookie-parser');
const router = require('./router/router')
const {getconnectmongodb} = require('./connection/connection')
const port = 3000;
getconnectmongodb('mongodb://localhost:27017/taskmanager').then(()=>{console.log("mongodb connected successfully")}).catch((err)=>{console.log(err)});


app.use(express.static('public')); // Serve static files
app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(cookieparser());
app.use(express.urlencoded({extended:false}));
app.use(router);

app.listen(port, ()=>{
    console.log("server is listening on port " + port);
})