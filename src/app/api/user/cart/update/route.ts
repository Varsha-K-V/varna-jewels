import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/cart/Cart";
import Product from "../../../../../models/product/Product";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function PATCH(req:Request){
    try{
        await connectDB();

        const { productId, action} = await req.json();

        const user = await getUserFromToken();

        if(!user){
            return NextResponse.json(
                { message :"Unauthorized"},
                { status : 401}
            )
        }

        const cart = await Cart.findOne({userId:user.userId});

        if(!cart){
            return NextResponse.json(
                {message :"Cart not found"},
                {status:404}
            );
        }

        const item = cart.items.find(
            (item:any)=>item.productId.toString() === productId
        );

        if(!item){
            return NextResponse.json(
                {message:"Product not found in cart"},
                {status:404}
            );
        }

        if(action === "increase"){
            item.quantity += 1;
        }

        if(action === "decrease"){
            item.quantity -=1;
        }

        cart.items = cart.items.filter(
            (item:any)=>item.quantity >0
        );

        await cart.save();

        return NextResponse.json({
            success:true,
            message:"Cart updated",
        });
    }catch(error){
        console.log(error)

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update quantity",
            },
            {
                status:500,
            }
        )
    }
}