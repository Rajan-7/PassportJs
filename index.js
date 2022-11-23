
const { json } = require("express");
const express =require("express");
const app =express();
const fs = require("fs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const localStorage = require("passport-local").Strategy;
app.use(passport.initialize());//to initialize the passport
const data = JSON.parse(fs.readFileSync("./data.json",{encoding:"utf-8"}));
passport.use(
    new localStorage((u,p,cb)=>{
        //gU refers to get Users if below filter MATCH
        const gU=data.filter((data)=>{
            if(data.username === u || data.password === p){
                return data;
            }
        });
        if(gU.length){
            return cb(null,gU[0],{
            message:"Successfully enter into system",
        });
        }
        return cb(null,false,{
            message:"Something went wrong",
        });
    })
);
app.use(express.json());
app.post("/signin",(req,res,next)=>{
    //local will check the localstorage
    passport.authenticate("local",{session:false},(err,u,info)=>{
        //err will accept any kind of error from line 19 i.e cb(null,gU[0])
        if(err || !u){
            return res
            .status(400)
            .json({message:"Something went wrong"});
        }
        req.u=u;
        const token=jwt.sign(u,"private");
        return res.status(200).send({token:token});
    })(req,res);
});
app.listen(3009,()=>{
    console.log("Server RuNNInG");
})
//jwtstrategy