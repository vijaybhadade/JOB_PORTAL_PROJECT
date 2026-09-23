const jwt=require("jsonwebtoken");
const crypto=require("crypto");


const env=require("../config/env");

const genarateAccessToken=(user)=>{
    return jwt.sign(
        {
          sub:user._id.toString(),
          role:user.role.name,
          type:"access",
        },
       env.jwtSecret,
       {
        expiresIn:env.jwtExpresIN ,
       }
    );
};

//token refresh 

const genarateRefreshToken= (token) =>
{
    return crypto.randomBytes(64).toString("hex");
};

//after genarateToken hash token 

const hashToken=(token)=>{
    return crypto.createHash("sha512")
           .update(token)
           .digest("hex")
};

//create expres new date and setExpire for 15days
const getRefreshTokenExpiry=()=>{
    const expireAt= new Date();
    expireAt.setDate(expireAt.getDate()+15);
   return expireAt;
};

module.exports={
    genarateAccessToken,
    genarateRefreshToken,
    hashToken,
    getRefreshTokenExpiry
};