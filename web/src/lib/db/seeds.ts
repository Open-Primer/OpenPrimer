/**
 * @file seeds.ts
 * @description Central mock and seed data definitions.
 * Fully modularized into @/lib/db/seeds_modules/ (<600 LOC per file).
 */

export * from './seeds_modules/seedUsers';
export * from './seeds_modules/seedCourses';
export * from './seeds_modules/seedAcademicAndBadges';
export * from './seeds_modules/seedFeedbackAndCompletions';
export * from './seeds_modules/seedTutorsAndMetrics';
