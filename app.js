//jshint esversion:6
require('dotenv').config();
const express=require('express');
const bodyParser=require("body-parser");
const ejs=require('ejs');
const mongoose=require('mongoose');
const encrypt=require('mongoose-encryption');


const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/userDB");

const userScheme=new mongoose.Schema({
    email:String,
    password:String
});


userScheme.plugin(process.env.SECRET,{secret:secret,encryptedFields:["password"]});

const user =new mongoose.model("User",userScheme);

app.get('/',function(req,res){
    res.render("home");
});

app.get('/login',function(req,res){
    res.render("login");
});

app.post('/login',function(req,res){
    const userName=req.body.username;
    const password=req.body.password;
    user.findOne({email:userName},function(err,founduser){
        if(err){
            console.log(err);
        }else{
            if(founduser.password===password){
                res.render("secrets");
            }else{
                console.log("wrong password");
            }
        }
    })
});

app.get('/register',function(req,res){
    res.render("register");
});
app.post('/register',function(req,res){
    const newUser=new user({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save(function(err){
        if(err){
            console.log(err);

        }else{
            console.log("User Created"); 
            res.render("secrets");
        }
    })
});

app.listen(7777,function(){
    console.log("Server started");
});