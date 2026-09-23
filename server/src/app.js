const express=require("express");
const cors= require('cors');
const helmet=require('helmet');
const morgan= require('morgan');
const rateLimit=require('express-rate-limit');
const authRoutes= require("./routes/authRoutes");

const env=require("./config/env.js");

const app=express();
const port=env.PORT;
//security middleware
app.use(helmet());



//cors configuration

app.use(cors({
    origin:env.clientUrl,
    credentials:true,

}));

//Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later!",
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
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Talent API is running",
        environment: env.nodeEnv,
        timestamp: new Date().toString(),
    });
});

app.use("/api/auth",authRoutes);

//404 headers
app.use((req,res)=>{
    res.status(404).json({
        success:false,
        message:`Route not found:${req.method} and origin ${req.originalUrl}`
    });
});
app.use((error,req,res)=>{
    console.error("api error",error);
    const statusCode= error.statusCode || 500;

    res.status(statusCode).json({
        success:false,
        message: error.message || "Server internal errror"
    });
   
});
module.exports=app;