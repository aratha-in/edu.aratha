import { NextRequest, NextResponse } from 'next/server';
import { getNeonSql, isNeonConfigured } from '@/lib/neonClient';
import { UserProfile } from '@/types';

export async function GET() {
  if (!isNeonConfigured()) {
    return NextResponse.json({ admins: [], source: 'neon_not_configured' });
  }

  const sql = getNeonSql();
  if (!sql) return NextResponse.json({ admins: [] });

  try {
    const rows = await sql`
      SELECT id, email, name, institution, role, bio, avatar_url, joined_at
      FROM edu_users
      WHERE role = 'admin'
      ORDER BY created_at ASC;
    `;
    return NextResponse.json({ admins: rows, source: 'neon_postgres' });
  } catch (err: any) {
    console.error('Error fetching admins from Neon:', err);
    return NextResponse.json({ admins: [], error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const admin: UserProfile = body.admin;

    if (!admin || !admin.email || !admin.name) {
      return NextResponse.json({ success: false, error: 'Invalid admin payload' }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ success: true, source: 'local_storage_fallback' });
    }

    const sql = getNeonSql();
    if (!sql) return NextResponse.json({ success: false, error: 'Neon client unavailable' }, { status: 500 });

    await sql`
      INSERT INTO edu_users (
        id, email, name, institution, role, bio, avatar_url, joined_at
      ) VALUES (
        ${admin.id},
        ${admin.email.toLowerCase().trim()},
        ${admin.name.trim()},
        ${admin.institution || 'Edu.aratha Governance Board'},
        'admin',
        ${admin.bio || 'Platform Administrator'},
        ${admin.avatarUrl || null},
        ${admin.joinedAt || new Date().toISOString().split('T')[0]}
      )
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        institution = EXCLUDED.institution,
        role = 'admin',
        bio = EXCLUDED.bio;
    `;

    return NextResponse.json({ success: true, source: 'neon_postgres' });
  } catch (err: any) {
    console.error('Error creating admin in Neon:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing admin id' }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ success: true, source: 'local_storage_fallback' });
    }

    const sql = getNeonSql();
    if (!sql) return NextResponse.json({ success: false }, { status: 500 });

    await sql`DELETE FROM edu_users WHERE id = ${id} AND email != 'admin@edu.aratha.org';`;
    return NextResponse.json({ success: true, source: 'neon_postgres' });
  } catch (err: any) {
    console.error('Error deleting admin from Neon:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
