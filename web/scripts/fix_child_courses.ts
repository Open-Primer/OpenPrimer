import './env-loader';
import { supabase } from '../src/lib/supabase';
import { dbService } from '../src/lib/db';

async function fixChildCourses() {
  console.log("🔍 Fetching courses and task queue from Supabase...");
  const { data: courses, error: coursesError } = await dbService.getAllCourses();
  if (coursesError || !courses) {
    console.error("Failed to fetch courses:", coursesError);
    return;
  }

  const { data: tasks, error: tasksError } = await supabase
    .from('task_queue')
    .select('*');
  
  if (tasksError || !tasks) {
    console.error("Failed to fetch task queue:", tasksError);
    return;
  }

  console.log(`Found ${courses.length} courses and ${tasks.length} tasks in database.`);

  const parentToChildren = new Map<string, Set<number>>();

  for (const task of tasks) {
    let extra: any = {};
    try {
      extra = JSON.parse(task.description || '{}');
    } catch (e) {
      continue;
    }

    const parentSlug = extra.parentCurriculumSlug;
    if (!parentSlug) continue;

    // We only care about completed generation tasks, or tasks completed in the past
    if (task.status !== 'completed' && task.status !== 'complete') {
      continue;
    }

    // Find the generated child course in the database
    // Match by title or slug
    const childSlug = task.name.toLowerCase().replace(/ /g, '_');
    const childCourse = courses.find(
      c => c.slug === childSlug || c.title.toLowerCase() === task.name.toLowerCase()
    );

    if (childCourse) {
      console.log(`Found completed task child course: "${childCourse.title}" (ID: ${childCourse.id}) for parent curriculum: "${parentSlug}"`);
      if (!parentToChildren.has(parentSlug)) {
        parentToChildren.set(parentSlug, new Set<number>());
      }
      parentToChildren.get(parentSlug)!.add(childCourse.id);
    } else {
      console.log(`⚠️ Completed task child course "${task.name}" not found in courses table yet.`);
    }
  }

  console.log("\n🛠️ Updating parent curricula child_courses arrays...");
  let updatedCount = 0;

  for (const [parentSlug, childIds] of parentToChildren.entries()) {
    const parentCourse = courses.find(c => c.slug === parentSlug);
    if (!parentCourse) {
      console.warn(`⚠️ Parent curriculum course with slug "${parentSlug}" not found in database.`);
      continue;
    }

    const currentChildren = parentCourse.childCourses || [];
    const mergedChildren = Array.from(new Set([...currentChildren, ...childIds]));

    // Check if we actually need to update
    const needsUpdate = mergedChildren.length !== currentChildren.length || 
                          mergedChildren.some((val, index) => val !== currentChildren[index]);

    if (needsUpdate) {
      console.log(`Updating parent "${parentCourse.title}" (${parentSlug}): [${currentChildren.join(', ')}] ➡️ [${mergedChildren.join(', ')}]`);
      
      const { error } = await dbService.saveCourse({
        ...parentCourse,
        childCourses: mergedChildren
      });

      if (error) {
        console.error(`❌ Failed to update parent "${parentCourse.title}":`, error);
      } else {
        console.log(`✅ Successfully updated parent "${parentCourse.title}"`);
        updatedCount++;
      }
    } else {
      console.log(`ℹ️ Parent "${parentCourse.title}" is already up to date.`);
    }
  }

  console.log(`\n🎉 Done! Updated ${updatedCount} parent curricula associations.`);
}

fixChildCourses().catch(console.error);
