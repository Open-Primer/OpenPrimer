import { DatabaseService } from './types';
import {
  purgeOrphanedCourseMedia,
  performCascadeCourseDeletion,
  supabaseCoursesLessonsMethods,
} from './supabase/supabase-courses-lessons';
import { supabaseUsersProgressMethods } from './supabase/supabase-users-progress';
import { supabaseEnrollmentReportsMethods } from './supabase/supabase-enrollment-reports';
import { supabaseModerationFeedbackMethods } from './supabase/supabase-moderation-feedback';
import { supabaseCatalogBacklogMethods } from './supabase/supabase-catalog-backlog';
import { supabaseTutorsTelemetryMethods } from './supabase/supabase-tutors-telemetry';

export { purgeOrphanedCourseMedia, performCascadeCourseDeletion };

export const supabaseDatabaseProvider: DatabaseService = {
  ...supabaseCoursesLessonsMethods,
  ...supabaseUsersProgressMethods,
  ...supabaseEnrollmentReportsMethods,
  ...supabaseModerationFeedbackMethods,
  ...supabaseCatalogBacklogMethods,
  ...supabaseTutorsTelemetryMethods,
};
