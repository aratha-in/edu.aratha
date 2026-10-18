import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://edu.aratha.org';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/*',
          '/api/neon/*',
          '/api/auth/*',
          '/dashboard',
          '/verify-email',
        ],
      },
      {
        userAgent: [
          'GPTBot',
          'PerplexityBot',
          'ClaudeBot',
          'Google-Extended',
          'Bingbot',
          'Applebot-Extended',
          'CCBot',
          'cohere-ai',
        ],
        allow: [
          '/',
          '/courses',
          '/courses/*',
          '/research',
          '/research/*',
          '/citation-generator',
          '/learning-paths',
          '/learning-paths/*',
          '/books',
          '/theses',
          '/datasets',
          '/journals',
          '/tools',
          '/about',
          '/llms.txt',
          '/llms-full.txt',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/api/*',
          '/dashboard',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
