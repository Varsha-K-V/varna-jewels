import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Order from "@/models/order/Order";
import Product from "@/models/product/Product";
import Wallet from "@/models/wallet/Wallet";

import { getUserFromToken } from "@/lib/getUserFromToken";

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
            }, {
                status: 401,
            }
            );
        }

        const { orderId, itemId } = await req.json();

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
            (item: any) => item._id.toString() === itemId
        );

        if (!item) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Item not found",
                }, {
                status: 404,
            }
            )
        }

        if (
            item.status === "Shipped" ||
            item.status === "Delivered" ||
            item.status === "Cancelled"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Item cannot be cancelled",
                },
                {
                    status: 400,
                }
            );
        }

        item.status = "Cancelled";

        const product = await Product.findById(item.productId);

        if (product) {
            product.stock += item.quantity;
            await product.save();
        }

        if (
            order.paymentMethod !== "COD" &&
            order.paymentStatus === "Paid"
        ) {

            const refundAmount = item.price * item.quantity;

            const wallet = await Wallet.findOne({
                userId: user.userId,
            });

            if (wallet) {

                wallet.balance += refundAmount;

                wallet.transactions.push({
                    type: "Credit",
                    amount: refundAmount,
                    purpose: "Order Cancelled",
                    orderId: order._id,
                });

                await wallet.save();
            }

        }

        order.totalAmount = order.items.reduce((acc: any, item: any) =>
            item.status !== "Cancelled"
                ? acc + item.price * item.quantity
                : acc,
            0
        );


        await order.save();

        return NextResponse.json({
            success: true,
            message: "Item cancelled successfully"
        });


    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to cancel item",
            },
            {
                status: 500,
            }
        );
    }
}