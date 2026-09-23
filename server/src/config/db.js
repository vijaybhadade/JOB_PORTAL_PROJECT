const mongoose= require('mongoose');

const env=require("./env");

const connectDB= async()=>{
    try
    {   
        if(!env.mongoUrl)
        {
            throw new Error("MONGODB_URL is not define in environment!")
        }
        
        const connection = await mongoose.connect(env.mongoUrl);
        console.log(`MongoDB connected: ${connection.connection.host}`);
        console.log(connection.connection.name);
    }catch(err)
    {
        console.err("Mongodb connection failed!");
        console.err(err.message);

        process.exit(1);
    }
}

module.exports=connectDB;