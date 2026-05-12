import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET() {
  try {
    const start = startOfMonth(new Date());
    const end = endOfMonth(new Date());

    const [totalOrders, activeCustomers, itemsSold, stockAlerts] = await Promise.all([
      prisma.order.count({
        where: { date: { gte: start, lte: end } }
      }),
      prisma.customer.count(),
      prisma.orderItem.aggregate({
        _sum: { qty: true },
        where: { order: { date: { gte: start, lte: end } } }
      }),
      prisma.sku.count({
        where: { currentStock: { lte: 5 } }
      })
    ]);

    return NextResponse.json({
      totalOrders,
      activeCustomers,
      revenue: (itemsSold._sum.qty || 0) * 1250, // Using sample average order value for prototype
      stockAlerts
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
