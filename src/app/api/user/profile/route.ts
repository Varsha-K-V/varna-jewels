import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/user/User";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET(){
    try{

        await connectDB();

        const userToken = await getUserFromToken();

        if(!userToken){
            return NextResponse.json(
              { message: "Unauthorized" },
              { status: 401 }
            );
        }

        const user = await User.findById(
            userToken.userId
        ).select("-password")

        return NextResponse.json({
           success: true,
           user,
        });

    }catch(error){
        console.log(error);

        return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch profile",
      },
      {
        status: 500,
      }
    );
    }
}

export async function PUT(req: Request) {
  try {

    await connectDB();

    const userToken = await getUserFromToken();

    if (!userToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const {
      name,
      phone,
      address,
      pin,
    } = await req.json();

    const updatedUser = await User.findByIdAndUpdate(
      userToken.userId,
      {
        name,
        phone,
        address,
        pin,
      },
      {
        new: true,
      }
    ).select("-password");

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile",
      },
      {
        status: 500,
      }
    );
  }
}