import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma'; 

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: 'userId required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      borrowings: true,
      reservations: true,
      fines: true,
      notifications: true,
      readingStats: true
    }
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
