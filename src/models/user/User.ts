import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        address:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true,
        },
        pin:{
            type:Number,
            required:true,
        },
        password:{
            type:String,
            required:true
        },
        isBlocked:{
            type:Boolean,
            default:false,
        },
        resetOtp:{
                type:String,
        },
        resetOtpExpire:{
            type:Date,
        }
    },
    {
        timestamps:true
    }
);

const User = mongoose.models.User || mongoose.model("User",userSchema);
export default User;