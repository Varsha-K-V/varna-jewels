import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

import Cart from "@/models/cart/Cart";
import Order from "@/models/order/Order";
import Address from "@/models/user/Address";
import Product from "@/models/product/Product";
import Wallet from "@/models/wallet/Wallet";

import { getUserFromToken } from "@/lib/getUserFromToken";


export async function POST(req: Request) {
    try {

        await connectDB();

        const { addressId, paymentMethod } = await req.json();

        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
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
                { status: 404 }
            );
        }

        const cart = await Cart.findOne({
            userId: user.userId,
        }).populate("items.productId");

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                { message: "Cart is empty" },
                { status: 400 }
            );
        }

        const items = cart.items.map(
            (item: any) => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price,
                status: "Pending",
            })
        );

        const totalAmount = cart.items.reduce((acc: number, item: any) =>
            acc + item.productId.price * item.quantity, 0);

        const COD_LIMIT = 1000;

        if (
            paymentMethod === "COD" &&
            totalAmount > COD_LIMIT
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Cash On Delivery is not available for orders above ₹1000.",
                },
                { status: 400 }
            );
        }

        let wallet: any = null;

        if (paymentMethod === "WALLET") {

            wallet = await Wallet.findOne({
                userId: user.userId,
            });

            if (!wallet) {

                return NextResponse.json(
                    {
                        success: false,
                        message: "Wallet not found.",
                    },
                    { status: 404 }
                );

            }

            if (wallet.balance < totalAmount) {

                return NextResponse.json(
                    {
                        success: false,
                        message: "Insufficient wallet balance.",
                    },
                    { status: 400 }
                );

            }

            // wallet.balance -= totalAmount;

            // wallet.transactions.push({
            //     type: "Debit",
            //     amount: totalAmount,
            //     purpose: "Order Payment",
            // });

            // await wallet.save();

        }


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


        let order;
        try {
            order = await Order.create({
                userId: user.userId,
                items,
                totalAmount,
                paymentMethod,
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


        } catch (orderError) {


            for (const rollback of decremented) {
                await Product.findByIdAndUpdate(
                    rollback.productId,
                    { $inc: { stock: rollback.quantity } }
                );
            }

            throw orderError;
        }

        if (paymentMethod === "WALLET" && wallet) {

            wallet.balance -= totalAmount;

            wallet.transactions.push({
                type: "Debit",
                amount: totalAmount,
                purpose: "Order Payment",
                orderId: order._id,
            });

            await wallet.save();

        }

        await Cart.findOneAndUpdate(
            { userId: user.userId },
            { $set: { items: [] } }
        );

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            orderId: order._id,
        });

    } catch (error) {
        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to place order",
            },
            { status: 500 }
        );
    }
}