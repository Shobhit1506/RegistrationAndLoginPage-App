const {createHmac, randomBytes}=require("node:crypto");
const { Timestamp } = require('mongodb');
const {Schema,model}=require('mongoose');
const { createjwttoken } = require("../services/authentication");


//creating schema
const userScehma=new Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
        
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:'USER',
    },
    profileImageUrl:{
        type:String,
        default:"../public/images/download.png"
    },
},{timestamps:true})

userScehma.pre('save',function (next){
    const user=this;

    if(!user.isModified('password')) return;
    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt).update(user.password).digest("hex");

    this.salt=salt;
    this.password=hashedPassword;
    next();

})
userScehma.static("matchPasswordAndGenearteToken",async function(email,password){
    const user=await this.findOne({email});
    if(!user) throw new Error("user not found");
    const salt=user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac('sha256',salt).update(password).digest("hex");
    if(hashedPassword !== userProvidedHash) throw new Error("Password not correct");
    
    const token=createjwttoken(user);
    return token;
})

//creating model from schema
const User=model("user",userScehma);



//exporting model
module.exports=User;