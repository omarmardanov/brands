import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const money = z.object({
  amount: z.number(),
  currency: z.enum(['RUB', 'USD', 'EUR']),
});

const offer = z.object({
  model: z.enum(['franchise', 'master-franchise', 'distribution', 'licensing', 'dealership']),
  format: z.string().nullable().default(null),
  countries: z.array(z.string()).min(1),
  investmentFrom: money,
  investmentTo: money.nullable().default(null),
  lumpSum: money.nullable().default(null),
  royalty: z.string().nullable().default(null),
  marketingFee: z.string().nullable().default(null),
  paybackFrom: z.number().nullable().default(null), // месяцы
  paybackTo: z.number().nullable().default(null),
  requirements: z.array(z.string()).default([]),
  provides: z.array(z.string()).default([]),
  contact: z.string().url().nullable().default(null),
});

const brands = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/brands' }),
  schema: z.object({
    name: z.string(),
    logo: z.string().nullable().default(null),
    industry: z.enum(['food', 'retail', 'services', 'beauty', 'education', 'auto', 'health']),
    origin: z.string(),
    founded: z.number().nullable().default(null),
    website: z.string().url(),
    description: z.string(),
    units: z.number().nullable().default(null),
    holding: z.object({ name: z.string(), url: z.string().url().nullable().default(null) }).nullable().default(null),
    offers: z.array(offer).min(1),
    sources: z.array(z.object({
      url: z.string().url(),
      title: z.string(),
      checked: z.string(), // YYYY-MM-DD
    })).min(1),
  }),
});

export const collections = { brands };
