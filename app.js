const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const Post = require('./models/postModel');
const catchAsync = require("./catchAsync");
require('dotenv').config();


function authenticateToken(req, res, next) {
    console.log("hi")
    const authHeader = req.headers['authorization']
    console.log(req.headers['authorization']);
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user;
        next()
      });
    
  }


app.use(express.json())

app.get("/", (req, res) => {
    res.json({"hello": "world"});
});

app.get("/tokenprotected", authenticateToken, (req, res) => {
    return res.json({"msg": "you sent correct token!"});
})

app.get("/all", catchAsync(async (req, res,next) => {
    let _posts = await Post.find({});
    return res.json({"posts": _posts});
}));

app.post("/login", (req, res) => {
    const username = req.body.username
    const _user = { name: username }
    const accessToken = jwt.sign(_user, process.env.SECRET_KEY);
    res.json({"user": _user, "accessToken": accessToken});
});



module.exports = app;