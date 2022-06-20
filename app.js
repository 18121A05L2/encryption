//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const port = 3000;
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");
const userSchema = new mongoose.Schema({
  email : String,
  password:String
});
const secret = process.env.SECRET;
userSchema.plugin(encrypt,{secret:secret , encryptedFields : ["password"]});



const User = new mongoose.model("user",userSchema)

app.get("/",function(req,res){
  res.render("home")
})

app.get("/login",function(req,res){
  res.render("login")
})

app.get("/register",function(req,res){
  res.render("register")
})

app.post("/register",function(req,res){
  const user = new User({
    email : req.body.username,
    password : req.body.password
  });
  user.save(function(err){
    if(err){
      res.send(err)
    } else {
      console.log("new user data added")
      res.render("secrets");}
  });
});

app.post("/login",function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({email:username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if (password == foundUser.password){
          res.render("secrets");
          console.log("login successful");
        }else{console.log("password incorrect")}
      }else{console.log("not found ")}
    }
  })
})


app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
