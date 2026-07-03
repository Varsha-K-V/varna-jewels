import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Address from "@/models/user/Address";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    console.log("Received ID:", id);

    await Address.updateMany(
      {
        userId: userToken.userId,
      },
      {
        isDefault: false,
      }
    );

    await Address.findByIdAndUpdate(
      id,
      {
        isDefault: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Default address updated",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update default address",
      },
      {
        status: 500,
      }
    );
  }
}