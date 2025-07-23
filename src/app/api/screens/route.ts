// app/api/screens/route.ts
import { connection, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Screen from "@/models/Screens";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const { screenName, route } = await req.json();

  if (!screenName || !route) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const newScreen = await Screen.create({ screenName, route });
    return NextResponse.json(newScreen, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const screens = await Screen.find().sort({ createdAt: -1 });
    return NextResponse.json(screens);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch screens" }, { status: 500 });
  }
}