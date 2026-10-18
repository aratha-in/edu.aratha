import { NextRequest, NextResponse } from 'next/server';
import {
  fetchNeonResources,
  upsertNeonResource,
  deleteNeonResource,
  isNeonConfigured
} from '@/lib/neonClient';
import { SEED_RESOURCES } from '@/lib/data/seedData';
import { Resource } from '@/types';

export async function GET() {
  if (!isNeonConfigured()) {
    return NextResponse.json({
      source: 'seed_local',
      resources: SEED_RESOURCES,
      neonConnected: false
    });
  }

  const resources = await fetchNeonResources();
  if (resources.length === 0) {
    return NextResponse.json({
      source: 'seed_fallback',
      resources: SEED_RESOURCES,
      neonConnected: true
    });
  }

  return NextResponse.json({
    source: 'neon_postgres',
    resources,
    neonConnected: true
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const resource: Resource = body.resource;
    if (!resource || !resource.id || !resource.title) {
      return NextResponse.json({ success: false, error: 'Invalid resource payload' }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({
        success: true,
        source: 'local_storage_fallback',
        message: 'Neon not configured, resource saved in client storage.'
      });
    }

    const ok = await upsertNeonResource(resource);
    return NextResponse.json({ success: ok, source: 'neon_postgres' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing resource id' }, { status: 400 });
    }

    if (!isNeonConfigured()) {
      return NextResponse.json({ success: true, source: 'local_storage_fallback' });
    }

    const ok = await deleteNeonResource(id);
    return NextResponse.json({ success: ok, source: 'neon_postgres' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
