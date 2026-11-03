export const interactiveComponentItemsSchema =       items: {
        anyOf: [
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Biography"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Full name of the person." },
                  dates: { type: "string", description: "Lifespan dates, e.g., '1856-1939' or '1723-1790'." },
                  description: { type: "string", description: "Detailed biographical summary focusing on their contributions (8-12 sentences)." },
                  wikipediaUrl: { type: "string", description: "Direct link to their English Wikipedia page." },
                  searchQuery: { type: "string", description: "Canonical search query to find the biography on Wikipedia." }
                },
                required: ["name", "dates", "description"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Citation"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  quote: { type: "string", description: "The exact quote text in the target language." },
                  author: { type: "string", description: "Full name of the author." },
                  source: { type: "string", description: "Title of the book, paper, or landmark publication." },
                  year: { type: "string", description: "Year of publication, e.g., '1776'." },
                  original: { type: "string", description: "Original untranslated quote text in the author's original language of writing. MANDATORY if the author's original language of writing is different from the target language. Empty or omitted if the original language is the same as the target language." },
                  commentary: { type: "string", description: "Academic analysis explaining the relevance of the quote (at least 3-4 sentences)." }
                },
                required: ["quote", "author", "source", "year", "commentary"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Epistemology"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string", description: "The title of the debate or critical controversy." },
                  content: { type: "string", description: "Deeply academic analysis of the epistemology debate (150-250 words)." }
                },
                required: ["title", "content"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Image"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  description: { type: "string", description: "The detailed search/generation description for the image (at least 2-3 sentences of visual instructions). DO NOT generate sequential figure numbers." },
                  alt: { type: "string", description: "Short description for accessibility." },
                  caption: { type: "string", description: "A detailed, italicized caption explaining academic relevance. DO NOT generate sequential figure numbers." },
                  title: { type: "string", description: "Short title of the image." },
                  searchQuery: { type: "string", description: "Highly canonical 1 to 3 search words (e.g. 'Claudio Monteverdi', 'Larynx humain', 'Doppler acoustique') to ensure precise database matches." }
                },
                required: ["description", "alt", "caption", "searchQuery"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Audio"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Short descriptive title for the audio narration." },
                  url: { type: "string", description: "Optional pre-resolved or empty audio URL." },
                  duration: { type: "string", description: "Estimated duration, e.g. '1:30' or '2:45'." },
                  unresolved: { type: "boolean", description: "Whether the resource is unresolved/needs backend matching. Defaults to true." },
                  alt: { type: "string", description: "Short accessibility text." },
                  description: { type: "string", description: "Detailed description of the audio track's content, narration, or pronunciation details." },
                  searchQuery: { type: "string", description: "Canonical search query to find this audio resource." }
                },
                required: ["title", "description", "searchQuery"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Video"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Title of the video documentary or lecture segment." },
                  url: { type: "string", description: "Optional video URL (e.g. YouTube/Vimeo)." },
                  id: { type: "string", description: "Optional video platform ID." },
                  provider: { type: "string", enum: ["youtube", "vimeo", "direct"] },
                  duration: { type: "string", description: "Estimated duration, e.g. '3:15'." },
                  unresolved: { type: "boolean", description: "Whether the resource is unresolved/needs backend matching. Defaults to true." },
                  description: { type: "string", description: "Detailed description of the video's content, documentary topic, or lecture segment." },
                  searchQuery: { type: "string", description: "Canonical search query to find this video on platforms like YouTube." }
                },
                required: ["title", "description", "searchQuery"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["PronunciationSandbox", "SandboxPrononciation"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  word: { type: "string", description: "The word/phrase to practice pronouncing." },
                  ipa: { type: "string", description: "The phonetic transcription in International Phonetic Alphabet (IPA)." },
                  lang: { type: "string", description: "The language code of the word, e.g., 'fr' or 'en'." },
                  definition: { type: "string", description: "A short, clear definition of the word." },
                  explanation: { type: "string", description: "Orthographic and phonetic pronunciation guidance." }
                },
                required: ["word", "ipa", "lang", "definition", "explanation"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Quiz"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  limit: { type: "integer", description: "The number of questions to display at once." },
                  mode: { type: "string", enum: ["standard", "speed"] },
                  questionDurationLimit: { type: "integer", description: "Optional speed mode time limit in seconds per question." },
                  questions: {
                     type: "array",
                     items: {
                       type: "object",
                       properties: {
                         q: { type: "string", description: "The question card text." },
                         explanation: { type: "string", description: "Extremely concise, punchy explanation of the correct choice(s)." },
                         multiple: { type: "boolean", description: "Set to true if multiple options are correct and the student must select ALL of them. Omit or set false for single-answer questions." },
                         mode: { type: "string", enum: ["standard", "elimination"] },
                         mediaType: { type: "string", enum: ["image", "audio", "video"] },
                         mediaUrl: { type: "string" },
                         mediaCaption: { type: "string" },
                         options: {
                           type: "array",
                           items: {
                             type: "object",
                             properties: {
                               text: { type: "string", description: "The text of the option." },
                               correct: { type: "boolean", description: "Whether this option is correct. For multiple=true questions, set correct=true on ALL correct options." }
                             },
                             required: ["text", "correct"]
                           }
                         }
                       },
                       required: ["q", "explanation", "options"]
                     }
                  }
                },
                required: ["limit", "questions"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["MatchingEvaluation", "AssociationCorrespondance"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  pairs: { type: "string", description: "Sequence of pairs separated by vertical bars and double pipes, e.g., 'Concept A|Def A || Concept B|Def B'" },
                  explanation: { type: "string" }
                },
                required: ["pairs"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["ReorderEvaluation", "ReordonnerItems"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  items: { type: "string", description: "Sequence of ordered items separated by vertical bars, e.g., 'Step 1 | Step 2 | Step 3'" },
                  explanation: { type: "string" }
                },
                required: ["items"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["FillInBlanks", "TextesATrous"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  sentence: { type: "string", description: "The sentence containing one or more blanks represented by five underscores (_____)." },
                  answer: { type: "string", description: "The correct comma-separated answers for the blanks." }
                },
                required: ["sentence", "answer"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["SolvedExercise", "ExerciceResolut"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  problem: { type: "string", description: "The problem statement." },
                  solution: { type: "string", description: "The detailed step-by-step solution." }
                },
                required: ["title", "problem", "solution"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["UnsolvedExercise", "ExerciceACompleter"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  problem: { type: "string", description: "The unsolved application exercise statement." },
                  correctAnswer: { type: "string", description: "The correct analytical answer or formula." }
                },
                required: ["title", "problem", "correctAnswer"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Mermaid"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  chart: { type: "string", description: "Valid Mermaid chart notation." }
                },
                required: ["chart"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["Glossary", "Lexique"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  term: { type: "string", description: "The glossary vocabulary term." },
                  definition: { type: "string", description: "Detailed vocabulary definition (2-4 sentences)." },
                  wikipediaUrl: { type: "string", description: "Direct canonical link to their Wikipedia page." },
                  searchQuery: { type: "string", description: "Canonical search query to find the term on Wikipedia." }
                },
                required: ["term", "definition"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["DataChart"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  title: { type: "string", description: "The title of the data chart." },
                  type: { type: "string", enum: ["bar", "pie", "donut", "line", "scatter"], description: "The type of visualization chart." },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        label: { type: "string", description: "Label for the data point." },
                        value: { type: "number", description: "Numerical value for the data point." },
                        color: { type: "string", description: "Optional custom color hex or code." }
                      },
                      required: ["label", "value"]
                    },
                    description: "Dataset for the chart."
                  },
                  xAxisLabel: { type: "string", description: "Label for X axis." },
                  yAxisLabel: { type: "string", description: "Label for Y axis." },
                  unit: { type: "string", description: "Unit of measurement (e.g. '%', 'nm', 'ppm')." },
                  gradeLevel: { type: "string", enum: ["middle_school", "high_school", "university"] }
                },
                required: ["title", "type", "data"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string", enum: ["ConceptLink", "RealPerson", "HistoricalPerson", "EventLink", "HistoricalEventLink", "Location", "EvenementHistorique", "ÉvénementHistorique"] },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Name of the entity." },
                  description: { type: "string", description: "Wikipedia-style hover card tooltip summary of this entity (2-4 sentences)." },
                  wikipediaUrl: { type: "string", description: "Direct canonical link to their Wikipedia page." },
                  searchQuery: { type: "string", description: "Canonical search query to find the entity on Wikipedia." }
                },
                required: ["name", "description"]
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          },
          {
            type: "object",
            properties: {
              id: { type: "string" },
              componentType: { type: "string" },
              sectionAnchor: { type: "string" },
              props: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  term: { type: "string" },
                  dates: { type: "string" },
                  description: { type: "string" },
                  definition: { type: "string" },
                  wikipediaUrl: { type: "string" },
                  searchQuery: { type: "string" }
                }
              }
            },
            required: ["id", "componentType", "sectionAnchor", "props"]
          }
        ]
      }
;
