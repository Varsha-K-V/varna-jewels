import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Cart from "@/models/cart/Cart";
import { getUserFromToken } from "@/lib/getUserFromToken";


export async function GET(){
    try{
        await connectDB();

        const user = await getUserFromToken();


         if (!user) {
           return NextResponse.json(
        {   success:false,
            message: "Unauthorized" 
        },
        { status: 401 }
      );
    }

        const cart = await Cart.findOne({
            userId:user.userId,
        }).populate("items.productId");

        // console.log("CART:", cart);
        
        return NextResponse.json({
            success:true,
            items: cart?.items || [],
        });

    }catch(error){
        console.log( error);

        return NextResponse.json(
            {
                message:"Failed to fetch cart",
            },
            {status:500}
        );
    }
}