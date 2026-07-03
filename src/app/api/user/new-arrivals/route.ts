import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";

export async function GET(){
    try{
        await connectDB();

        const products = await Product.find().sort({createdAt:-1}).limit(4);

        return NextResponse.json({
            success:true,
           products
        })

    }catch(error){

        console.log(error)

          return NextResponse.json(
                    {
                        success:false,
                        message:"Failed to fetch products",
                    },
                    {
                        status:500,
                    }
                    
                )
            }

    }
