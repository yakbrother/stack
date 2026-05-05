import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Shared base schema — every wiki page has these fields
const baseSchema = z.object({
  title: z.string(),
  summary: z.string(), // one-sentence description, shown in indexes
  tags: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]), // page titles for See Also
  draft: z.boolean().default(false),
  created: z.coerce.date(),
  updated: z.coerce.date(),
});

export const collections = {
  concepts: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/concepts" }),
    schema: baseSchema,
  }),

  entities: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/entities" }),
    schema: baseSchema,
  }),

  tools: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/tools" }),
    schema: baseSchema,
  }),

  patterns: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/patterns" }),
    schema: baseSchema,
  }),

  sources: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/sources" }),
    schema: baseSchema.extend({
      sourceUrl: z.string().url().optional(),
      sourceAuthor: z.string().optional(),
      sourceDate: z.coerce.date().optional(),
    }),
  }),

  synthesis: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/synthesis" }),
    schema: baseSchema.extend({
      question: z.string(), // the question this synthesis answers
      confidence: z.enum(["high", "medium", "low"]).default("medium"),
    }),
  }),

  sessions: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/sessions" }),
    schema: baseSchema.extend({
      topic: z.string(),
    }),
  }),
};
