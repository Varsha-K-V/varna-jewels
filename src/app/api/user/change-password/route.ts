import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db";
import User from "@/models/user/User";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function PUT(req: Request) {

    try {

        await connectDB();

        const userToken = await getUserFromToken();

        if (!userToken) {

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

        const {
            currentPassword,
            newPassword,
            confirmPassword,
        } = await req.json();


        if (
            !currentPassword ||
            !newPassword ||
            !confirmPassword
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message: "All fields are required.",
                },
                {
                    status: 400,
                }
            );

        }

        if (newPassword !== confirmPassword) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Passwords do not match.",
                },
                {
                    status: 400,
                }
            );

        }

        if (
            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(newPassword)
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character.",
                },
                {
                    status: 400,
                }
            );

        }

      

        const user = await User.findById(userToken.userId);

        if (!user) {

            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                {
                    status: 404,
                }
            );

        }

  

        const isMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!isMatch) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Current password is incorrect.",
                },
                {
                    status: 400,
                }
            );

        }

   

        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password
        );

        if (isSamePassword) {

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "New password cannot be the same as your current password.",
                },
                {
                    status: 400,
                }
            );

        }

   

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );


        user.password = hashedPassword;

        await user.save();

        return NextResponse.json(
            {
                success: true,
                message: "Password updated successfully.",
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update password.",
            },
            {
                status: 500,
            }
        );

    }

}