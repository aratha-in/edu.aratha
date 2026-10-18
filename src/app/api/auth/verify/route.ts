import { NextRequest, NextResponse } from 'next/server';
import { getNeonSql, isNeonConfigured } from '@/lib/neonClient';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Missing email' }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ success: true, source: 'local_storage_fallback' });
    }

    const sql = getNeonSql();
    if (!sql) return NextResponse.json({ success: false }, { status: 500 });

    await sql`
      UPDATE edu_users 
      SET email_verified = TRUE, verification_otp = NULL 
      WHERE email = ${email.toLowerCase().trim()};
    `;

    return NextResponse.json({ success: true, message: 'User email marked as verified in Neon.' });
  } catch (err: any) {
    console.error('Error verifying email in Neon:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
