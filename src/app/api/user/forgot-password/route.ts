import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user/User";
import { sendEmail } from "@/lib/sendEmail";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is required",
                },
                { status: 400 }
            )
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found"
                }, {
                status: 404,
            }
            )
        }

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        user.resetOtp = otp;

        user.resetOtpExpire = new Date(
            Date.now() + 2 * 60 * 1000
        );

        await user.save();

        await sendEmail(
            email,
            "Password Reset OTP",

            `<h2>Your OTP is ${otp}</h2>
            <p>This OTP is valid for 5 minutes.</p>
            `
        )

        return NextResponse.json({
            success: true,
            message: "OTP sent successfully",
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
            },
            {
                status: 500,
            }
        );

    }
}