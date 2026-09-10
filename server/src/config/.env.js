const dotenv= require("dotenv");
dotenv.config();

const env= {
    nodeEnv:process.env.NODE_ENV || "development",
    PORT:Number(process.env.PORT) || 5000,

    mongoUrl=process.env.MONGODB_URI,

    jwtSecret:process.env.JWT_SECRET,

    jwtExpresIN:process.env.JWT_EXPIRES_IN || "30m",

    refressToken:process.env.REFRESH_TOKEN_EXPIRES_IN || "15d",
    
    clientUrl=process.env.CLIENT_URL || "http://localhost:5173",
};

module.exports=env;