import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function GET(
    req: Request,
    { params }: Params
) {
    try {

        await connectDB();

        const { id } = await params;


        const currentProduct = await Product.findById(id);

        if (!currentProduct) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                {
                    status: 404,
                }
            );
        }


        const relatedProducts = await Product.find({
            _id: { $ne: id },
            category: currentProduct.category,
        })
            .populate("category")
            .limit(4);

        return NextResponse.json(
            {
            success: true,
            relatedProducts,
        },
        
    );

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch related products",
            },
            {
                status: 500,
            }
        );

    }
}