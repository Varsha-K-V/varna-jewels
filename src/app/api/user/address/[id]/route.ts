import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Address from "@/models/user/Address";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function DELETE(
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

    await Address.findOneAndDelete({
      _id: id,
      userId: userToken.userId,
    });

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete address",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
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

    const body = await req.json();

    const updatedAddress =
      await Address.findOneAndUpdate(
        {
          _id: id,
          userId: userToken.userId,
        },
        body,
        {
          new: true,
        }
      );

    return NextResponse.json({
      success: true,
      address: updatedAddress,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update address",
      },
      {
        status: 500,
      }
    );
  }
}