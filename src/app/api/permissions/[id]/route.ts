import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Permissions from '@/models/Permissions';


export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const { id } = params;
    const { screenId, permissions } = await req.json();

    try {
        const updated = await Permissions.findByIdAndUpdate(
            id,
            { screenId, permissions },
            { new: true }
          ).populate('screenId', 'screenName'); 
          
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
    await connectToDatabase();
    const { id } = params;

    try {
        await Permissions.findByIdAndDelete(id);
        return NextResponse.json({ message: "Screen deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete screen" }, { status: 500 });
    }
}