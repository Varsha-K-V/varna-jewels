import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import connectDB from "@/lib/db";

import Cart from "@/models/cart/Cart";
import Order from "@/models/order/Order";
import Address from "@/models/user/Address";

import Product from "@/models/product/Product";

import { getUserFromToken } from "@/lib/getUserFromToken";

export async function POST(req: NextRequest) {
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
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            addressId,
            paymentMethod,
        } = await req.json();

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET!
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");



        if (generatedSignature !== razorpay_signature) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid payment signature.",
                },
                {
                    status: 400,
                }
            );

        }

        const selectedAddress = await Address.findOne({
            _id: addressId,
            userId: user.userId,
        });

        if (!selectedAddress) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Address not found.",
                },
                {
                    status: 404,
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

        const items = cart.items.map((item: any) => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.productId.price,
            status: "Pending",
        }));

        const totalAmount = cart.items.reduce(
            (acc: number, item: any) =>
                acc + item.productId.price * item.quantity,
            0
        );

        const order = await Order.create({
            userId: user.userId,

            items,

            totalAmount,

            paymentMethod,

            paymentStatus: "Paid",

            razorpayOrderId:
                razorpay_order_id,

            razorpayPaymentId:
                razorpay_payment_id,

            shippingAddress: {
                fullName: selectedAddress.fullName,
                phone: selectedAddress.phone,
                addressLine: selectedAddress.addressLine,
                city: selectedAddress.city,
                state: selectedAddress.state,
                pinCode: selectedAddress.pinCode,
            },

            status: "Pending",
        });

       

        for (const cartItem of cart.items) {

            await Product.findByIdAndUpdate(
                cartItem.productId._id,
                {
                    $inc: {
                        stock: -cartItem.quantity,
                    },
                }
            );

        }

        await Cart.findOneAndUpdate(
            {
                userId: user.userId,
            },
            {
                $set: {
                    items: [],
                },
            }
        );

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully.",
            orderId: order._id,
        });

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Payment verification failed.",
            },
            {
                status: 500,
            }
        );

    }
}