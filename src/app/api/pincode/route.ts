import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const pin = searchParams.get('pin');

  if (!pin || pin.length !== 6) {
    return NextResponse.json({ error: 'Invalid pincode' }, { status: 400 });
  }

  try {
    // In the legacy code, this used a lookup against a sheet or service.
    // For now, we'll proxy it or provide a placeholder that returns city/state.
    // Replace with your real pincode database logic if available.
    const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = await res.json();

    if (data[0].Status === "Success") {
      const first = data[0].PostOffice[0];
      return NextResponse.json({
        serviceable: true,
        city: first.District,
        state: first.State,
      });
    }

    return NextResponse.json({ serviceable: false });
  } catch {
    return NextResponse.json({ serviceable: false }, { status: 500 });
  }
}
