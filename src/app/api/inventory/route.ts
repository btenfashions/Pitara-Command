import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const query = searchParams.get('query') || '';
    const skip = (page - 1) * limit;

    const where = query ? {
      OR: [
        { code: { contains: query, mode: 'insensitive' as any } },
        { product: { name: { contains: query, mode: 'insensitive' as any } } },
        { product: { category: { contains: query, mode: 'insensitive' as any } } },
      ]
    } : {};

    const [skus, total] = await Promise.all([
      prisma.sku.findMany({
        where,
        include: {
          product: true,
        },
        skip,
        take: limit,
        orderBy: { code: 'asc' },
      }),
      prisma.sku.count({ where }),
    ]);

    return NextResponse.json({
      skus,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
