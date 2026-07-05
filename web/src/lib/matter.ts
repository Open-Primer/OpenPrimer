import matter from 'gray-matter';
const yaml = require('js-yaml');

// Patch js-yaml globally just in case gray-matter requires it internally
if (yaml && typeof yaml.safeLoad !== 'function') {
  yaml.safeLoad = yaml.load;
}

export const sanitizeFrontmatterYaml = (str: string): string => {
  if (!str) return str;
  // Match frontmatter block at the very start
  const match = str.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!match) return str;
  
  const yamlBlock = match[1];
  const lines = yamlBlock.split(/\r?\n/);
  const cleanedLines = lines.map((line: string) => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return line;
    
    const key = line.slice(0, colonIndex);
    let val = line.slice(colonIndex + 1).trim();
    
    if (!val) return line;
    
    // Handle French guillemets: replace « with " and » with "
    if (val.startsWith('«') && val.endsWith('»')) {
      val = val.slice(1, -1).trim();
      const escaped = val.replace(/"/g, '\\"');
      return `${key}: "${escaped}"`;
    }
    
    // If it is a double-quoted string, make sure any internal double quotes are escaped
    if (val.startsWith('"') && val.endsWith('"')) {
      let inner = val.slice(1, -1);
      inner = inner.replace(/\\"/g, '"'); // avoid double-escaping
      const escaped = inner.replace(/"/g, '\\"');
      return `${key}: "${escaped}"`;
    }

    // If it is a single-quoted string, convert to double-quoted to guarantee safe escaping
    if (val.startsWith("'") && val.endsWith("'")) {
      let inner = val.slice(1, -1);
      inner = inner.replace(/''/g, "'"); // unescape doubled single quotes
      const escaped = inner.replace(/"/g, '\\"');
      return `${key}: "${escaped}"`;
    }
    
    // If it's a number or boolean, leave it
    if (/^(true|false|\d+)$/i.test(val)) {
      return line;
    }
    
    // Otherwise, wrap in double quotes to be safe
    const escaped = val.replace(/"/g, '\\"');
    return `${key}: "${escaped}"`;
  });
  
  const newYamlBlock = `---\n${cleanedLines.join('\n')}\n---\n`;
  
  // Replace the first frontmatter block
  return newYamlBlock + str.substring(match[0].length);
};

const matterWrapper = (str: string, options?: any) => {
  const sanitized = sanitizeFrontmatterYaml(str);
  return matter(sanitized, {
    engines: {
      yaml: {
        parse: (s: string) => yaml.load(s),
        stringify: (obj: any) => yaml.dump(obj)
      }
    },
    ...options
  });
};

matterWrapper.stringify = (str: string, data: any, options?: any) => {
  const sanitized = sanitizeFrontmatterYaml(str);
  return matter.stringify(sanitized, data, {
    engines: {
      yaml: {
        parse: (s: string) => yaml.load(s),
        stringify: (obj: any) => yaml.dump(obj)
      }
    },
    ...options
  });
};

export default matterWrapper;
