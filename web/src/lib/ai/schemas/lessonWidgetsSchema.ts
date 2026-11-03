import { interactiveComponentItemsSchema } from './interactiveComponentSchema';

/**
 * @file schemas.ts
 * @description JSON Schemas and structured output definitions for Gemini/Vertex AI widget generation.
 */

// ─────────────────────────────────────────────────────────────────
// WIDGETS-FIRST (WFTA) SCHEMAS & HELPERS
// ─────────────────────────────────────────────────────────────────

export const lessonWidgetsSchema = {
  type: "object",
  properties: {
    prerequisites: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              slug: { type: "string" },
              level: { type: "string" },
              subject: { type: "string" }
            },
            required: ["title", "slug", "level", "subject"]
          }
        }
      },
      required: ["items"]
    },
    diagnosticQuiz: {
      type: "object",
      properties: {
        question: { type: "string" },
        options: { type: "array", items: { type: "string" } },
        correctIndex: { type: "integer" },
        targetSectionId: { type: "string" },
        sectionTitle: { type: "string" }
      },
      required: ["question", "options", "correctIndex", "targetSectionId", "sectionTitle"]
    },
    learningObjectives: {
      type: "object",
      properties: {
        knowledge: { type: "array", items: { type: "string" } },
        skills: { type: "array", items: { type: "string" } },
        attitudes: { type: "array", items: { type: "string" } }
      },
      required: ["knowledge", "skills", "attitudes"]
    },
    interactiveComponents: {
      type: "array",

      items: interactiveComponentItemsSchema
    },
    whatsNext: {
      type: "object",
      properties: {
        steps: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              slug: { type: "string" }
            },
            required: ["title", "description", "slug"]
          }
        }
      },
      required: ["steps"]
    },
    goingFurther: {
      type: "object",
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              type: { type: "string", enum: ["book", "article", "video", "website", "research", "movie", "film"] },
              description: { type: "string" },
              author: { type: "string" },
              year: { type: "string" },
              url: { type: "string" }
            },
            required: ["title", "type", "description"]
          }
        }
      },
      required: ["items"]
    },
    conclusionSummary: {
      type: "object",
      properties: {
        items: { type: "array", items: { type: "string" } }
      },
      required: ["items"]
    },
    finalEvaluation: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["Quiz"] },
        props: {
          type: "object",
          properties: {
            durationLimit: { type: "integer" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  q: { type: "string" },
                  explanation: { type: "string" },
                  multiple: { type: "boolean", description: "Set to true if multiple options are correct." },
                  options: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        correct: { type: "boolean" }
                      },
                      required: ["text", "correct"]
                    },
                    minItems: 2
                  }
                },
                required: ["q", "explanation", "options"]
              },
              minItems: 1
            }
          },
          required: ["questions"]
        }
      },
      required: ["type", "props"]
    },
    glossary: {
      type: "array",
      items: {
        type: "object",
        properties: {
          term: { type: "string" },
          definition: { type: "string" }
        },
        required: ["term", "definition"]
      }
    },
    references: {
      type: "array",
      items: { type: "string" }
    },
    previousLessonSummary: {
      type: "object",
      properties: {
        previousLessonTitle: { type: "string" },
        previousLessonSlug: { type: "string" },
        keyTakeaways: { type: "array", items: { type: "string" } },
        cognitiveBridge: { type: "string" }
      },
      required: ["previousLessonTitle", "keyTakeaways", "cognitiveBridge"]
    },
    careerProfile: {
      type: "object",
      properties: {
        profession: { type: "string" },
        discipline: { type: "string" },
        courseConnection: { type: "string" },
        keyMissions: { type: "array", items: { type: "string" } },
        careerOutlook: {
          type: "object",
          properties: {
            demand: { type: "string" },
            typicalEmployers: { type: "array", items: { type: "string" } },
            salaryIndication: { type: "string" }
          },
          required: ["demand", "typicalEmployers", "salaryIndication"]
        }
      },
      required: ["profession", "discipline", "courseConnection", "keyMissions", "careerOutlook"]
    },
    researchFocus: {
      type: "object",
      properties: {
        question: { type: "string" },
        category: { type: "string" },
        context: { type: "string" },
        whyUnresolved: { type: "string" },
        activeHypotheses: { type: "array", items: { type: "string" } }
      },
      required: ["question", "category", "context", "whyUnresolved", "activeHypotheses"]
    },
    recentNewsBridge: {
      type: "object",
      properties: {
        eventTitle: { type: "string" },
        date: { type: "string" },
        source: { type: "string" },
        description: { type: "string" },
        courseConnection: { type: "string" },
        whyItMatters: { type: "string" }
      },
      required: ["eventTitle", "date", "source", "description", "courseConnection", "whyItMatters"]
    }
  },
  required: [
    "prerequisites",
    "diagnosticQuiz",
    "learningObjectives",
    "interactiveComponents",
    "whatsNext",
    "goingFurther",
    "conclusionSummary",
    "finalEvaluation",
    "glossary",
    "references"
  ]
};

