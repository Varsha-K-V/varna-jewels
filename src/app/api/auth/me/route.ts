import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/db";
import User from "@/models/user/User";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No token found",
                },
                {
                    status: 401,
                }
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            userId: string;
        };

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            },
                {
                    status: 404,
                }
            );
        }

        if (user.isBlocked) {

            const response = NextResponse.json(
                {
                    success: false,
                    message: "User blocked",
                },
                {
                    status: 403,
                }
            );

            response.cookies.set("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 0,
                path: "/",
            });

            return response;
        }

        return NextResponse.json({
            success: true,
            user,
        });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }
}