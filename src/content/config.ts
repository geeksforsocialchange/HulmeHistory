import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const events = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './public/events' }),
  schema: z.object({
    start: z.number(),
    end: z.number().optional(),
    title: z.string(),
    desc: z.string().optional(),
    author: z.string().optional(),
    timeline: z.enum(['buildings', 'community', 'news']).optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
  }),
});

export const collections = { events };
