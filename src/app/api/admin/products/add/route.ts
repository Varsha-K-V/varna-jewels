import connectDB from "@/lib/db";
import Product from "@/models/product/Product";

import path from "path";
import fs from "fs/promises";

import { v4 as uuidv4 } from "uuid";

export async function POST(req:Request){
    try{

        await connectDB();

        const formData = await req.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const price = formData.get("price");
        const stock = formData.get("stock");
        const category = formData.get("category");
        const image = formData.get("image") as File;

        // IMAGE CONVERSION

        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // UNIQUE IMAGE NAME

        const fileName =`${uuidv4()}-${image.name}`;

        // FILE PATH

        const uploadPath = path.join(
            process.cwd(),
            "public/uploads",
            fileName
        );

         // SAVE IMAGE

        await fs.writeFile(uploadPath, buffer);

         // IMAGE PATH FOR DATABASE

         const imagePath = `/uploads/${fileName}`;

         await Product.create({
            name,
            description,
            price,
            stock,
            category,
            image:imagePath,
         });

         return Response.json(
            {message:"Product added successfully"},
            {status:201}
         )

    }catch(error){
        console.log(error);

        return Response.json(
            {message:"Something went wrong"},
            {status:500}
        );
    }
}