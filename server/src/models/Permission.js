const mongoose=require("mongoose");

const permissionSchema= new mongoose.Schema({
    code:{
        type:String,
        required:[true,"Permission code is required!"],
        unique:true,
        uppercase:true,
        trime:true,
        maxLength:125
    },
    name:
    {
        type:String,
        required:[true,"Permission name is required"],
        trim:true,
        maxLength:150
    },
    description:
    {
        type:String,
        trim:true,
        maxLength:500
    },
    module:
    {
        type:String,
        required:[true, "Permission module is required!"],
        trim:true,
        lowerCase:true,
        index:true
    },
    action:{
        type:String,
        required:[true,"Permission action is required!"],
        trim:true,
        lowerCase:true
    },
    isActive:
    {
        type:Boolean,
        default:true,
    }
},
{
    timestamp:true
});

permissionSchema.index({
    model:1,
    action:1
});

module.exports=mongoose.model("Permission",permissionSchema);