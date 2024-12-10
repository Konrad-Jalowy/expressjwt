const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const MainController = require("./mainController");

require('dotenv').config();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({"hello": "world"});
});

app.get("/tokenprotected", MainController.authToken, (req, res) => {
    return res.json({"msg": "you sent correct token!"});
})

app.get("/all", MainController.all);

app.get('/user-all', MainController.authToken, MainController.userAll);

app.post("/login", MainController.login);

app.post('/token', MainController.token);

app.delete('/logout', MainController.delete);

app.use(MainController.errHandler);

app.get("*", MainController.notFound);

module.exports = app;