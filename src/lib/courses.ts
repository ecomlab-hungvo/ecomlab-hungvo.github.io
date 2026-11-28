// Course and lesson helpers shared by every page template.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Course = CollectionEntry<'courses'>;
export type Lesson = CollectionEntry<'lessons'>;

const isLive = (status: string) => status === 'published' || import.meta.env.DEV;   // drafts show while previewing locally

export async function courses(): Promise<Course[]> {
  return (await getCollection('courses', c => isLive(c.data.status))).sort((a, b) => a.data.order - b.data.order);
}

export async function lessonsOf(courseId: string): Promise<Lesson[]> {
  return (await getCollection('lessons', l => l.data.course === courseId && isLive(l.data.status)))
    .sort((a, b) => a.data.order - b.data.order);
}

// URL paths (no leading slash, no .html)
export const coursePath = (c: Course) => c.data.path ?? `courses/${c.data.id}`;
export const lessonPath = (l: Lesson) => l.data.path ?? `courses/${l.data.course}/${l.id.split('/').pop()}`;
export const href = (p: string) => `/${p}.html`;

// Agenda groups for assets/js/agenda.js
export function agenda(course: Course, lessons: Lesson[]) {
  return {
    home: href(coursePath(course)),
    groups: course.data.lessons.map(g => ({
      en: g.title.en, vi: g.title.vi,
      parts: lessons.filter(l => l.data.lesson === g.n).map(l => ({
        id: l.data.id, num: l.data.part, href: href(lessonPath(l)), en: l.data.title_en, vi: l.data.title_vi
      }))
    }))
  };
}

// Minutes per lesson group, for "Lesson 1 · 3 parts · 33 min"
export function groupStats(lessons: Lesson[], n: number) {
  const parts = lessons.filter(l => l.data.lesson === n);
  return { count: parts.length, minutes: parts.reduce((s, l) => s + l.data.minutes, 0), first: parts[0] };
}
