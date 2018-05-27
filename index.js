var express=require('express');

var bodyParser=require('body-parser');

var path=require('path');

var mongoose=require('mongoose');

var app=express();
var http = require('http').Server(app);
var users = require('./models/user.js');

var router=express.Router();

var bcrypt =require('bcryptjs');
var io = require('socket.io')(http);
mongoose.connect('mongodb://vivek:bluewhales265@ds117540.mlab.com:17540/friends');

 var db= mongoose.connection;

function gettime(){
  var date = new Date();

      var hour = date.getHours();
      hour = (hour < 10 ? "0" : "") + hour;

      var min  = date.getMinutes();
      min = (min < 10 ? "0" : "") + min;
 return hour+":"+min;
}

 app.use(bodyParser.json());
//
 app.use(bodyParser.urlencoded({extended:false}));
//
 app.use(express.static('./public'));
//
 db.once('open',()=>{
   console.log("connected");
 });
db.on("error",(err)=>{
   console.log(err)
 });

 function  encryption(pass){
   bcrypt.genSalt(10,(err,salt)=>{
     bcrypt.hash(pass,salt,(err,hash)=>{
       pass=hash;
     console.log(pass);
     });
   });

 }



   app.use(express.static(__dirname + '/public'));
   app.get('/',function(req,res){
     res.sendFile(__dirname+'/public/index.html');
   });



 //signup
 app.post('/signup',(req,res)=>{
   var user=new users();
 user.username=req.body.username;
 user.password=req.body.password;
 bcrypt.genSalt(10,(err,salt)=>{
   bcrypt.hash(user.password,salt,(err,hash)=>{
     if(err)
     throw err;
     else{
       user.password=hash;
     user.save((err)=>{
         if(err)
         console.log(err);
         else
         res.redirect('/');
       });
     }
   })
 })
 });

 //testing
 app.post('/test',(req,res)=>{
 var pass =req.body.text;
 encryption(pass);
 });
 io.on('connection', function(socket){
   console.log('a user connected');

   socket.on('disconnect',()=>{
     var time=gettime();
     console.log("disconnected \n lastseen at"+time);
   });
   socket.on('chat message',(msg)=>{
io.emit('chat message',msg);
 });
});

http.listen(3000,()=>{
  console.log("server");
});
