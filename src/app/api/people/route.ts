import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { subDays } from 'date-fns';

export async function GET() {
  try {
    const churnThreshold = subDays(new Date(), 60);

    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          orderBy: { date: 'desc' },
        }
      }
    });

    const stats = customers.map(c => {
      const orderCount = c.orders.length;
      const lastOrderDate = c.orders[0]?.date;
      const isChurnWatch = orderCount >= 2 && lastOrderDate < churnThreshold;

      return {
        ...c,
        orderCount,
        lastOrderDate,
        isChurnWatch
      };
    }).sort((a, b) => b.orderCount - a.orderCount);

    return NextResponse.json(stats);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
