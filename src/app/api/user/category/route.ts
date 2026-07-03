import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Category from "@/models/category/Category";

export async function GET(){
    try{

        await connectDB();

        const categories = await Category.find().sort({name:1});

        return NextResponse.json({
            success:true,
            categories
        })

    }catch(error){
        console.log(error);

        return NextResponse.json(
            {
                success:false,
                message:"Failed to fetch categories"
            },
            {
                status:500
            }
        )
    }
}