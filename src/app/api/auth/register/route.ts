import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const {name, email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }
        await connectToDatabase();
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already registered" }, { status: 400 });
        }

        const newUser = new User({ name ,email, password ,role:'admin'});

        await newUser.save(); 

        return NextResponse.json({ message: "User registered successfully" }, { status: 200 });

    } catch (error) {
        console.error("Register API Error:", error);
        return NextResponse.json({ error: "Failed to register" }, { status: 400 });
    }
}

