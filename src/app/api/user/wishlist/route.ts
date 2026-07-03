import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Wishlist from "@/models/wishlist/Wishlist";
import { getUserFromToken } from "@/lib/getUserFromToken";

export async function GET() {

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

        const wishlist = await Wishlist.find({
            userId: userToken.userId,
        })
            .populate({
                path: "productId",
                populate: {
                    path: "category",
                    select: "name",
                },
            })
            .sort({
                createdAt: -1,
            });

        return NextResponse.json(
            {
                success: true,
                wishlist,
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.log(error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch wishlist.",
            },
            {
                status: 500,
            }
        );

    }

}

import Product from "@/models/product/Product";

export async function POST(req: Request) {
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

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    
    const existingWishlist = await Wishlist.findOne({
      userId: userToken.userId,
      productId,
    });

    if (existingWishlist) {
      return NextResponse.json(
        {
          success: false,
          message: "Product already in wishlist.",
        },
        {
          status: 400,
        }
      );
    }

    await Wishlist.create({
      userId: userToken.userId,
      productId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Added to wishlist.",
      },
      {
        status: 201,
      }
    );

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add wishlist item.",
      },
      {
        status: 500,
      }
    );

  }
}