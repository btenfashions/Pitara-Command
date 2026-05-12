import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        _count: { select: { skus: true } }
      },
      orderBy: { baseCode: 'asc' }
    });
    return NextResponse.json(products);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const product = await prisma.product.create({
      data: {
        baseCode: data.baseCode,
        name: data.name,
        dealer: data.dealer,
        category: data.category,
        mrp: parseFloat(data.mrp),
        cost: data.cost ? parseFloat(data.cost) : null,
      }
    });
    return NextResponse.json(product);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
