import connectDB from "@/lib/db";
import User from "@/models/user/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        const user = await User.findOne({ email });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 404
                }
            );
        }

        if (user.isBlocked) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Your account has been blocked. Please contact support.",
                },
                {
                    status: 403,
                }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid credentials"
                },
                {
                    status: 400
                }
            );
        }

        const token = jwt.sign(
            {
                userId: user._id,
            },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1d",
            }
        );

        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful",
                token
            },
            {
                status: 200
            }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24,
            path: "/",
        });

        return response;

    } catch (error) {
        console.log(error);

        return Response.json(
            {
                success: false,
                message: "Something went wrong"
            },

            { status: 500 }
        );

    }
}