const widgetBlock1Schema = {
  type: "object",
  properties: {
    prerequisites: lessonWidgetsSchema.properties.prerequisites,
    diagnosticQuiz: lessonWidgetsSchema.properties.diagnosticQuiz,
    learningObjectives: lessonWidgetsSchema.properties.learningObjectives
  },
  required: ["prerequisites", "diagnosticQuiz", "learningObjectives"]
};

export const widgetBlock2Schema = {
  type: "object",
  properties: {
    interactiveComponents: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          componentType: { type: "string" },
          sectionAnchor: { type: "string" },
          props: {
            type: "object",
            properties: {
              // Biography & RealPerson
              name: { type: "string" },
              dates: { type: "string" },
              description: { type: "string" },
              // Citation / Quote
              quote: { type: "string" },
              author: { type: "string" },
              source: { type: "string" },
              year: { type: "string" },
              original: { type: "string" },
              commentary: { type: "string" },
              // Epistemology / General / Solver
              title: { type: "string" },
              content: { type: "string" },
              // Image / Video / Audio / Media
              alt: { type: "string" },
              caption: { type: "string" },
              searchQuery: { type: "string" },
              duration: { type: "string" },
              // Interactive code or Diagram
              code: { type: "string" },
              language: { type: "string" },
              // General links
              text: { type: "string" },
              // Quiz
              limit: { type: "integer" },
              questions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    q: { type: "string" },
                    explanation: { type: "string" },
                    options: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          text: { type: "string" },
                          correct: { type: "boolean" }
                        },
                        required: ["text", "correct"]
                      }
                    }
                  },
                  required: ["q", "options"]
                }
              }
            }
          }
        },
        required: ["id", "componentType", "sectionAnchor", "props"]
      }
    }
  },
  required: ["interactiveComponents"]
};

const widgetBlock3Schema = {
  type: "object",
  properties: {
    conclusionSummary: lessonWidgetsSchema.properties.conclusionSummary,
    whatsNext: lessonWidgetsSchema.properties.whatsNext,
    goingFurther: lessonWidgetsSchema.properties.goingFurther,
    glossary: lessonWidgetsSchema.properties.glossary
  },
  required: ["conclusionSummary", "whatsNext", "goingFurther", "glossary"]
};

const widgetBlock5Schema = {
  type: "object",
  properties: {
    finalEvaluation: lessonWidgetsSchema.properties.finalEvaluation,
    references: lessonWidgetsSchema.properties.references
  },
  required: ["finalEvaluation", "references"]
};

const widgetBlock5QuizSchema = {
  type: "object",
  properties: {
    finalEvaluation: lessonWidgetsSchema.properties.finalEvaluation
  },
  required: ["finalEvaluation"]
};

const widgetBlock5ReferencesSchema = {
  type: "object",
  properties: {
    references: lessonWidgetsSchema.properties.references
  },
  required: ["references"]
};

function checkForForbiddenPlaceholders(obj: any, path = ''): string[] {
  const errors: string[] = [];
  if (obj === null || obj === undefined) return errors;

  if (typeof obj === 'string') {
    const cleanStr = obj.trim();
    if (cleanStr === '## Section Name' || cleanStr === 'Section Name' || cleanStr.includes('## Section Name')) {
      errors.push(`Placeholder section anchor found at "${path}": "${obj}"`);
    } else if (cleanStr.toUpperCase() === 'N/A' || cleanStr.toLowerCase() === 'n/a') {
      errors.push(`Forbidden placeholder "N/A" found at "${path}"`);
    } else if (cleanStr.includes('[Insert ') || cleanStr.includes('[insert ') || (cleanStr.startsWith('[') && cleanStr.endsWith(']'))) {
      errors.push(`Draft marker/placeholder bracketed text found at "${path}": "${obj}"`);
    } else if (/lorem\s+ipsum/i.test(cleanStr)) {
      errors.push(`Lorem ipsum text found at "${path}": "${obj}"`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      errors.push(...checkForForbiddenPlaceholders(item, `${path}[${index}]`));
    });
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        errors.push(...checkForForbiddenPlaceholders(obj[key], path ? `${path}.${key}` : key));
      }
    }
  }
  return errors;
}



function extractWidgetAnchors(narrativeText: string): { raw: string, type: string, id: string, topic?: string }[] {
  const matches: { raw: string, type: string, id: string, topic?: string }[] = [];
  const regex = /\[\[WIDGET:(.*?)\]\]+/gi;
  let match;
  while ((match = regex.exec(narrativeText)) !== null) {
    const raw = match[0];
    const inner = match[1].trim();
    const parts = inner.split(':');
    if (parts.length >= 3) {
      const type = parts[0].trim();
      const id = parts[1].trim();
      const topic = parts.slice(2).join(':').trim();
      matches.push({ raw, type, id, topic });
    } else if (parts.length === 2) {
      const type = parts[0].trim();
      const id = parts[1].trim();
      matches.push({ raw, type, id });
    } else if (parts.length === 1) {
      const id = parts[0].trim();
      matches.push({ raw, type: id, id });
    }
  }
  return matches;
}


