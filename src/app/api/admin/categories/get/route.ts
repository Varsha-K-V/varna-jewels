import connectDB from "@/lib/db";
import Category from "@/models/category/Category";

export async function GET(){
    try{

        await connectDB();

        const categories = await Category.find();

        return Response.json(categories);

    }catch(error){
        console.log(error);

        return Response.json(
            {message:"Something went wrong"},
            {status:500}
        );
    }
}