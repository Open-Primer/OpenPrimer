"use client";

import React from 'react';
import { Mermaid } from '../Mermaid';

/**
 * @file PreCodeInterceptor.tsx
 * @description Intercepts standard MDX code blocks to dynamically render Mermaid diagrams.
 */


const PreCodeInterceptor = (props: any) => {
  const children = props.children;
  if (
    children &&
    React.isValidElement(children) &&
    (children.props as any).className === 'language-mermaid'
  ) {
    const codeContent = (children.props as any).children || '';
    return <Mermaid chart={String(codeContent).trim()} />;
  }
  return <pre {...props} />;
};


export { PreCodeInterceptor };
export default PreCodeInterceptor;
