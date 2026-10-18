import { NextResponse } from 'next/server';
import { getNeonSql, isNeonConfigured, getNeonDatabaseUrl } from '@/lib/neonClient';

export async function GET() {
  const configured = isNeonConfigured();
  if (!configured) {
    return NextResponse.json({
      connected: false,
      configured: false,
      message: 'Neon DATABASE_URL is not set in environment (.env.local). Please set DATABASE_URL to your Neon connection string.'
    });
  }

  const sql = getNeonSql();
  if (!sql) {
    return NextResponse.json({
      connected: false,
      configured: true,
      message: 'Failed to initialize Neon client.'
    });
  }

  try {
    const timeResult = await sql`SELECT NOW() as current_time, version() as pg_version;`;
    
    // Check if edu_resources table exists and get count
    let resourceCount = 0;
    try {
      const countRes = await sql`SELECT count(*)::int as count FROM edu_resources;`;
      resourceCount = countRes[0]?.count || 0;
    } catch {
      // Table might not exist yet
      resourceCount = 0;
    }

    return NextResponse.json({
      connected: true,
      configured: true,
      currentTime: timeResult[0]?.current_time,
      pgVersion: timeResult[0]?.pg_version,
      database: 'Neon PostgreSQL Serverless',
      resourceCount,
      message: 'Connected to Neon PostgreSQL successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      configured: true,
      error: error.message || 'Unknown database error'
    }, { status: 500 });
  }
}
