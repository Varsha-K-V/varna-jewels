import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user/User";

export async function POST(req : NextRequest){
    await connectDB();

    const {email,otp} = await req.json();

    const user = await User.findOne({
        email,
        resetOtp : otp,
    });

    if(
        !user || 
        !user.resetOtpExpire ||
        user.resetOtpExpire < new Date ()
    ){
        return NextResponse.json(
             {
                success:false,
                message:"Invalid or expired OTP",
            },
            {
                status:400,
            }
        );
    }

     return NextResponse.json({
        success:true,
        message:"OTP verified successfully",
    });

}