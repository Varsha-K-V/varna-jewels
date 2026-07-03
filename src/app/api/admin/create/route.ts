import connectDB from "@/lib/db";
import Admin from "@/models/admin/Admin";
import bcrypt from "bcryptjs";


export async function GET (){

    try{

        await connectDB();

        const hashedPassword = await bcrypt.hash(
            "123456",10
        );

        const admin = await Admin.create({
            email:"admin@gmail.com",
            password:hashedPassword,
        });

        return Response.json({
            success:true,
            message:"Admin created successfully",
            admin,
        })

    }catch(error){

        return Response.json(
            {
                success:false,
                message:"Server error"
            }
        );

    }
}
    
