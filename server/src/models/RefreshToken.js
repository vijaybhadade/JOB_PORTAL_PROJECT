const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  { 
    //Hash token 
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    //check user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    //check expires
    expiresAt: {
      type: Date,
      required: true,
    },
    //access after expired
    revokedAt: {
      type: Date,
      default: null,
    },
    //create user_agent
    userAgent: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    //IP address
    ipAddress: {
      type: String,
      trim: true,
      maxLength: 100,
    },
  },
  {
    timestamps: true,
  },
);

refreshTokenSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSecounds: 0, //aftre fresh one secounds invalied
  },
);

module.exports=mongoose.model("RefreshToken",refreshTokenSchema);
