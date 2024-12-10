const express = require('express')
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.json())

app.get("/", (req, res) => {
    res.json({"hello": "world"});
});

app.post("/login", (req, res) => {
    const username = req.body.username
    const _user = { name: username }
    res.json({"user": _user});
});

module.exports = app;