import connectDB from "@/lib/db";
import User from "@/models/user/User";
import bcrypt from "bcryptjs";
import Wallet from "@/models/wallet/Wallet";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { name, email, address, phone, pin, password } = await req.json();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return Response.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            address,
            phone,
            pin,
            password: hashedPassword,

        });

        const wallet = await Wallet.create({
            userId: newUser._id,
            balance: 0,
            transactions: [],
        });

        console.log("Wallet Created:", wallet);
        return Response.json(
            {
                message: "User registerd successfully"

            },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);

        return Response.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}