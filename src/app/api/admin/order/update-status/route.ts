import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Order from "@/models/order/Order";

export async function PATCH(req: Request) {

    try {

        await connectDB();

        const { orderId, itemId, status } =
            await req.json();

        const order = await Order.findById(
            orderId
        );

        if (!order) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found"
                },
                {
                    status: 404
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
                    message: "Item not found"
                },
                {
                    status: 404
                }
            );

        }

        item.status = status;

        await order.save();

        return NextResponse.json(
            {
                success: true,
                message: "Status updated"
            }
        );

    }
    catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update status"
            },
            {
                status: 500
            }
        );

    }

}