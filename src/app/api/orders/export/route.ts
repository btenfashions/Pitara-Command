import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { orderIds } = await req.json();

    const orders = await prisma.order.findMany({
      where: {
        id: { in: orderIds },
        status: 'CONFIRMED',
      },
      include: {
        customer: true,
        items: {
          include: { sku: true }
        }
      }
    });

    if (orders.length === 0) {
      return NextResponse.json({ error: 'No confirmed orders found to export' }, { status: 404 });
    }

    const header = ['Order Ref', 'Customer Name', 'Phone', 'Address', 'City', 'State', 'Pincode', 'Weight', 'Design Code', 'Size'];
    const rows = orders.map(o => [
      o.orderRef,
      o.customer.name || '',
      o.customer.phone,
      o.customer.fullAddress?.replace(/,/g, ' ') || '',
      o.customer.city || '',
      o.customer.state || '',
      o.customer.pincode || '',
      o.totalWeight || '500',
      o.items.map(i => i.sku.code).join('|'),
      o.items.map(i => i.sku.size).join('|')
    ]);

    const csvContent = [header, ...rows].map(r => r.join(',')).join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="DTDC_Export_${new Date().toISOString().slice(0,10)}.csv"`,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
