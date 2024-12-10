const fs = require('fs').promises;
const mongoose = require('mongoose');

require('dotenv').config();

const Post = require("./postModel");
const fname = process.argv[2] ?? "posts1.json";

const importData = async (users) => {
    try {
      await Post.create(users);
      console.log(`Data successfully created from json file ${fname}!`);
    } catch (err) {
      console.log(err);
    }
    process.exit();
  };
 
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const data = await fs.readFile(`${__dirname}/${fname}`, 'utf-8');
        const posts = JSON.parse(data);
        importData(posts);
    } catch (err) {
      console.log('error: ' + err)
    }
  })()
