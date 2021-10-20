// dotenv is require for using environment variables from an .env file
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import md5 from "md5";

dotenv.config()
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended: true}));  //Parse URL-encoded bodies

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home")
});

app.get("/login", (req, res) => {
  res.render("login")
});

app.get("/register", (req, res) => {
  res.render("register")
});

app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  newUser.save((err) => {
    (err) ? console.error(err) : res.render("secrets");
  });
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);
  let foundUser = {};

  try {
    foundUser = await User.findOne({email: username})
  } catch (err) {
    console.error(err);
  }

  if (foundUser) {
    if (foundUser.password === password) {
      res.render("secrets");
    }
  }

});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
