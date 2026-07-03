import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";

export async function GET(
    req:Request
){
    try{

        await connectDB();

        const {searchParams} = new URL(req.url);

        const page = Number(searchParams.get("page")) || 1;

        const search = searchParams.get("search") || "";

        const category = searchParams.get("category")?.trim() || "";

        const sort = searchParams.get("sort") || "newest";

        const price = searchParams.get("price") || "";

        const limit = 9;

        const skip = (page-1)*limit;

        const filter: any = {
            stock: { $gt: 0 }
        };

        if (search) {
           filter.name = {
                $regex: search,
                $options: "i"
            };
        }

        if (category) {
            filter.category = category;
        }

        let sortOption = {};

        if (sort === "newest") {
            sortOption = { createdAt: -1 };
        }
        else if (sort === "priceLow") {
            sortOption = { price: 1 };
        }
        else if (sort === "priceHigh") {
            sortOption = { price: -1 };
        }
        else if (sort === "name") {
            sortOption = { name: 1 };
        }

        if (price === "0-500") {
            filter.price = {
                $gte: 0,
                $lte: 500
            };
        }
        else if (price === "500-1000") {
            filter.price = {
                $gte: 500,
                $lte: 1000
            };
        }
        else if (price === "1000-5000") {
            filter.price = {
                $gte: 1000,
                $lte: 5000
            };
        }
        else if (price === "5000-above") {
            filter.price = {
                $gte: 5000
            };
        }


        const totalProducts = await Product.countDocuments(filter);


        const products = await Product.find(filter)
        .populate("category")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

        return NextResponse.json({
            products,
            totalPages:Math.ceil(totalProducts/limit),
            currentPage:page,
        });


    }catch(error){
        console.log(error);

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