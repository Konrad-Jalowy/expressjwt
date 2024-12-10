const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const Post = require('./models/postModel');
const catchAsync = require("./catchAsync");
const MainController = require("./mainController");
require('dotenv').config();

app.use(express.json())

app.get("/", (req, res) => {
    res.json({"hello": "world"});
});

app.get("/tokenprotected", MainController.authToken, (req, res) => {
    return res.json({"msg": "you sent correct token!"});
})

app.get("/all", catchAsync(async (req, res,next) => {
    let _posts = await Post.find({});
    return res.json({"posts": _posts});
}));

app.get('/user-all', MainController.authToken, catchAsync(async (req, res, next) => {
    let _username = req.user.name;
    let _posts =   await Post.find({"author": _username});
    return res.json({"your_usenmare": _username, "your_posts": _posts});
  }));

app.post("/login", MainController.login);

app.post('/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REF_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ name: user.name })
      res.json({ accessToken: accessToken })
    });
  });

app.delete('/logout', MainController.delete);
app.use(MainController.errHandler);
app.get("*", MainController.notFound);

function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '15s' })
}

function generateRefreshToken(user){
    return jwt.sign(_user, process.env.REF_TOKEN_SECRET)
}


module.exports = app;