import { lessonWidgetsSchema, widgetBlock2Schema } from './lessonWidgetsSchema';

export function getDynamicWidgetsSchema(narrativeText: string): any {
  const schema = JSON.parse(JSON.stringify(lessonWidgetsSchema));
  const anchors = extractWidgetAnchors(narrativeText);
  const foundTypes = new Set(anchors.map(a => a.type.toLowerCase()));
  const foundIds = new Set(anchors.map(a => a.id.toLowerCase()));

  const conditionalProps = ["previousLessonSummary", "careerProfile", "researchFocus", "recentNewsBridge"];
  for (const prop of conditionalProps) {
    if (!foundTypes.has(prop.toLowerCase()) && !foundIds.has(prop.toLowerCase())) {
      delete schema.properties[prop];
    }
  }

  if (schema.properties.interactiveComponents && schema.properties.interactiveComponents.items) {
    const anyOf = schema.properties.interactiveComponents.items.anyOf;
    if (Array.isArray(anyOf)) {
      const activeAnyOf: any[] = [];
      const genericFallback = anyOf[anyOf.length - 1];

      for (const option of anyOf) {
        if (!option.properties || !option.properties.componentType) continue;
        const compTypeEnum = option.properties.componentType.enum;
        if (Array.isArray(compTypeEnum)) {
          const hasMatch = compTypeEnum.some(type => foundTypes.has(type.toLowerCase()));
          if (hasMatch) {
            activeAnyOf.push(option);
          }
        }
      }

      activeAnyOf.push(genericFallback);
      schema.properties.interactiveComponents.items.anyOf = activeAnyOf;
    }
  }

  return schema;
}

export function getSchemasForRejectedKeys(rejectedKeys: string[], baseSchema: any): string {
  const schemas: Record<string, any> = {};

  for (const key of rejectedKeys) {
    if (key.startsWith('interactiveComponents:')) {
      const compId = key.substring('interactiveComponents:'.length).toLowerCase();
      if (baseSchema.properties.interactiveComponents?.items?.anyOf) {
        const anyOf = baseSchema.properties.interactiveComponents.items.anyOf;
        const matched = anyOf.find((opt: any) => {
          if (!opt.properties || !opt.properties.componentType) return false;
          const compTypeEnum = opt.properties.componentType.enum;
          return Array.isArray(compTypeEnum) && compTypeEnum.some(type => type.toLowerCase() === compId || type.toLowerCase().replace(/sandbox|prononciation/g, '') === compId.replace(/sandbox|prononciation/g, ''));
        });
        if (matched) {
          schemas[key] = matched;
        } else {
          schemas[key] = anyOf[anyOf.length - 1];
        }
      }
    } else {
      const propSchema = baseSchema.properties[key];
      if (propSchema) {
        schemas[key] = propSchema;
      }
    }
  }

  if (Object.keys(schemas).length === 0) {
    return "No specific schemas found. Follow the standard properties format.";
  }

  return JSON.stringify(schemas, null, 2);
}




