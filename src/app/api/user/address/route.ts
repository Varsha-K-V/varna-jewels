export const dynamic = "force-dynamic";
import connectDB from "@/lib/db";
import { NextRequest,NextResponse } from "next/server";
import { getUserFromToken } from "@/lib/getUserFromToken";
import Address from "@/models/user/Address";

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

    const addresses = await Address.find({
      userId: userToken.userId,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      addresses,
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch addresses",
      },
      {
        status: 500,
      }
    );
  }
}

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

    const {
      fullName,
      phone,
      addressLine,
      city,
      state,
      pinCode,
    } = await req.json();

    const address = await Address.create({
      userId: userToken.userId,
      fullName,
      phone,
      addressLine,
      city,
      state,
      pinCode,
    });

    return NextResponse.json({
      success: true,
      address,
      message: "Address added successfully",
    });

  } catch (error) {

    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to add address",
      },
      {
        status: 500,
      }
    );
  }
}