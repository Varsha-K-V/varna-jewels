import connectDB from "@/lib/db";
import User from "@/models/user/User";

export async function PUT(
    req:Request,
    {
        params,
    }:{
        params:Promise <{id:string}>;
    }
){
    try{
        await connectDB();

        const {id} = await params;

        await User.findByIdAndUpdate(id,{
            isBlocked :false,
        });

        return Response.json({
            message :"User unblocked successfully",
        });

    }catch(error){
        console.log(error);

        return Response.json(
            {message:"Something went wrong"},
            {status:500}
        );
    }
}