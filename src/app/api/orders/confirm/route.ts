import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export async function POST(req: NextRequest) {
  try {
    const { orders, operator } = await req.json();

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json({ error: 'No orders provided' }, { status: 400 });
    }

    const results = await prisma.$transaction(async (tx) => {
      const confirmedOrders = [];

      for (const orderData of orders) {
        // 1. Find or Create Customer
        const customer = await tx.customer.upsert({
          where: { phone: orderData.phoneNumber },
          update: {
            name: orderData.customerName,
            fullAddress: orderData.fullAddress,
            pincode: orderData.pincode,
            city: orderData.city,
            state: orderData.state,
          },
          create: {
            phone: orderData.phoneNumber,
            name: orderData.customerName,
            fullAddress: orderData.fullAddress,
            pincode: orderData.pincode,
            city: orderData.city,
            state: orderData.state,
          },
        });

        // 2. Generate Order Reference (Atomic)
        const dateStr = format(new Date(), 'yyyyMMdd');
        const sequence = await tx.orderSequence.upsert({
          where: { date: dateStr },
          update: { count: { increment: 1 } },
          create: { date: dateStr, count: 1 },
        });
        const orderRef = `CMD-${dateStr}-${sequence.count}`;

        // 3. Create Order
        const order = await tx.order.create({
          data: {
            orderRef,
            customerId: customer.id,
            status: 'CONFIRMED',
            senderName: orderData.senderName,
            senderPhone: orderData.senderPhone,
            notes: orderData.flags,
            items: {
              create: await resolveOrderItems(tx, orderData.designCode, orderData.size)
            }
          },
          include: {
            items: {
              include: { sku: true }
            }
          }
        });

        // 4. Update Reservations
        for (const item of order.items) {
          await tx.sku.update({
            where: { id: item.skuId },
            data: {
              reservedStock: { increment: item.qty }
            }
          });
        }

        confirmedOrders.push(order);
      }

      return confirmedOrders;
    });

    return NextResponse.json({ success: true, count: results.length, orders: results });
  } catch (error: any) {
    console.error('Confirmation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function resolveOrderItems(tx: any, codes: string, sizes: string) {
  const codeLines = codes.split('\n').filter(Boolean);
  const sizeLines = sizes.split('\n').filter(Boolean);
  const items = [];

  for (let i = 0; i < codeLines.length; i++) {
    const code = codeLines[i].trim();
    const size = sizeLines[i]?.trim() || sizeLines[0]?.trim() || '';
    const fullSku = `${code}${size}`;

    let sku = await tx.sku.findUnique({
      where: { code: fullSku }
    });

    if (!sku) {
       sku = await tx.sku.findFirst({
        where: { code: { startsWith: code } }
      });
    }

    if (sku) {
      items.push({
        skuId: sku.id,
        qty: 1,
        status: 'RESERVED'
      });
    }
  }
  return items;
}
