import { PrismaClient } from '@prisma/client';
import { google } from 'googleapis';

const prisma = new PrismaClient();

async function migrate() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || '{}'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  console.log('Fetching SKUs from Google Sheets...');
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'SKU Master!A2:H10001', // Example range
  });

  const rows = res.data.values || [];
  console.log(`Found ${rows.length} SKUs. Starting migration...`);

  for (const row of rows) {
    const [code, name, dealer, colour, category, mrp, cost, notes] = row;
    if (!code) continue;

    const baseCode = code.substring(0, code.length - 2);
    const size = code.substring(code.length - 2);

    try {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.upsert({
          where: { baseCode },
          update: { name, dealer, colour, category, mrp: parseFloat(mrp) || 0, cost: parseFloat(cost) || null, notes },
          create: { baseCode, name, dealer, colour, category, mrp: parseFloat(mrp) || 0, cost: parseFloat(cost) || null, notes },
        });

        await tx.sku.upsert({
          where: { code },
          update: { size, productId: product.id },
          create: { code, size, productId: product.id },
        });
      });
    } catch (e) {
      console.error(`Error migrating SKU ${code}:`, e);
    }
  }

  console.log('Migration complete!');
}

migrate()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
