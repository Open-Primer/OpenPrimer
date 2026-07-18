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
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(`ref-${refNum}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Update hash in URL without page reload/route change
      window.history.pushState(null, '', `#ref-${refNum}`);
    }
  };

  return (
    <sup 
      id={`cite-${refNum}`} 
      className="scroll-mt-24 mx-0.5 inline-block select-none font-bold"
    >
      <a 
        href={`#ref-${refNum}`} 
        onClick={handleClick}
        className="no-underline text-indigo-500 hover:text-indigo-400 transition-colors font-extrabold"
        title={`Aller à la référence [${refNum}]`}
      >
        [{children || refNum}]
      </a>
    </sup>
  );
};
