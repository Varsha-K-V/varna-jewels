import connectDB from "@/lib/db";
import Admin from "@/models/admin/Admin";
import bcrypt from "bcryptjs";

export async function POST (req:Request){
    try{

        await connectDB();

        const {email,password} = await req.json();

        const admin = await Admin.findOne({email});

        if(!admin){
            return Response.json({
                success:false,
                message:"Invalid email"
            });
        }

        const isMatch = await bcrypt.compare(password,admin.password);

        if(!isMatch){
            return Response.json({
                success :false,
                message : "Invalid Password"
            })
        }

        return Response.json({
            status:200,
            success:true,
            message:"Login successfull",     
        })

    }catch(error){

        console.log(error);

        return Response.json({
            success :false,
            message :"Server Error"
        })

    }
}