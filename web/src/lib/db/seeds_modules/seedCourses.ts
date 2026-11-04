import { MockCourse } from '../types';
import { mockCoursesPart1 } from './seedCourses1';
import { mockCoursesPart2 } from './seedCourses2';

export const mockCourses: MockCourse[] = [
  ...mockCoursesPart1,
  ...mockCoursesPart2
];
