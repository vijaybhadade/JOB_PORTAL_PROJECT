const express=require("express");
const cors= require('cors');
const helmet=require('helmet');
const morgan= require('morgan');
const rateLimit=require('express-rate-limit');
const env=require("./config/env");

const app=express();
const port=
//security middleware
app.use(helmet());



//cors configuration

app.use(cors({
    origin:env.clientUrl,
    credentials:true,

}));

//Rate Limiting
const apiLimiter=rateLimit({
    windowMs:15*60*1000,
    max:200,
    standarHeaders:true,
    legacyHeaders:false,
    message:
    {
        success:false,
         message:"Too many request. Please again leter!",
    }
});

app.use("/api",apiLimiter);


//request parsing 
app.use(express.json({
    limit:"1MB"
}));


app.use(express.urlencoded({
    extended:true,
    limit:"1mb"
}));


//Logging middileware
app.use(morgan("dev"));

//Health checkup to check resonponse time from server to user 
app.get("/api/health",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Talent API is running",
        enviroment:env.noddEnv,
        timestamp: new Date().toString(),
    });
});

//404 headers

app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:`Route not found:${req.method} and origin ${req.originalUrl}`
    });
});

module.exports=app;