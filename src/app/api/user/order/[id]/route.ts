import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Order from "@/models/order/Order";

import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        const order = await Order.findOne({
            _id: id,
            userId: user.userId,
        }).populate("items.productId");

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json({
            success: true,
            order,
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch order",
            },
            {
                status: 500,
            }
        );
    }
}