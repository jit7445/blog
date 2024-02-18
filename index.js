require("dotenv").config();
const path=require('path')
const express=require('express')
const mongoose=require('mongoose');
const connectMog=require('./db');
const cookieParser = require('cookie-parser');
const Blog = require("./models/blog");
const userRoutes=require('./routes/user')
const  blogRoutes=require('./routes/blog')

const { checkForAuthenticationCookie } = require('./middleware/authentication');


mongoose.set('strictQuery', false);

const app=express()
const port = 3033;
connectMog()
// render static file
app.use(express.static('public'));
// see file inside of views use this ejs engine
app.set('view engine','ejs')

app.set('views',path.resolve("./views"))
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"))
app.use(express.static(path.resolve("./public")));
app.use((req, res, next) => {
  // console.log("user", req.user);
  next();
});

app.get('/',(req,res)=>{
  // console.log("user:",req.user);
  res.render("index",{
    user:req.user
  })
})
// used the user router when request start from /user
app.use('/user',userRoutes)
//used the blog route
app.use('/blog',blogRoutes)

// Middleware




app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});