import { NextResponse } from 'next/server';
import { initNeonSchema, isNeonConfigured } from '@/lib/neonClient';

export async function POST() {
  if (!isNeonConfigured()) {
    return NextResponse.json(
      { success: false, message: 'Neon DATABASE_URL is not configured.' },
      { status: 400 }
    );
  }

  const result = await initNeonSchema();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
