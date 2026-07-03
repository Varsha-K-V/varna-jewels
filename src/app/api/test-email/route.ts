import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/sendEmail";

export async function GET() {
    await sendEmail(
        "varshakvas@gmail.com",
        "Testing Email",
        "<h1>Hello from Varna Jewels!</h1>"
    );

     return NextResponse.json({
        success:true,
        message:"Email sent successfully",
    });
}