import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './config/taxonomy';

const projects = defineCollection({
  loader: glob({ pattern: '**/index.mdx', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(140),
      category: z.enum(CATEGORY_KEYS),
      // Only shipped or active work exists on the site. There is deliberately no "planned" status.
      status: z.enum(['shipped', 'active']),
      role: z.string(),
      stack: z.array(z.string()),
      started: z.coerce.date(),
      ended: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      links: z
        .object({ live: z.url().optional(), source: z.url().optional() })
        .default({}),
      revisions: z
        .array(z.object({ rev: z.string(), date: z.coerce.date(), note: z.string() }))
        .default([]),
      draft: z.boolean().default(false),
    }),
});

const log = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/log' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projects, log };
