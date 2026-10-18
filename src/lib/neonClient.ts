import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { Resource, UserProfile, UserBookmark, ResearchProject } from '@/types';
import { SEED_RESOURCES } from './data/seedData';

// Retrieves database connection URL from environment variables
export function getNeonDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEXT_PUBLIC_DATABASE_URL
  );
}

// Check if Neon is configured
export function isNeonConfigured(): boolean {
  const url = getNeonDatabaseUrl();
  return Boolean(url && url.startsWith('postgres'));
}

// Get Neon SQL client
export function getNeonSql(): NeonQueryFunction<false, false> | null {
  const url = getNeonDatabaseUrl();
  if (!url) return null;
  return neon(url);
}

/**
 * Initializes Neon PostgreSQL database tables for Edu.aratha
 */
export async function initNeonSchema(): Promise<{ success: boolean; message: string }> {
  const sql = getNeonSql();
  if (!sql) {
    return { success: false, message: 'Neon DATABASE_URL is not configured in environment.' };
  }

  try {
    // 1. Create resources table
    await sql`
      CREATE TABLE IF NOT EXISTS edu_resources (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL,
        description TEXT,
        resource_type VARCHAR(100) NOT NULL,
        subject VARCHAR(200) NOT NULL,
        provider VARCHAR(200) NOT NULL,
        official_url TEXT NOT NULL,
        access_type VARCHAR(100) NOT NULL,
        language VARCHAR(100) DEFAULT 'English',
        licence VARCHAR(200),
        verification_status VARCHAR(50) DEFAULT 'Verified',
        last_verified_at VARCHAR(50),
        is_featured BOOLEAN DEFAULT FALSE,
        india_focus BOOLEAN DEFAULT FALSE,
        tags JSONB DEFAULT '[]'::jsonb,
        metrics JSONB DEFAULT '{"views": 0, "saves": 0}'::jsonb,
        extra_data JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS edu_users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        institution VARCHAR(255),
        role VARCHAR(50) DEFAULT 'researcher',
        bio TEXT,
        avatar_url TEXT,
        joined_at VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Create bookmarks table
    await sql`
      CREATE TABLE IF NOT EXISTS edu_bookmarks (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        resource_id VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'To Read',
        notes TEXT,
        saved_at VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, resource_id)
      );
    `;

    // 4. Create research projects table
    await sql`
      CREATE TABLE IF NOT EXISTS edu_projects (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        topic VARCHAR(255),
        research_questions JSONB DEFAULT '[]'::jsonb,
        saved_resource_ids JSONB DEFAULT '[]'::jsonb,
        notes JSONB DEFAULT '[]'::jsonb,
        tags JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'Planning',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 5. Seed initial resources if table is currently empty
    const countResult = await sql`SELECT count(*)::int as count FROM edu_resources;`;
    const count = countResult[0]?.count || 0;

    if (count === 0) {
      for (const r of SEED_RESOURCES) {
        await sql`
          INSERT INTO edu_resources (
            id, title, slug, description, resource_type, subject, provider,
            official_url, access_type, language, licence, verification_status,
            last_verified_at, is_featured, india_focus, tags, metrics, extra_data
          ) VALUES (
            ${r.id},
            ${r.title},
            ${r.slug},
            ${r.description},
            ${r.resourceType},
            ${r.subject},
            ${r.provider},
            ${r.officialUrl},
            ${r.accessType},
            ${r.language || 'English'},
            ${r.licence || 'Open Access'},
            ${r.verificationStatus},
            ${r.lastVerifiedAt},
            ${r.isFeatured || false},
            ${r.indiaFocus || false},
            ${JSON.stringify(r.tags || [])}::jsonb,
            ${JSON.stringify(r.metrics || { views: 0, saves: 0 })}::jsonb,
            ${JSON.stringify({
              difficulty: r.difficulty,
              duration: r.duration,
              authors: r.authors,
              publicationYear: r.publicationYear,
              doi: r.doi,
              pdfUrl: r.pdfUrl
            })}::jsonb
          ) ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    return { success: true, message: `Neon schema initialized successfully. ${count === 0 ? `Seeded ${SEED_RESOURCES.length} resources.` : `Found ${count} existing resources.`}` };
  } catch (error: any) {
    console.error('Failed to initialize Neon schema:', error);
    return { success: false, message: error.message || 'Error executing Neon SQL schema.' };
  }
}

/**
 * Fetch all resources from Neon Postgres
 */
export async function fetchNeonResources(): Promise<Resource[]> {
  const sql = getNeonSql();
  if (!sql) return [];

  try {
    const rows = await sql`
      SELECT * FROM edu_resources ORDER BY is_featured DESC, created_at DESC;
    `;

    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description,
      resourceType: row.resource_type,
      subject: row.subject,
      provider: row.provider,
      officialUrl: row.official_url,
      accessType: row.access_type,
      language: row.language,
      licence: row.licence,
      verificationStatus: row.verification_status,
      lastVerifiedAt: row.last_verified_at,
      isFeatured: row.is_featured,
      indiaFocus: row.india_focus,
      tags: Array.isArray(row.tags) ? row.tags : [],
      metrics: row.metrics || { views: 0, saves: 0 },
      ...(row.extra_data || {})
    }));
  } catch (err) {
    console.error('Error querying Neon resources:', err);
    return [];
  }
}

/**
 * Insert or update a resource in Neon
 */
export async function upsertNeonResource(r: Resource): Promise<boolean> {
  const sql = getNeonSql();
  if (!sql) return false;

  try {
    await sql`
      INSERT INTO edu_resources (
        id, title, slug, description, resource_type, subject, provider,
        official_url, access_type, language, licence, verification_status,
        last_verified_at, is_featured, india_focus, tags, metrics, extra_data, updated_at
      ) VALUES (
        ${r.id},
        ${r.title},
        ${r.slug},
        ${r.description},
        ${r.resourceType},
        ${r.subject},
        ${r.provider},
        ${r.officialUrl},
        ${r.accessType},
        ${r.language || 'English'},
        ${r.licence || 'Open Access'},
        ${r.verificationStatus},
        ${r.lastVerifiedAt},
        ${r.isFeatured || false},
        ${r.indiaFocus || false},
        ${JSON.stringify(r.tags || [])}::jsonb,
        ${JSON.stringify(r.metrics || { views: 0, saves: 0 })}::jsonb,
        ${JSON.stringify({
          difficulty: r.difficulty,
          duration: r.duration,
          authors: r.authors,
          publicationYear: r.publicationYear,
          doi: r.doi,
          pdfUrl: r.pdfUrl
        })}::jsonb,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
        description = EXCLUDED.description,
        resource_type = EXCLUDED.resource_type,
        subject = EXCLUDED.subject,
        provider = EXCLUDED.provider,
        official_url = EXCLUDED.official_url,
        access_type = EXCLUDED.access_type,
        verification_status = EXCLUDED.verification_status,
        last_verified_at = EXCLUDED.last_verified_at,
        is_featured = EXCLUDED.is_featured,
        india_focus = EXCLUDED.india_focus,
        tags = EXCLUDED.tags,
        metrics = EXCLUDED.metrics,
        extra_data = EXCLUDED.extra_data,
        updated_at = CURRENT_TIMESTAMP;
    `;
    return true;
  } catch (err) {
    console.error('Error upserting resource to Neon:', err);
    return false;
  }
}

/**
 * Delete a resource in Neon
 */
export async function deleteNeonResource(id: string): Promise<boolean> {
  const sql = getNeonSql();
  if (!sql) return false;

  try {
    await sql`DELETE FROM edu_resources WHERE id = ${id};`;
    return true;
  } catch (err) {
    console.error('Error deleting resource from Neon:', err);
    return false;
  }
}
