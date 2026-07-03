import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Wallet from "@/models/wallet/Wallet";

import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {

    try {
        await connectDB();

        const user = await getUserFromToken();

        if (!user) {
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

        const wallet = await Wallet.findOne({
            userId: user.userId,
        });

          return NextResponse.json({
            success: true,
            wallet,
        });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Server Error",
            },
            {
                status: 500,
            }
        );
    }
}