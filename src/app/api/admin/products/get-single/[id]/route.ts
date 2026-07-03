import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import "@/models/category/Category";

export async function GET(req:Request,
    {
        params,
    }:{
        params: Promise<{
            id:string;
        }>;
    }
){
    try{
        await connectDB();

        const {id} = await params;

        const product = await Product.findById(id);

        if(!product){
            return Response.json(
                {message:"Product not found"},
                {status:404}
            );
        }

        return Response.json(product);

    }catch(error){
        console.log(error);

        return Response.json(
            {message:"Something went wrong"},
            {status:500}
        )

    }
}
   
