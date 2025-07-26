// app/api/items/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma'; 

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = body.query;

  if (!query || typeof query !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid query' }, { status: 400 });
  }

  const items = await prisma.item.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { author: { contains: query, mode: 'insensitive' } },
        { publisher: { contains: query, mode: 'insensitive' } }
      ]
    },
    include: {
      copies: {
        where: { status: 'AVAILABLE' }
      }
    }
  });

  return NextResponse.json(items);
}
