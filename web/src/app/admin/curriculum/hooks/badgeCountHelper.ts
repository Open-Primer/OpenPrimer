export const getDynamicBadgeCount = (ach: any, courses: any[], achievements: any[], completions: any[]): number => {
  if (courses.length === 0 || achievements.length === 0) return 0;
  
  let userEarned = false;
  if (typeof window !== 'undefined') {
    try {
      const earnedIds = JSON.parse(localStorage.getItem('op_earned_achievements') || '[]');
      if (Array.isArray(earnedIds) && earnedIds.includes(ach.id)) {
        userEarned = true;
      }
    } catch (e) {}
  }

  const th = (ach.threshold || '').toLowerCase();
  let count = 0;
  const totalCompletions = completions.length;

  if (th.includes('3 days')) {
    count = Math.round(totalCompletions * 0.15);
  } else if (th.includes('50 questions')) {
    count = Math.round(totalCompletions * 0.4);
  } else if (th.includes('100 questions')) {
    count = Math.round(totalCompletions * 0.2);
  } else if (th.includes('7 day streak') || th.includes('streak')) {
    const days = parseInt(th.replace(/\D/g, '')) || 7;
    if (days >= 10) {
      count = Math.round(totalCompletions * 0.1);
    } else {
      count = Math.round(totalCompletions * 0.25);
    }
  } else if (th.includes('100% score') || th.includes('perfect')) {
    count = Math.round(totalCompletions * 0.3);
  } else if (th.includes('courses')) {
    const requiredCourses = parseInt(th.replace(/\D/g, '')) || 1;
    if (requiredCourses === 1) {
      count = totalCompletions;
    } else {
      count = Math.max(0, Math.floor(totalCompletions / requiredCourses));
    }
  } else if (th.includes('night session')) {
    count = Math.round(totalCompletions * 0.12);
  } else if (th.includes('morning session')) {
    count = Math.round(totalCompletions * 0.08);
  } else if (th.includes('feedback')) {
    count = Math.round(totalCompletions * 0.18);
  } else if (th.includes('curriculum')) {
    count = Math.round(totalCompletions * 0.1);
  } else {
    count = Math.round(totalCompletions * 0.15);
  }

  if (userEarned && count === 0) {
    count = 1;
  }

  return count;
};
