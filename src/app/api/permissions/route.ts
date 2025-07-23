import { connectToDatabase } from '@/lib/db';
import { NextResponse } from 'next/server';
import Permissions from '@/models/Permissions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await connectToDatabase();
  const { screenId, permissions } = await req.json();

  try {
    const created = await Permissions.create({ screenId, permissions });
    const populated = await created.populate('screenId');
    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create permission' }, { status: 500 });
  }
}

export async function GET() {
  await connectToDatabase();
  try {
    const permissions = await Permissions.find().populate('screenId');
    return NextResponse.json(permissions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

