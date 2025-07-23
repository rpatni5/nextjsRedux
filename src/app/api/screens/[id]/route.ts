import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Screen from "@/models/Screens";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  const { screenName, route } = await req.json();

  try {
    const updatedScreen = await Screen.findByIdAndUpdate(
      id,
      { screenName, route },
      { new: true }
    );
    return NextResponse.json(updatedScreen);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update screen" }, { status: 500 });
  }
}


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const { id } = params;
  
    try {
      await Screen.findByIdAndDelete(id);
      return NextResponse.json({ message: "Screen deleted" });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete screen" }, { status: 500 });
    }
  }
  