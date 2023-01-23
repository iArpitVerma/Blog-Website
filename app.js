const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const favicon = require('serve-favicon');
const path = require('path');
const mongoose = require('mongoose');
const { strictEqual } = require("assert");
const res = require("express/lib/response");
const { title } = require("process");

const homeStartingContent = "Welcome to my Daily Journal, Here I post about new things and experiences I got to learn in my daily life be it some general knowledge, physcology, motivation, curiousity driven content, etc. I am sure you all are going to love this as it is going to broaden your thinking horizon about life. Just keep following my web page regularly!";
const aboutContent = "Hello guys, my name is Arpit Verma, an UG 3rd year student of Punjab Engineering College(PEC), Chandigarh. I am very curious guy, who wants to learn about life in general. I love to watch podcasts, documentaries, read books to get par with this rapid advancing world!";
const contactContent = "You can contact me with my email id by using the below button!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(path.join(__dirname,'/public', "/favicon.ico")));

app.use("/public" , express.static("public"));
const posts = [] ;

//set up default connection
// Write your mongoDB URL here
// like this 'mongodb+srv://your_username:'+encodeURIComponent("Your Password") +'@cluster0.rseim.mongodb.net/blogDB'
const pass = encodeURIComponent(process.env.PASS);
const user = process.env.USER;
var db1 = mongoose.connect('mongodb+srv://'+user+':'+pass+'@cluster0.rseim.mongodb.net/blogDB',{useNewUrlParser:true, useUnifiedTopology:true});

//get the default connection
var db = mongoose.connection;

//creating Schema
const postsSchema = {
  title : String,
  content : String
};

//create Model
const Post = mongoose.model("Post" , postsSchema);

app.get("/",function(req,res){
  Post.find({},function(err,posts){
    res.render("home",{
      home: homeStartingContent,
      posts: posts
    });
  })
});

app.get("/about", function(req,res){
  res.render("about", {
    about: aboutContent,
  });
});

app.get("/contact" , function(req,res){
  res.render("contact", {
    contact: contactContent
  });
});

app.get("/compose", function(req,res){
  res.render("compose");
});


app.post("/compose", function(req,res){
  const post =new Post({
    title: req.body.postTitle.charAt(0).toUpperCase() + req.body.postTitle.slice(1),
    content : req.body.postBody
  });
  post.save(function(err){
    if(!err){
      res.redirect("/");
    }
  })
 });

 app.post("/delete" , function(req,res){
  const deleteItemId = req.body.delete;
  Post.findByIdAndRemove(deleteItemId,function(err){
    if(err){
      console.log(err);
    }else{
      console.log("deleted");
      res.redirect("/");
    }
  })
 });

app.get("/posts/:postId" , function(req,res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id:requestedPostId}, function(err,post){
    res.render("post" , {
      postTitle: post.title,
      postContent: post.content,
      postId: post.id
    });
  });
});


app.listen(process.env.PORT || 3000, function() {
  console.log("Source Code 200");
});
