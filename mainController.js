const jwt = require('jsonwebtoken');
const catchAsync = require("./catchAsync");
let refreshTokens = [];

exports.notFound = function(req, res){
    res.status(404).json({"Error": "Endpoint doesnt exist"});
  };

exports.errHandler = (err, req, res, next) => {
    res.status(500).json({"Error": "Some kind of error occurred."});
}

exports.authToken = function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    console.log(req.headers['authorization']);
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user;
        next()
      });
    
  }

exports.delete = (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204);
  }

exports.login = (req, res) => {
    const username = req.body.username;
    const _user = { name: username };
    const accessToken = generateAccessToken(_user);
    const refreshToken = jwt.sign(_user, process.env.REF_TOKEN_SECRET)
    refreshTokens.push(refreshToken)
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

exports.token = (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken == null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REF_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ name: user.name })
      res.json({ accessToken: accessToken })
    });
  };


function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '15s' })
}

function generateRefreshToken(user){
    return jwt.sign(_user, process.env.REF_TOKEN_SECRET)
}
