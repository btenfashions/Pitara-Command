import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const query = searchParams.get('query') || '';
    const skip = (page - 1) * limit;

    const where: Prisma.SkuWhereInput = query ? {
      OR: [
        { code: { contains: query, mode: 'insensitive' } },
        { product: { name: { contains: query, mode: 'insensitive' } } },
        { product: { category: { contains: query, mode: 'insensitive' } } },
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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
