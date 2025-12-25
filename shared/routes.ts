
import { z } from 'zod';
import { insertImageSchema, images } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  images: {
    list: {
      method: 'GET' as const,
      path: '/api/images',
      responses: {
        200: z.array(z.custom<typeof images.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/images',
      input: insertImageSchema,
      responses: {
        201: z.custom<typeof images.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/images/:id',
      responses: {
        200: z.custom<typeof images.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
