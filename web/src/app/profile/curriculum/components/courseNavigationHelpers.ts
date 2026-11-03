import { cleanPathSegment, getCoursePath as getCoursePathHelper } from '@/lib/translations';

export const getBaseSlug = (slug: string) => {
  return (slug || '').toLowerCase()
    .replace(/-(fr|en|es|de|zh|pt|ar|hi|ur)$/i, '')
    .replace(/-(v\d+|rev\d+)$/i, '')
    .trim();
};

export const getLocalizedCourseDescription = (c: any, lang: string) => {
  if (!c) return '';
  const upper = (lang || 'EN').toUpperCase();
  return c[`description${upper}`] || c.descriptionEN || c.description || '';
};

export const getLocalizedTitle = (c: any, lang: string) => {
  if (!c) return '';
  const upper = (lang || 'EN').toUpperCase();
  return c[`title${upper}`] || c.titleEN || c.title || '';
};

export const getLocalizedSubject = (subj: string, lang: string, getLocalizedLabel: (cat: string, key: string, lang: string) => string) => {
  return getLocalizedLabel('discipline', subj, lang) || subj;
};

export const getCoursePath = (c: any, lang: string) => {
  const slug = c.slug || cleanPathSegment(c.title || '');
  if (slug === 'Statistics' || c.id === 11) {
    return `/L1/Mathematics/Statistics/introduction`;
  }
  return getCoursePathHelper(c.level || 'L1', c.subject || 'General', slug, lang);
};
