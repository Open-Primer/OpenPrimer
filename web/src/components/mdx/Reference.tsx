"use client";

import React from 'react';

interface ReferenceProps {
  id?: string | number;
  name?: string;
  term?: string;
  children?: React.ReactNode;
}

export const Reference = ({ id, name, term, children }: ReferenceProps) => {
  const refNum = id || term || name || String(children || '');
  
  return (
    <sup 
      id={`cite-${refNum}`} 
      className="scroll-mt-24 mx-0.5 inline-block select-none font-bold"
    >
      <a 
        href={`#ref-${refNum}`} 
        className="no-underline text-indigo-500 hover:text-indigo-400 transition-colors font-extrabold"
        title={`Aller à la référence [${refNum}]`}
      >
        [{children || refNum}]
      </a>
    </sup>
  );
};
