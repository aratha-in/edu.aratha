import { NextRequest, NextResponse } from 'next/server';
import { getNeonSql, isNeonConfigured } from '@/lib/neonClient';

export async function POST(req: NextRequest) {
  try {
    const { email, code, user } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ success: false, error: 'Missing email or code' }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ success: true, source: 'local_storage_fallback' });
    }

    const sql = getNeonSql();
    if (!sql) return NextResponse.json({ success: false }, { status: 500 });

    // Ensure columns exist in Neon
    await sql`
      ALTER TABLE edu_users 
      ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS verification_otp VARCHAR(20);
    `;

    // Upsert pending user with OTP code
    if (user) {
      await sql`
        INSERT INTO edu_users (
          id, email, name, institution, role, bio, email_verified, verification_otp
        ) VALUES (
          ${user.id || `usr-${Date.now()}`},
          ${email.toLowerCase().trim()},
          ${user.name || 'Scholar'},
          ${user.institution || 'Independent Researcher'},
          ${user.role || 'researcher'},
          ${user.bio || 'Academic Scholar'},
          FALSE,
          ${code}
        )
        ON CONFLICT (email) DO UPDATE SET
          verification_otp = EXCLUDED.verification_otp,
          email_verified = FALSE;
      `;
    }

    return NextResponse.json({ success: true, message: 'Verification OTP registered in Neon.' });
  } catch (err: any) {
    console.error('Error storing OTP in Neon:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
