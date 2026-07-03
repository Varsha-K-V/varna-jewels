import connectDB from "@/lib/db";
import Category from "@/models/category/Category";
import Product from "@/models/product/Product";


export async function DELETE(req:Request){
    try{

        await connectDB();

        const {id} = await req.json();

        await Product.findByIdAndDelete(id);

        return Response.json(
            {message:"Product deleted successfully"},
            {status:200}
        );

    }catch(error){

        console.log(error);

        return Response.json(
            {message:"Something went wrong"},
            {status:500}
        )

    }
}
