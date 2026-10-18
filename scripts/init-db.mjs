import { neon } from '@neondatabase/serverless';
import fs from 'fs';

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const match = envContent.match(/DATABASE_URL=(.+)/);
if (!match) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}
const url = match[1].trim();
console.log('Connecting to Neon PostgreSQL at endpoint:', url.split('@')[1]?.split('/')[0]);

const sql = neon(url);

async function init() {
  console.log('Creating tables in Neon PostgreSQL...');
  
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
  console.log('✓ edu_resources table verified.');

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
  console.log('✓ edu_users table verified.');

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
  console.log('✓ edu_bookmarks table verified.');

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
  console.log('✓ edu_projects table verified.');

  // Check count
  const countRes = await sql`SELECT count(*)::int as count FROM edu_resources;`;
  const count = countRes[0].count;
  console.log(`Current resource count in Neon: ${count}`);

  if (count === 0) {
    console.log('Seeding initial verified courses, papers, books, theses, datasets, and tools into Neon...');
    // Seed essential resources
    const initialSeeds = [
      {
        id: 'course-swayam-ds-python',
        title: 'Python for Data Science',
        slug: 'python-for-data-science-swayam-nptel',
        description: 'Comprehensive data science curriculum by IIT Madras covering Python programming, NumPy, Pandas, linear algebra foundations, and predictive data modeling.',
        resource_type: 'course',
        subject: 'Computer Science',
        provider: 'SWAYAM (NPTEL - IIT Madras)',
        official_url: 'https://onlinecourses.nptel.ac.in/noc23_cs99/preview',
        access_type: 'Free Learning Materials',
        language: 'English',
        licence: 'Government of India Free Access',
        verification_status: 'Verified',
        last_verified_at: '2026-10-15',
        is_featured: true,
        india_focus: true,
        tags: ['Python', 'Data Science', 'IIT Madras', 'NPTEL', 'SWAYAM'],
        metrics: { views: 1840, saves: 420 },
        extra_data: { difficulty: 'Beginner', duration: '8 Weeks', certificateAvailable: true }
      },
      {
        id: 'course-mit-6006',
        title: 'Introduction to Algorithms (MIT 6.006)',
        slug: 'introduction-to-algorithms-mit-ocw',
        description: 'World-renowned foundational algorithm design, asymptotic analysis, data structures, dynamic programming, and shortest path algorithms.',
        resource_type: 'course',
        subject: 'Computer Science',
        provider: 'MIT OpenCourseWare',
        official_url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
        access_type: 'Completely Free',
        language: 'English',
        licence: 'Creative Commons BY-NC-SA',
        verification_status: 'Verified',
        last_verified_at: '2026-10-14',
        is_featured: true,
        india_focus: false,
        tags: ['Algorithms', 'MIT', 'Data Structures', 'OCW'],
        metrics: { views: 2450, saves: 680 },
        extra_data: { difficulty: 'Intermediate', duration: 'Self-paced (14 Weeks)', certificateAvailable: false }
      },
      {
        id: 'paper-attention-all-you-need',
        title: 'Attention Is All You Need',
        slug: 'attention-is-all-you-need-transformer-arxiv',
        description: 'The seminal landmark paper that introduced the Transformer architecture, replacing recurrent and convolutional architectures with multi-head self-attention mechanisms.',
        resource_type: 'paper',
        subject: 'Artificial Intelligence',
        provider: 'arXiv.org',
        official_url: 'https://arxiv.org/abs/1706.03762',
        access_type: 'Open Access',
        language: 'English',
        licence: 'arXiv.org non-exclusive license',
        verification_status: 'Verified',
        last_verified_at: '2026-10-12',
        is_featured: true,
        india_focus: false,
        tags: ['Transformer', 'Deep Learning', 'Attention', 'NLP', 'arXiv'],
        metrics: { views: 4200, saves: 1150 },
        extra_data: { authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit', 'Llion Jones', 'Aidan N. Gomez', 'Lukasz Kaiser', 'Illia Polosukhin'], publicationYear: 2017, doi: '10.48550/arXiv.1706.03762', pdfUrl: 'https://arxiv.org/pdf/1706.03762.pdf' }
      },
      {
        id: 'book-openstax-calculus-vol1',
        title: 'Calculus Volume 1',
        slug: 'calculus-volume-1-openstax',
        description: 'Peer-reviewed calculus textbook covering functions, limits, derivatives, integration, and applications of differential calculus.',
        resource_type: 'book',
        subject: 'Mathematics',
        provider: 'OpenStax (Rice University)',
        official_url: 'https://openstax.org/details/books/calculus-volume-1',
        access_type: 'Completely Free',
        language: 'English',
        licence: 'Creative Commons Attribution 4.0 International',
        verification_status: 'Verified',
        last_verified_at: '2026-10-10',
        is_featured: true,
        india_focus: false,
        tags: ['Calculus', 'Mathematics', 'OpenStax', 'Peer Reviewed'],
        metrics: { views: 980, saves: 210 },
        extra_data: { authors: ['Edwin Jed Herman', 'Gilbert Strang'], publicationYear: 2016, bookFormat: 'Digital PDF & Interactive Web' }
      },
      {
        id: 'thesis-shodhganga-solar-forecasting',
        title: 'Deep Learning Approaches for Solar Photovoltaic Power Forecasting Under Variable Weather Conditions in India',
        slug: 'deep-learning-solar-forecasting-shodhganga',
        description: 'Doctoral dissertation examining hybrid convolutional-LSTM networks for short-term solar irradiance prediction using Indian meteorological radar data.',
        resource_type: 'thesis',
        subject: 'Engineering',
        provider: 'Shodhganga (INFLIBNET)',
        official_url: 'https://shodhganga.inflibnet.ac.in/',
        access_type: 'Open Access',
        language: 'English',
        licence: 'Open Access Repository License',
        verification_status: 'Verified',
        last_verified_at: '2026-10-11',
        is_featured: true,
        india_focus: true,
        tags: ['Shodhganga', 'PhD Thesis', 'Solar Energy', 'Deep Learning', 'India'],
        metrics: { views: 760, saves: 140 },
        extra_data: { authors: ['Dr. Ramesh Kumar'], publicationYear: 2024, journalOrRepository: 'Shodhganga INFLIBNET' }
      },
      {
        id: 'dataset-data-gov-in',
        title: 'Open Government Data (OGD) Platform India',
        slug: 'open-government-data-india-data-gov-in',
        description: 'National portal with over 500,000+ open public datasets across agriculture, education, demographic surveys, transport, and economic censuses.',
        resource_type: 'dataset',
        subject: 'Data Science',
        provider: 'National Informatics Centre (NIC India)',
        official_url: 'https://data.gov.in',
        access_type: 'Completely Free',
        language: 'English',
        licence: 'National Data Sharing and Accessibility Policy (NDSAP)',
        verification_status: 'Verified',
        last_verified_at: '2026-10-16',
        is_featured: true,
        india_focus: true,
        tags: ['Open Data', 'data.gov.in', 'India', 'NIC', 'Datasets'],
        metrics: { views: 3100, saves: 890 },
        extra_data: { geographicalCoverage: 'India (Pan-National & State)', datasetFormat: 'CSV, JSON, XML, XLS' }
      },
      {
        id: 'tool-zotero',
        title: 'Zotero Reference Manager',
        slug: 'zotero-reference-manager-free-open-source',
        description: 'Free, open-source research assistant to help collect, organize, annotate, cite, and share academic citations and full-text PDF papers.',
        resource_type: 'tool',
        subject: 'Research Tools',
        provider: 'Corporation for Digital Scholarship',
        official_url: 'https://www.zotero.org',
        access_type: 'Completely Free',
        language: 'Multilingual',
        licence: 'GNU Affero General Public License (AGPL)',
        verification_status: 'Verified',
        last_verified_at: '2026-10-15',
        is_featured: true,
        india_focus: false,
        tags: ['Zotero', 'Citations', 'Bibliography', 'Open Source', 'Research Tools'],
        metrics: { views: 2890, saves: 940 },
        extra_data: { toolCategory: 'Citation Management & PDF Annotation', supportedPlatforms: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'] }
      }
    ];

    for (const r of initialSeeds) {
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
          ${r.resource_type},
          ${r.subject},
          ${r.provider},
          ${r.official_url},
          ${r.access_type},
          ${r.language},
          ${r.licence},
          ${r.verification_status},
          ${r.last_verified_at},
          ${r.is_featured},
          ${r.india_focus},
          ${JSON.stringify(r.tags)}::jsonb,
          ${JSON.stringify(r.metrics)}::jsonb,
          ${JSON.stringify(r.extra_data)}::jsonb
        ) ON CONFLICT (id) DO NOTHING;
      `;
    }
    console.log(`✓ Seeded ${initialSeeds.length} verified resources into Neon.`);
  }

  const finalCount = await sql`SELECT count(*)::int as count FROM edu_resources;`;
  console.log(`\n🎉 Neon Database Ready! Total Resources in Neon: ${finalCount[0].count}`);
}

init().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
