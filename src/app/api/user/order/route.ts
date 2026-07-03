import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

import Order from "@/models/order/Order";

import Product from "../../../../models/product/Product";




import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(){
    try{
        await connectDB();

        const user = await getUserFromToken();

        if(!user){
            return NextResponse.json(
                {
                    success:false,
                    message:"Unauthorized"
                },
                {
                    status:401,
                }

            );
        }


        const populatedOrders = await Order.find({
            userId: user.userId,
        })
        .populate("items.productId")
        .sort({ createdAt: -1 });

        return NextResponse.json({
            success:true,
            orders:populatedOrders,
        });

    }catch(error){
         console.error("ORDER API ERROR:", error);

        return NextResponse.json(
            {
                success:false,
                message:"Failed to fetch orders"
            },{
                status:500
            }
        )
    }
}