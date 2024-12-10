const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const MainController = require("./mainController");

require('dotenv').config();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({"hello": "world"});
});

app.get("/tokenprotected", authenticateToken, (req, res) => {
    return res.json({"msg": "you sent correct token!"});
})

app.get("/all", MainController.all);

app.get('/user-all', authenticateToken, MainController.userAll);

app.post("/login", MainController.login);

app.post('/token', MainController.token);

app.delete('/logout', MainController.delete);

app.use(MainController.errHandler);

app.get("*", MainController.notFound);

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log(req.headers['authorization']);
    const token = authHeader && authHeader.split(' ')[1];
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log(err)
            return res.sendStatus(403)}
            console.log("hi 123")
        req.user = user;
        next();
      });
    
  }

module.exports = app;