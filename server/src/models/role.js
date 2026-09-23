const mongoose=require("mongoose");

const roleSchema= new mongoose.Schema({
    name:
    {
        type:String,
        requried:[true,"Role name is required"],
        unique:true,
        uppercase:true,
        trime:true,
        maxLength:50
    },
    description:
    {
        type:String,
        trim:true,
        maxLength:300
    },
    Permission:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Permission"

        }
       
    ],
    isSystemRole:
    {
        type:Boolean,
        default:true,
        index:true
    },
    isActive:
    {
        type:Boolean,
        default:true,
        index:true
    }
},
{
    timestamp:true
});


module.exports=mongoose.model("Role",roleSchema);