import connectDB from "@/lib/db";
import User from "@/models/user/User";

export async function GET (
    req:Request
){
    try{
        await connectDB();

        const {searchParams}=new URL(req.url);

        const page = Number(searchParams.get("page")) || 1;

        const limit = 5;

        const skip = (page-1)*limit;

        const totalUsers = await User.countDocuments();

        const users = await User.find().
        select("-password")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);
        

        return Response.json({
            users,
            totalPages:Math.ceil(totalUsers/limit),
            currentPage :page,
        });

    }catch(error){
        console.log(error);

        return Response.json(
          { message: "Something went wrong" },
          { status: 500 }
       );
    }
}