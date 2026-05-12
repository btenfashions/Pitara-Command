import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { appendOrderToSheet } from '@/lib/google/sheets';

export async function POST() {
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
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        results.failed++;
        results.errors.push(`Order ${order.orderRef}: ${message}`);
        await prisma.order.update({
          where: { id: order.id },
          data: { syncStatus: 'FAILED' }
        });
      }
    }

    return NextResponse.json(results);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
