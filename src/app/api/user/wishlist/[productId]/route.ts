import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Wishlist from "@/models/wishlist/Wishlist";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
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

    const { productId } = await params;

    const deletedWishlist = await Wishlist.findOneAndDelete({
      userId: userToken.userId,
      productId,
    });

    if (!deletedWishlist) {
      return NextResponse.json(
        {
          success: false,
          message: "Wishlist item not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Removed from wishlist.",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove wishlist item.",
      },
      {
        status: 500,
      }
    );

  }
}