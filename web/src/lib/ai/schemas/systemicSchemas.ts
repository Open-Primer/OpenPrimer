export const slugsArraySchema = {
  type: "array",
  items: { type: "string" }
};

export const systemicAnalysisSchema = {
  type: "object",
  properties: {
    isSystemic: { type: "boolean" },
    reason: { type: "string" }
  },
  required: ["isSystemic", "reason"]
};

export const videoSearchSchema = {
  type: "object",
  properties: {
    provider: { type: "string" },
    id: { type: "string" },
    url: { type: "string" }
  }
};

export const audioSearchSchema = {
  type: "object",
  properties: {
    url: { type: "string" }
  }
};

export const curriculumSchema = {
  type: "object",
  properties: {
    description: { type: "string" },
    courses: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          subject: { type: "string" },
          volume: { type: "string" },
          type: { type: "string", enum: ["mandatory", "optional"] },
          description: { type: "string" }
        },
        required: ["title", "subject", "volume", "type", "description"]
      }
    }
  },
  required: ["description", "courses"]
};



