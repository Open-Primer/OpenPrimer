/**
 * OpenPrimer - Safe Mathematical Expression Evaluator
 *
 * Implements a recursive-descent math parser and AST evaluator
 * supporting trigonometric, logarithmic, exponential functions, and implicit multiplication.
 * Zero reliance on eval() or Function constructor.
 */

export const safeEvaluate = (expression: string, xVal: number): number => {
  let s = expression.toLowerCase().replace(/\s+/g, '');
  
  // Replace constants
  s = s.replace(/\bpi\b/g, String(Math.PI));
  s = s.replace(/\be\b/g, String(Math.E));
  
  // Add implicit multiplication (e.g., 2x -> 2*x, x(x+1) -> x*(x+1))
  s = s.replace(/(\d)(x)/g, '$1*$2');
  s = s.replace(/(x)(\d)/g, '$1*$2');
  s = s.replace(/(\))(\(|x|\d)/g, '$1*$2');
  s = s.replace(/(\d)(\()/g, '$1*$2');
  s = s.replace(/(x)(\()/g, '$1*$2');
  s = s.replace(/(\))(\()/g, '$1*$2');

  let pos = 0;

  const peek = () => s[pos] || '';
  const consume = () => s[pos++] || '';

  const parsePrimary = (): number => {
    let char = peek();
    if (char === '-') {
      consume();
      return -parsePrimary();
    }
    if (char === '+') {
      consume();
      return parsePrimary();
    }

    if (char === '(') {
      consume();
      const val = parseExpression();
      if (peek() === ')') {
        consume();
      }
      return val;
    }

    if ((char >= '0' && char <= '9') || char === '.') {
      let numStr = '';
      while ((peek() >= '0' && peek() <= '9') || peek() === '.') {
        numStr += consume();
      }
      return parseFloat(numStr);
    }

    if (char === 'x') {
      consume();
      return xVal;
    }

    if (char >= 'a' && char <= 'z') {
      let funcName = '';
      while (peek() >= 'a' && peek() <= 'z') {
        funcName += consume();
      }
      
      if (peek() === '(') {
        consume();
        const arg = parseExpression();
        if (peek() === ')') {
          consume();
        }
        
        switch (funcName) {
          case 'sin': return Math.sin(arg);
          case 'cos': return Math.cos(arg);
          case 'tan': return Math.tan(arg);
          case 'exp': return Math.exp(arg);
          case 'ln': return arg > 0 ? Math.log(arg) : NaN;
          case 'log': return arg > 0 ? Math.log10(arg) : NaN;
          case 'abs': return Math.abs(arg);
          case 'sqrt': return arg >= 0 ? Math.sqrt(arg) : NaN;
          default: return NaN;
        }
      } else {
        if (funcName === 'x') return xVal;
        return NaN;
      }
    }

    return NaN;
  };

  const parsePower = (): number => {
    let val = parsePrimary();
    while (peek() === '^') {
      consume();
      const exp = parsePower();
      val = Math.pow(val, exp);
    }
    return val;
  };

  const parseMultiplicative = (): number => {
    let val = parsePower();
    while (peek() === '*' || peek() === '/') {
      const op = consume();
      const next = parsePower();
      if (op === '*') {
        val *= next;
      } else {
        val /= next;
      }
    }
    return val;
  };

  const parseExpression = (): number => {
    let val = parseMultiplicative();
    while (peek() === '+' || peek() === '-') {
      const op = consume();
      const next = parseMultiplicative();
      if (op === '+') {
        val += next;
      } else {
        val -= next;
      }
    }
    return val;
  };

  try {
    const res = parseExpression();
    return isNaN(res) || !isFinite(res) ? NaN : res;
  } catch (e) {
    return NaN;
  }
};
