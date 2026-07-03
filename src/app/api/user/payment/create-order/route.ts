import { NextResponse } from "next/server";

import connectDB from "@/lib/db";

import Cart from "@/models/cart/Cart";

import Product from "@/models/product/Product";

import { getUserFromToken } from "@/lib/getUserFromToken";

import razorpay from "@/lib/razorpay";

export async function POST() {
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

        const cart = await Cart.findOne({
            userId: user.userId,
        }).populate("items.productId");

        if (!cart || cart.items.length === 0) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Cart is empty.",
                },
                {
                    status: 400,
                }
            );

        }

        const totalAmount = cart.items.reduce(
            (acc: number, item: any) =>
                acc + item.productId.price * item.quantity,
            0
        );

         const decremented: { productId: string; quantity: number }[] = [];
        
                for (const cartItem of cart.items) {
        
                    const updatedProduct = await Product.findOneAndUpdate(
                        {
                            _id: cartItem.productId._id,
                            stock: { $gte: cartItem.quantity },
                        },
                        {
                            $inc: { stock: -cartItem.quantity },
                        },
                        { new: true }
                    );
        
                    if (!updatedProduct) {
        
                        // Roll back everything decremented so far in this loop
                        for (const rollback of decremented) {
                            await Product.findByIdAndUpdate(
                                rollback.productId,
                                { $inc: { stock: rollback.quantity } }
                            );
                        }
        
                        const product = await Product.findById(cartItem.productId._id);
        
                        return NextResponse.json(
                            {
                                success: false,
                                message: product
                                    ? `${product.name} is out of stock.`
                                    : "Product not found.",
                            },
                            { status: 400 }
                        );
                    }
        
                    decremented.push({
                        productId: cartItem.productId._id,
                        quantity: cartItem.quantity,
                    });
                }
        


        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        return NextResponse.json({
            success: true,
            order: razorpayOrder,
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong.",
            },
            {
                status: 500,
            }
        );

    }
}