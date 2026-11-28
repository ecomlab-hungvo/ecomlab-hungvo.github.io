// Content schemas. A build fails if a course or lesson file is missing a required field,
// so a half-filled course can never go live by accident.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const t = z.object({ en: z.string(), vi: z.string() });   // one piece of text in both languages

const courses = defineCollection({
  loader: glob({ pattern: '*/course.json', base: './content/courses' }),
  schema: z.object({
    id: z.string(),
    code: z.string(),
    order: z.number(),
    status: z.enum(['draft', 'published']),
    path: z.string().optional(),               // URL of the course page; default courses/<id>
    level: z.string(),
    duration: t,
    title_en: z.string(), title_vi: z.string(),
    summary_en: z.string(), summary_vi: z.string(),
    page_title_en: z.string().optional(), page_title_vi: z.string().optional(),
    page_desc_en: z.string().optional(), page_desc_vi: z.string().optional(),
    card: z.object({ meta: t, points: z.array(t).default([]) }),
    hero: z.object({
      eyebrow: t, title: t, title_mark: t.optional(), points_lead: t.optional(),
      points: z.array(t).default([]), meta: t.optional()
    }),
    receipt: z.array(z.object({ icon: z.string(), label: t, value: t, plain: z.boolean().optional() })).default([]),
    pack: z.object({
      eyebrow: t, title: t, tag: t,
      items: z.array(z.object({ icon: z.string(), title: t, text: t }))
    }).optional(),
    stats: z.array(z.object({ value: z.string(), label: t })).default([]),
    lessons: z.array(z.object({ n: z.number(), icon: z.string(), title: t, points: z.array(t).default([]) })),
    materials: z.array(z.object({
      title: t, where: t, plain_where: z.boolean().optional(),
      href: z.string().optional(), link: t.optional(), todo: z.string().optional()
    })).default([])
  })
});

const lessons = defineCollection({
  loader: glob({ pattern: '*/lessons/*.{md,mdx}', base: './content/courses' }),
  schema: z.object({
    course: z.string(),
    id: z.string(),                 // unique across the site, used for agenda and "delivered" ticks
    order: z.number(),
    lesson: z.number(),             // which lesson group (Bài 1, 2, 3 …)
    part: z.string(),               // e.g. "1.1"
    path: z.string().optional(),    // URL without .html; default courses/<course>/<file name>
    status: z.enum(['draft', 'published']),
    title_en: z.string(), title_vi: z.string(),
    heading_en: z.string().optional(), heading_vi: z.string().optional(),
    eyebrow_en: z.string().optional(), eyebrow_vi: z.string().optional(),
    lead_en: z.string(), lead_vi: z.string(),
    minutes: z.number(),
    video: z.string().default(''),
    video_title: z.string().optional(),
    draft_note: z.boolean().default(true),
    feedback: z.enum(['part', 'lesson-end', 'none']).default('part'),
    page_title_en: z.string().optional(), page_title_vi: z.string().optional(),
    page_desc_en: z.string().optional(), page_desc_vi: z.string().optional(),
    scripts: z.array(z.string()).default([]),
    legacy_html: z.string().optional()
  })
});

export const collections = { courses, lessons };
