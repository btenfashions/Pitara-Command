import { NextRequest, NextResponse } from 'next/server';
import { anthropic } from '@/lib/anthropic';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const msg = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4096,
      system: `You are an expert order parser for Pitara, a fashion boutique.
      Extract order details from WhatsApp text. Return a JSON array of orders.
      If there are multiple orders in the text, return them all.

      Fields for each order:
      - customerName: string
      - phoneNumber: string (10 digits)
      - designCode: string (Normalize to uppercase)
      - size: string
      - fullAddress: string (Proper title case)
      - pincode: string
      - city: string
      - state: string
      - senderName: string (optional)
      - senderPhone: string (optional)
      - flags: string (any special instructions or notes)

      Only return the JSON array, no other text.`,
      messages: [{ role: "user", content: text }],
    });

    const content = msg.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response format from Claude');
    }

    const parsedOrders = JSON.parse(content.text);

    return NextResponse.json(parsedOrders);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Parsing error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
