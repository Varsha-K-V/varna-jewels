import connectDB from "@/lib/db";
import Category from "@/models/category/Category";

export async function POST(req:Request){
    try{
        await connectDB();

        const {name} = await req.json();

        if(!name){
            return Response.json(
                {message:"Category name required"},
                {status:400}
            );
        }

        const existingCategory = await Category.findOne({name});

        if(existingCategory){
            return Response.json(
                {message:"Category already exists"},
                {status:400}
            );
        }

        await Category.create({name});

        return Response.json(
            {message:"Category added successfully"},
            {status:201}
        );

    }catch(error){
        console.log(error);

        return Response.json(
            {message:"Something went wrong"},
            {status:500}
        );

    }
}