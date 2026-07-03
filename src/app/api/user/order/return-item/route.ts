import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Order from "@/models/order/Order";

import { getUserFromToken } from "@/lib/getUserFromToken";

export async function PATCH(req: Request) {
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

        const {
            orderId,
            itemId,
            reason,
        } = await req.json();

        const order = await Order.findOne({
            _id: orderId,
            userId: user.userId,
        });

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

        const item = order.items.find(
            (item: any) =>
                item._id.toString() === itemId
        );

        if (!item) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Item not found",
                },
                {
                    status: 404,
                }
            );
        }

        if (item.status !== "Delivered") {

            return NextResponse.json(
                {
                    success: false,
                    message: "Only delivered items can be returned.",
                },
                {
                    status: 400,
                }
            );

        }

        item.status = "Return Requested";

        item.returnReason = reason;

        await order.save();

        return NextResponse.json({
            success: true,
            message: "Return request submitted successfully.",
        });


    } catch (error) {
        console.log(error);
    }
}