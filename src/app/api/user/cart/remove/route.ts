import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/cart/Cart";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function DELETE(req:Request){
    try{
        await connectDB();

        const {productId} = await req.json();

        const user = await getUserFromToken();

        if(!user){
            return NextResponse.json(
                {message:"Unauthorized"},
                {status:401}
            )
        }

        const cart = await Cart.findOne({
            userId : user.userId
        });

        if(!cart){
            return NextResponse.json(
                { message : "Cart not found"},
                {status:404}
            )
        }

        cart.items = cart.items.filter(
            (item:any)=>
                item.productId.toString() !== productId
        );

        await cart.save();

        return NextResponse.json({
            success :true,
            message : "Item removed from cart"
        });

    }catch(error){
        console.log(error);
    }

    return NextResponse.json(
        {
            success : false,
            message : "Failed to remove item"
        },{
            status :500
        }
    )
}