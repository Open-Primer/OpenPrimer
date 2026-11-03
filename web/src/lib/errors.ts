/**
 * @file errors.ts
 * @description Centralized, strongly-typed error hierarchy for OpenPrimer.
 * Conforms to modern TypeScript and ECMAScript standards for custom Error subclasses.
 */

/**
 * Base custom error class ensuring proper prototype chain restoration.
 */
export abstract class OpenPrimerBaseError extends Error {
  public readonly timestamp: string;

  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    this.timestamp = new Date().toISOString();

    // Restore prototype chain for ES5/ES6 compatibility
    Object.setPrototypeOf(this, new.target.prototype);

    // Maintains proper stack trace in V8 engines
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, new.target);
    }
  }
}

/**
 * Represents a transient network or infrastructure failure (e.g. rate limit, 502/503/504,
 * non-JSON HTTP responses, or downstream provider timeout) that is safe to retry.
 */
export class TransientNetworkError extends OpenPrimerBaseError {
  public readonly statusCode?: number;
  public readonly contextName?: string;

  /**
   * @param message - Descriptive failure message.
   * @param options - Additional error context (status code, context label, or root cause).
   */
  constructor(message: string, options?: { statusCode?: number; contextName?: string; cause?: unknown }) {
    super(message);
    this.name = 'TransientNetworkError';
    this.statusCode = options?.statusCode;
    this.contextName = options?.contextName;
    if (options?.cause) {
      (this as any).cause = options.cause;
    }
  }
}

/**
 * Represents a failure to extract or parse structured JSON from an LLM response or API payload.
 * Indicates that the response was malformed, truncated, or contained non-parseable markdown.
 */
export class StructuralJsonError extends OpenPrimerBaseError {
  public readonly contextName?: string;
  public readonly rawSnippet?: string;

  /**
   * @param message - Descriptive error message.
   * @param options - Context name or problematic raw text snippet.
   */
  constructor(message: string, options?: { contextName?: string; rawSnippet?: string; cause?: unknown }) {
    super(message);
    this.name = 'StructuralJsonError';
    this.contextName = options?.contextName;
    this.rawSnippet = options?.rawSnippet;
    if (options?.cause) {
      (this as any).cause = options.cause;
    }
  }
}
