import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
export async function GET(
    req:Request,
    { params }:{params :Promise<{id:string}>}
){

    try{

        await connectDB();

        const {id} = await params;

        const product = await Product.findById(id).populate("category");

        if(!product){
            return NextResponse.json(
                {
                success:false,
                message:"product not found",
                 },{
                    status:500,
                 }
           );
        }

        return NextResponse.json(product);
    }catch(error){
        console.log(error)

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch product",
            },
            {
                 status: 500,
            }
        )
    }

}