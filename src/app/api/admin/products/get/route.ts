import connectDB from "@/lib/db";
import Category from "@/models/category/Category";
import Product from "@/models/product/Product";


export async function GET(
    req:Request
){
    try{

        await connectDB();

        const {searchParams}=new URL(req.url);

        const page = Number(searchParams.get("page")) || 1;

        const limit = 5;

        const skip = (page-1)*limit;

        const totalProducts = await Product.countDocuments();

        const products = await Product.find()
        .populate("category")
        .sort({
            createdAt:-1
        })
        .skip(skip)
        .limit(limit);
        

        return Response.json({
            products,
            totalPages:Math.ceil(totalProducts/limit),
            currentPage:page,
        });

    }catch(error){
        console.log(error);

        return Response.json(
            {message : "Something went wrong"},
            {status:500}
        );
    }
}