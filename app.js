// dotenv is require for using environment variables from an .env file
import dotenv from "dotenv";
import express from "express";
import ejs from "ejs";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const saltRounds = 10;

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

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
  
    newUser.save((err) => {
      (err) ? console.error(err) : res.render("secrets");
    });
  });

});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password; 

  User.findOne({email: username}, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        // Load hash from your password DB.
        bcrypt.compare(password, foundUser.password, (err, result) => {
          if (!err && result) {
            res.render("secrets");
          } else {
            console.log(err);
          } 
        });
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
