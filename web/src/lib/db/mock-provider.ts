import { DatabaseService } from './types';
import { mockCoursesLessonsMethods } from './mock/mock-courses-lessons';
import { mockUsersProgressMethods } from './mock/mock-users-progress';
import { mockModerationAdminMethods } from './mock/mock-moderation-admin';
import { mockCatalogTelemetryMethods } from './mock/mock-catalog-telemetry';

export const mockDatabaseProvider: DatabaseService = {
  ...mockCoursesLessonsMethods,
  ...mockUsersProgressMethods,
  ...mockModerationAdminMethods,
  ...mockCatalogTelemetryMethods,
};
