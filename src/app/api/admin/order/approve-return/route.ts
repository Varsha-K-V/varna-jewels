import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Order from "@/models/order/Order";
import Product from "@/models/product/Product";
import Wallet from "@/models/wallet/Wallet";

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const { orderId, itemId } = await req.json();

        const order = await Order.findById(orderId);

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                { status: 404 }
            );
        }

        const item = order.items.id(itemId);

        if (!item) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Item not found",
                },
                { status: 404 }
            );
        }

        if (item.status !== "Return Requested") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid return request",
                },
                { status: 400 }
            );
        }

        item.status = "Returned";

        await order.save();


        const product = await Product.findById(item.productId);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        product.stock += item.quantity;

        await product.save();

        const wallet = await Wallet.findOne({
            userId: order.userId,
        });

        if (!wallet) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Wallet not found",
                },
                { status: 404 }
            );
        }

        const refundAmount = item.price * item.quantity;

        wallet.balance += refundAmount;

          wallet.transactions.push({
                    type: "Credit",
                    amount: refundAmount,
                    purpose:"Return Refund",
                    orderId: order._id,
                });

        await wallet.save();


        return NextResponse.json({
            success: true,
            message: "Return approved successfully",
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