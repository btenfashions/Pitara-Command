import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

interface SyncOrder {
  orderRef: string;
  customer: {
    name: string | null;
    phone: string;
    fullAddress: string | null;
    city: string | null;
    state: string | null;
    pincode: string | null;
  };
  items: {
    sku: {
      code: string;
      size: string;
    };
  }[];
  senderName: string | null;
  senderPhone: string | null;
}

export async function appendOrderToSheet(spreadsheetId: string, order: SyncOrder) {
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Shipping Log!A:M',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toISOString(),
          order.orderRef,
          order.customer.name,
          order.customer.phone,
          order.items.map((i) => i.sku.code).join('\n'),
          order.items.map((i) => i.sku.size).join('\n'),
          order.customer.fullAddress,
          order.customer.city,
          order.customer.state,
          order.customer.pincode,
          order.senderName,
          order.senderPhone,
          'Confirmed'
        ]],
      },
    });
    return response.data;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Google Sheets sync error:', message);
    throw error;
  }
}
