// import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
// import Product from "@/models/product/Product";

// export async function GET(){
//     try{
//         await connectDB();
       
//         const products = await Product.find().sort({createdAt:-1}).limit(4);
        

//         return NextResponse.json({
//             success:true,
//            products
//         })

//     }catch(error){

//         console.log(error)

//           return NextResponse.json(
//                     {
//                         success:false,
//                         message:"Failed to fetch products",
//                     },
//                     {
//                         status:500,
//                     }
                    
//                 )
//             }

//     }

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    console.log("Database:", mongoose.connection.db?.databaseName);
    console.log("Host:", mongoose.connection.host);

    const products = await Product.find().sort({ createdAt: -1 }).limit(4);

    return NextResponse.json({
      success: true,
      database: mongoose.connection.db?.databaseName,
      host: mongoose.connection.host,
      count: products.length,
      products,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      {
        status: 500,
      }
    );
  }
}