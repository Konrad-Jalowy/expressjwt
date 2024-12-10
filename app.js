const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const Post = require('./models/postModel');
const catchAsync = require("./catchAsync");
require('dotenv').config();

app.use(express.json())

app.get("/", (req, res) => {
    res.json({"hello": "world"});
});

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