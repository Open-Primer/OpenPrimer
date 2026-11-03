import React from 'react';
import { Sparkles, Bookmark, Globe, CheckCircle, GraduationCap } from 'lucide-react';

export const getQuickActions = (t: any) => [
  { label: t.give_example, icon: <Sparkles className="w-3 h-3" />, prompt: t.give_example_prompt },
  { label: t.tell_story, icon: <Bookmark className="w-3 h-3" />, prompt: t.tell_story_prompt },
  { label: t.simplify, icon: <Globe className="w-3 h-3" />, prompt: t.simplify_prompt },
  { label: t.test_me, icon: <CheckCircle className="w-3 h-3" />, prompt: t.test_me_prompt },
];

export const getDashboardQuickActions = (tls: any) => [
  {
    label: tls.dashboardDiscussLabel,
    icon: <GraduationCap className="w-3 h-3" />,
    prompt: tls.dashboardDiscussPrompt
  },
  {
    label: tls.dashboardPlanLabel,
    icon: <Sparkles className="w-3 h-3" />,
    prompt: tls.dashboardPlanPrompt
  }
];
