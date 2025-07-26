import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma'; 

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, itemId } = await req.json();

  const availableCopy = await prisma.itemCopy.findFirst({
    where: { itemId, status: 'AVAILABLE' }
  });

  if (!availableCopy) {
    return NextResponse.json({ error: 'No available copies' }, { status: 400 });
  }

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 14); // default 14-day borrowing

  await prisma.itemCopy.update({
    where: { id: availableCopy.id },
    data: { status: 'BORROWED' }
  });

  const borrowing = await prisma.borrowing.create({
    data: {
      userId,
      itemCopyId: availableCopy.id,
      dueDate
    }
  });

  return NextResponse.json({ message: 'Item borrowed', borrowing });
}
