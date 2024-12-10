const jwt = require('jsonwebtoken');


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


function generateAccessToken(user){
    return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '15s' })
}

function generateRefreshToken(user){
    return jwt.sign(_user, process.env.REF_TOKEN_SECRET)
}
