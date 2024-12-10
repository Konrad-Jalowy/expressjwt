const jwt = require('jsonwebtoken');
const catchAsync = require("./catchAsync");
const Post = require("./models/postModel");
require('dotenv').config();

let refreshTokens = [];

exports.notFound = function(req, res){
    res.status(404).json({"Error": "Endpoint doesnt exist"});
  };

exports.errHandler = (err, req, res, next) => {
    res.status(500).json({"Error": "Some kind of error occurred.", "err": err.message});
}


exports.authToken = catchAsync(async function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try {
        const _user = await verifyToken(token, process.env.SECRET_KEY);
        req.user = _user;         
        next();
    } catch {
        return res.sendStatus(403);
    }
  });

exports.delete = (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
  }

exports.login = (req, res) => {
    const username = req.body.username;
    const _user = { name: username };
    const accessToken = generateAccessToken(_user);
    const refreshToken = generateRefreshToken(_user);
    refreshTokens.push(refreshToken);
    console.log(refreshTokens)
    res.json({"user": _user, "accessToken": accessToken, "refreshToken": refreshToken})
}

exports.all = catchAsync(async (req, res,next) => {
    let _posts = await Post.find({});
    return res.json({"posts": _posts});
});

exports.userAll = catchAsync(async (req, res, next) => {
    let _username = req.user.name;
    let _posts =   await Post.find({"author": _username});
    return res.json({"your_usenmare": _username, "your_posts": _posts});
  });


exports.token = async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken === null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    try {
        let _user = await verifyToken(refreshToken, process.env.REF_TOKEN_SECRET);
        const accessToken = generateAccessToken(_user);
        return res.json({ accessToken: accessToken })
    } catch {
        return res.sendStatus(403);
    }
  };


function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '55s' });
}

function generateRefreshToken(user){
    return jwt.sign(user, process.env.REF_TOKEN_SECRET);
}
async function verifyToken(token,key){
    if(!token) return {};
    return new Promise((resolve,reject) =>
       jwt.verify(token,key,(err,user) => err ? reject({}) : resolve(user))
    );
 }
 