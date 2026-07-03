import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/cart/Cart";
import { getUserFromToken } from "@/lib/getUserFromToken";




export async function POST(req: Request) {
    try {

        await connectDB();

        const { productId, quantity } = await req.json();

        const user = await getUserFromToken();

        if (!user) {
            return NextResponse.json(
                {
                    message: "Please login to add products to cart.",
                },
                {
                    status: 401,
                }
            );
        }

        const userId = user.userId;

        let cart = await Cart.findOne({ userId });



        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity }]
            });

            await cart.save();

            return NextResponse.json({
                success: true,
                message: "Product added to cart",
            });

        }

        const existingItem = cart.items.find(
            (item: any) =>
                item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();

        return NextResponse.json({
            success: true,
            message: "Cart updated",
        });


    } catch (error) {
        console.log("CART ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add to cart",
                error: String(error),
            },
            { status: 500 }
        );
    }
}