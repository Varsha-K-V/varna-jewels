import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import "@/models/category/Category";
import path from "path";
import fs from "fs/promises";

export async function PUT(req:Request,
    {
        params,
    }:{
        params:Promise<{
            id:string;
        }>;
    }
){
    try{

        await connectDB();

        const {id} = await params;

        const formData = await req.formData()

        const name = formData.get("name");
        const description = formData.get("description");
        const price = Number(formData.get("price"));
        const stock = Number(formData.get("stock"));
        const category = formData.get("category");
        const image = formData.get("image")as File;

        const existingProduct = await Product.findById(id);

        if(!existingProduct){
            return Response.json(
                {message:"Product not found"},
                {status:404}
            );
        }

        let imagePath = existingProduct.image;

         // if new image uploaded

         if(image && image.size >0){
            const bytes = await image.arrayBuffer();

            const buffer = Buffer.from(bytes);

            const fileName = Date.now() + "-" + image.name;

            const uploadPath = path.join(
                process.cwd(),
                "public/uploads",
                fileName
            );

            await fs.writeFile(
                uploadPath,
                buffer
            );

            imagePath=`/uploads/${fileName}`;
         }

         await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                stock,
                category,
                image:imagePath,
            }
         );
         return Response.json(
      {
        message:"Product updated successfully",
        success:true,
          
      },

      {
        status:200,
      }
    );

    }catch(error){
        console.log(error);

        return Response.json(
      {
        message:
          "Something went wrong",
      },

      {
        status:500,
      }
    );
    }
}