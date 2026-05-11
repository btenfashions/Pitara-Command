import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appendOrderToSheet } from '@/lib/google/sheets';

export async function POST(req: NextRequest) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID not configured');
    }

    const pendingOrders = await prisma.order.findMany({
      where: { syncStatus: 'PENDING', status: 'CONFIRMED' },
      include: {
        customer: true,
        items: { include: { sku: true } }
      }
    });

    const results = { synced: 0, failed: 0, errors: [] as string[] };

    for (const order of pendingOrders) {
      try {
        await appendOrderToSheet(spreadsheetId, order);
        await prisma.order.update({
          where: { id: order.id },
          data: { syncStatus: 'SYNCED' }
        });
        results.synced++;
      } catch (err: any) {
        results.failed++;
        results.errors.push(`Order ${order.orderRef}: ${err.message}`);
        await prisma.order.update({
          where: { id: order.id },
          data: { syncStatus: 'FAILED' }
        });
      }
    }

    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
