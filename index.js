const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const router=require('./routes/user')
const app=express();


//middleware for accepting forms value
app.use(express.urlencoded({extended:false}))

//connecting mongodb
mongoose.connect("mongodb://127.0.0.1:27017/bloggify").then((e)=> console.log("database connected"))


//setting ejs
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//settimg routes
app.get('/',(req,res)=>{
    res.render("home");
})
app.use('/user',router)

//running server
app.listen(8000,()=> console.log(`server is running at port:8000`));