const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const Post = require('./models/postModel');
const catchAsync = require("./catchAsync");
require('dotenv').config();

let refreshTokens = [];

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(req.headers['authorization']);
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
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

app.get('/user-all', authenticateToken, catchAsync(async (req, res, next) => {
    let _username = req.user.name;
    let _posts =   await Post.find({"author": _username});
    return res.json({"your_usenmare": _username, "your_posts": _posts});
  }));

app.post("/login", (req, res) => {
    const username = req.body.username;
    const _user = { name: username };
    const accessToken = jwt.sign(_user, process.env.SECRET_KEY);
    res.json({"user": _user, "accessToken": accessToken});
});
app.use((err, req, res, next) => {
    res.status(500).json({"Error": "Some kind of error occurred."});
});

app.get("*", function(req, res){
    res.status(404).json({"Error": "Endpoint doesnt exist"});
  });

function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '15s' })
}


module.exports = app;