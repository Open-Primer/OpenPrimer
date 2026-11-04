export const syllabusSchema = {
  type: "object",
  properties: {
    courseContext: {
      type: "object",
      properties: {
        discipline: { type: "string" },
        description: { type: "string" },
        epistemologicalMatrix: { type: "string" },
        targetLevel: { type: "string" },
        pedagogicalStrategy: { type: "string" }
      },
      required: ["discipline", "description", "epistemologicalMatrix", "targetLevel", "pedagogicalStrategy"]
    },
    lessons: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          slug: { type: "string" },
          cognitiveArtifact: { type: "string" },
          technicalDepth: { type: "string" }
        },
        required: ["title", "slug", "cognitiveArtifact", "technicalDepth"]
      }
    },
    references: {
      type: "array",
      items: { type: "string" }
    }
  },
  required: ["courseContext", "lessons", "references"]
};

export const verificationSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string", description: "Detailed critique explaining what to fix. MUST be empty if approved is true." }
  },
  required: ["approved", "critique"]
};

export const syllabusAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string", description: "Detailed critique explaining what to fix. MUST be empty if approved is true." }
  },
  required: ["approved", "critique"]
};

export const lessonOutlineSchema = {
  type: "object",
  properties: {
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          description: { type: "string" }
        },
        required: ["heading", "description"]
      }
    }
  },
  required: ["sections"]
};

export const outlineAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string", description: "Detailed critique explaining what to fix. MUST be empty if approved is true." }
  },
  required: ["approved", "critique"]
};

export const blockNarrativeAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    isGlobalRevision: { type: "boolean" },
    globalCritique: { type: "string", description: "Detailed critique explaining what to fix globally. MUST be empty if approved is true or isGlobalRevision is false." },
    sections: {
      type: "array",
      description: "List of rejected sections. MUST be empty if approved is true or isGlobalRevision is true. Do NOT include approved sections.",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          approved: { type: "boolean", description: "Must strictly be false because only rejected sections are allowed in this array." },
          critique: { type: "string", description: "Detailed critique explaining what to fix in this specific section." }
        },
        required: ["heading", "approved", "critique"]
      }
    }
  },
  required: ["approved", "isGlobalRevision", "globalCritique"]
};

export const widgetBlockAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    critique: { type: "string", description: "Detailed critique explaining what to fix globally. MUST be empty if approved is true." },
    fields: {
      type: "array",
      description: "List of invalid/rejected fields. MUST be empty if approved is true. Do NOT include approved fields.",
      items: {
        type: "object",
        properties: {
          field: { type: "string", description: "Name of the invalid property/field, e.g., 'diagnosticQuiz' or 'references'." },
          approved: { type: "boolean", description: "Must strictly be false because only rejected fields are allowed in this array." },
          critique: { type: "string", description: "Detailed critique explaining what is invalid and how to fix it." }
        },
        required: ["field", "approved", "critique"]
      }
    }
  },
  required: ["approved", "critique"]
};

export const widgetsAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    isGlobalRevision: { type: "boolean" },
    globalCritique: { type: "string" },
    widgets: {
      type: "array",
      items: {
        type: "object",
        properties: {
          key: { type: "string" },
          approved: { type: "boolean" },
          critique: { type: "string" }
        },
        required: ["key", "approved", "critique"]
      }
    }
  },
  required: ["approved", "isGlobalRevision", "globalCritique"]
};

export const revisionAuditSchema = {
  type: "object",
  properties: {
    approved: { type: "boolean" },
    isGlobalRevision: { type: "boolean" },
    globalCritique: { type: "string", description: "Detailed critique explaining what to fix globally. MUST be empty if approved is true or isGlobalRevision is false." },
    sections: {
      type: "array",
      description: "List of rejected sections. MUST be empty if approved is true or isGlobalRevision is true. Do NOT include approved sections.",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          approved: { type: "boolean", description: "Must strictly be false because only rejected sections are allowed in this array." },
          critique: { type: "string", description: "Detailed critique explaining what to fix in this specific section." }
        },
        required: ["heading", "approved", "critique"]
      }
    }
  },
  required: ["approved", "isGlobalRevision", "globalCritique"]
};

export const revisionQualificationSchema = {
  type: "object",
  properties: {
    scope: { type: "string", description: "Must be 'global' if the overall lesson needs a full structural or narrative rewrite, or 'local' if edits are localized to specific sections, quizzes, or widgets." },
    preCritique: { type: "string", description: "Pre-critique report explaining the diagnosed errors, points to moderate, and general guidelines." },
    affectedItems: {
      type: "array",
      description: "List of items affected. If scope is local, list all sections, quizzes, or widgets that need correction. If scope is global, this array must be empty.",
      items: {
        type: "object",
        properties: {
          type: { type: "string", description: "Must be one of: 'section', 'quiz', 'widget'." },
          id: { type: "string", description: "For quizzes/widgets, their specific ID (e.g. quiz_123, biography_456). For sections, their exact heading (e.g. ## Introduction)." },
          heading: { type: "string", description: "For sections, their exact heading (e.g. ## Introduction). For quizzes/widgets, the heading of the section they reside in (or empty string)." },
          feedback: { type: "string", description: "Detailed local instruction on what to revise for this specific item." }
        },
        required: ["type", "id", "heading", "feedback"]
      }
    }
  },
  required: ["scope", "preCritique", "affectedItems"]
};
