import connectDB from "@/lib/db";
import Category from "@/models/category/Category";

export async function PUT(
   req: Request,
  context: {
    params: Promise<{ id: string }>;
  }
){
    try{

        await connectDB();

        const { id } = await context.params;

        const {name} = await req.json();

        await Category.findByIdAndUpdate(
            id,
            {name}
        );

        return Response.json(
            {message:"Category updated successfully"},
            {status:200}
        );

    }catch(error){
        console.log(error);

        return Response.json(
            {message:"Something went wrong"},
            
        )
    }
}