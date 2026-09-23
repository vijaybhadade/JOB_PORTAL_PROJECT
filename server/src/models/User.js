const mongoose=require("mongoose");

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"FirstName is required"],
        trim:true,
        minLength:[2,"First name must conatin at least 2 charecter"],
        maxLength:[20,"First  name can not exceed 20 charecter"]
    },
    lastName:{
         type:String,
        required:[true,"Last Name is required"],
        trim:true,
        minLength:[2,"Last name must conatin at least 2 charecter"],
        maxLength:[20,"Last name can not exceed 20 charecter"]
    },
    email:
    {
        type:String,
        required:[true,"email is required"],
        trim:true,
        unique:true,
        lowerCase:true,
        index:true
    },
    password:
    {
        type:String,
        required:[true,"Password must be  required!"],
        select:false
    },
    phone:
    {
        type:String,
        required:[true,"phone must be required!"],
        time:true,
        maxLength:13
    },
    role:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        required:[true,"Role must be requried!"],
    },
    isActive:
    {
        type:Boolean,
        default:true,
        index:true
    },
    isEmailVerified:
    {
        type:Boolean,
        default:false
    },
    lastLoginAt:
    {
        type:Date,
        default:null
    }
},
{
    timestamp:true
});

userSchema.index({
    firstName:1,
    lastName:1,
});
userSchema.index({
    role:1,
    isActive:1
});

module.exports=mongoose.model("/User",userSchema);

