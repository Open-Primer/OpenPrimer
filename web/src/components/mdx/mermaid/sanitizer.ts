import React from 'react';

export const decodeHtmlEntities = (text: any): string => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#123;/g, '{')
    .replace(/&#125;/g, '}')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&apos;/g, "'");
};

export const getTextFromChildren = (children: React.ReactNode): string => {
  if (children === null || children === undefined) {
    return '';
  }
  if (typeof children === 'string') {
    return children;
  }
  if (typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('');
  }
  if (React.isValidElement(children)) {
    const props = children.props as any;
    if (props && props.children !== undefined) {
      return getTextFromChildren(props.children);
    }
  }
  return '';
};

export const sanitizeMermaidChart = (chartText: any): string => {
  let sanitized = typeof chartText === 'string' ? chartText : '';

  // Decode HTML entities
  sanitized = decodeHtmlEntities(sanitized);

  // 1. Remove standard markdown blocks if any
  sanitized = sanitized.replace(/```mermaid/g, '').replace(/```/g, '').trim();

  // 2. Clean corrupted sequence patterns such as &fl°°123¶ß or fl°°123¶ß and replace with standard brackets
  // Using exact Unicode escapes: \u00b0 is °, \u00b6 is ¶, \u00df is ß, plus symbol fallbacks for safety.
  const corruptedRegex = /([a-zA-Z0-9_-]+)(?:&?fl\u00b0\u00b0123\u00b6\u00df|&?fl[^\w\s]+123[^\w\s]+)(.*?)(?=\s*[-=]\.?>|\s*[-=]=|\n|\r|$)/g;
  sanitized = sanitized.replace(corruptedRegex, (match, id, label) => {
    return `${id}["${label.trim()}"]`;
  });
  sanitized = sanitized.replace(/&?fl\u00b0\u00b0123\u00b6\u00df|&?fl[^\w\s]+123[^\w\s]+/g, '["');

  // 3. Replace '+' with '&' when connecting nodes, but not inside double quotes
  let parts = sanitized.split(/("[^"]*")/g);
  parts = parts.map((part, index) => {
    if (!part) return '';
    if (index % 2 === 1) return part; // Inside quotes, do not replace
    return part.replace(/\+/g, '&');
  });
  sanitized = parts.join('');

  // 4. Fix unquoted node labels with special characters to prevent Mermaid parser crashes.
  // Match double brackets [[text]]
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\[\[([^"\r\n\]]+)\]\]/g, '$1[["$2"]]');
  // Match stadium shape ([text])
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\(\[([^"\r\n\]]+)\]\)/g, '$1(["$2"])');
  // Match cylindrical shape [(text)]
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\[\(([^"\r\n\)]+)\)\]/g, '$1[("$2")]');
  // Match circle shape ((text))
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\(\(([^"\r\n\)]+)\)\)/g, '$1(("$2"))');
  // Match normal brackets [text]
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\[([^"\r\n\]]+)\]/g, '$1["$2"]');
  // Match normal parentheses (text)
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\(([^"\r\n\)]+)\)/g, (match, id, label) => {
    // Avoid breaking subgraphs or direction/style keywords
    const lowerLabel = label.toLowerCase().trim();
    if (lowerLabel === 'td' || lowerLabel === 'lr' || lowerLabel === 'tb' || lowerLabel === 'bt' || lowerLabel === 'rl' || lowerLabel.startsWith('style') || lowerLabel.startsWith('class')) {
      return match;
    }
    return `${id}("${label}")`;
  });
  // Match rhombus {text}
  sanitized = sanitized.replace(/(\b[a-zA-Z0-9_-]+)\{([^"\r\n\}]+)\}/g, '$1{"$2"}');

  return sanitized;
};

const parseMermaidFallbackNodes = (chartText: string): { id: string; label: string }[] => {
  const nodes: { id: string; label: string }[] = [];
  const seenIds = new Set<string>();

  const lines = chartText.split(/\r?\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('%%') || line.toLowerCase() === 'timeline' || line.toLowerCase().startsWith('graph') || line.toLowerCase().startsWith('flowchart')) {
      continue;
    }

    // Split line by connectors: -->, ---, ==>, -.->, ->, to
    const parts = line.split(/\s*(?:-->|---|==>|-\.-\s*>|->|to)\s*/);
    for (const part of parts) {
      const trimmedPart = part.trim();
      if (!trimmedPart) continue;

      // Skip connection labels like |text|
      if (trimmedPart.startsWith('|') && trimmedPart.endsWith('|')) {
        continue;
      }
      
      const idMatch = trimmedPart.match(/^([a-zA-Z0-9_-]+)/);
      if (!idMatch) continue;

      const id = idMatch[1];
      if (['graph', 'flowchart', 'subgraph', 'end', 'click', 'style', 'classdef', 'direction', 'tb', 'td', 'lr', 'rl', 'bt'].includes(id.toLowerCase())) {
        continue;
      }

      const rest = trimmedPart.substring(id.length).trim();
      if (!rest) {
        continue;
      }

      let label = '';
      // Look for brackets or quotes
      const quotedMatch = rest.match(/^[\[\({]+"(.*?)"[\]\)}]+/);
      if (quotedMatch) {
        label = quotedMatch[1].trim();
      } else {
        // Strip various Mermaid bracket shapes: ((...)), (text), [...], {...}, >...]
        if (rest.startsWith('((') && rest.endsWith('))')) {
          label = rest.substring(2, rest.length - 2).trim();
        } else if (rest.startsWith('([') && rest.endsWith('])')) {
          label = rest.substring(2, rest.length - 2).trim();
        } else if (rest.startsWith('[[') && rest.endsWith(']]')) {
          label = rest.substring(2, rest.length - 2).trim();
        } else if (rest.startsWith('[(') && rest.endsWith(')]')) {
          label = rest.substring(2, rest.length - 2).trim();
        } else if (rest.startsWith('[') && rest.endsWith(']')) {
          label = rest.substring(1, rest.length - 1).trim();
        } else if (rest.startsWith('(') && rest.endsWith(')')) {
          label = rest.substring(1, rest.length - 1).trim();
        } else if (rest.startsWith('{') && rest.endsWith('}')) {
          label = rest.substring(1, rest.length - 1).trim();
        } else {
          label = rest;
        }
      }

      if (label && !seenIds.has(id)) {
        seenIds.add(id);
        nodes.push({ id, label });
      }
    }
  }

  // If no nodes found, fallback to extracting anything inside quotes
  if (nodes.length === 0) {
    const quoteRegex = /"([^"]+)"/g;
    let index = 0;
    let match;
    while ((match = quoteRegex.exec(chartText)) !== null) {
      const label = match[1].trim();
      const id = `node-${index++}`;
      if (label && label.length > 1 && !seenIds.has(id)) {
        seenIds.add(id);
        nodes.push({ id, label });
      }
    }
  }

  return nodes;
};

const STATUS_STRINGS: Record<string, { initial: string; transition: string; target: string }> = {
  EN: { initial: "Initial State", transition: "Transition Step", target: "Target Milestone" },
  FR: { initial: "État Initial", transition: "Étape de Transition", target: "Objectif Final" },
  ES: { initial: "Estado Inicial", transition: "Paso de Transición", target: "Meta Final" },
  DE: { initial: "Ausgangszustand", transition: "Übergangsschritt", target: "Endziel" },
  ZH: { initial: "初始状态", transition: "过渡阶段", target: "最终目标" },
  PT: { initial: "Estado Inicial", transition: "Etapa de Transição", target: "Meta Final" },
  AR: { initial: "الحالة الأولية", transition: "خطوة انتقالية", target: "الهدف النهائي" },
  HI: { initial: "प्रारंभिक अवस्था", transition: "पारगमन चरण", target: "अंतिम मील का पत्थर" },
  UR: { initial: "ابتدائی حالت", transition: "عبوری مرحلہ", target: "آخری سنگ میل" }
};

