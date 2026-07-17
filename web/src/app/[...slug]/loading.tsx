import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Skeleton TopNav */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          {/* Menu button placeholder */}
          <div className="w-8 h-8 rounded-lg bg-slate-900 animate-pulse" />
          {/* Logo placeholder */}
          <div className="w-32 h-6 rounded bg-slate-900 animate-pulse" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-8 rounded-lg bg-slate-900 animate-pulse" />
          <div className="w-8 h-8 rounded-full bg-slate-900 animate-pulse" />
        </div>
      </div>

      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Skeleton Sidebar */}
        <div className="w-64 border-r border-slate-900 bg-slate-950 p-6 hidden md:flex flex-col gap-6 select-none">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-900">
            <div className="w-6 h-6 rounded-md bg-slate-900 animate-pulse" />
            <div className="w-24 h-4 rounded bg-slate-900 animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-16 h-3 rounded bg-slate-900 animate-pulse" />
                <div className="flex items-center gap-2 pl-3">
                  <div className="w-1 h-6 bg-slate-900/60 rounded" />
                  <div className="w-full h-4 rounded bg-slate-900/40 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton Main Pane */}
        <div className="flex-1 h-full overflow-y-auto p-6 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">
          <div className="animate-pulse flex flex-col gap-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-3 rounded bg-slate-900" />
              <div className="w-2 h-2 rounded-full bg-slate-900" />
              <div className="w-24 h-3 rounded bg-slate-900" />
              <div className="w-2 h-2 rounded-full bg-slate-900" />
              <div className="w-32 h-3 rounded bg-slate-900/60" />
            </div>

            {/* Title Section */}
            <div className="flex flex-col gap-4">
              <div className="w-16 h-5 rounded bg-slate-900" />
              <div className="w-3/4 h-12 rounded bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900" />
              <div className="w-16 h-1 bg-blue-900/50 rounded-full" />
            </div>

            {/* Prose Content Skeleton */}
            <div className="flex flex-col gap-6 mt-4">
              <div className="space-y-3">
                <div className="w-full h-4 rounded bg-slate-900" />
                <div className="w-11/12 h-4 rounded bg-slate-900" />
                <div className="w-10/12 h-4 rounded bg-slate-900" />
              </div>

              {/* Blockquote Skeleton */}
              <div className="border-l-4 border-slate-800 bg-slate-900/20 py-4 px-8 rounded-r-3xl my-6 flex flex-col gap-2">
                <div className="w-full h-4 rounded bg-slate-900" />
                <div className="w-9/12 h-4 rounded bg-slate-900" />
              </div>

              <div className="space-y-3">
                <div className="w-full h-4 rounded bg-slate-900" />
                <div className="w-full h-4 rounded bg-slate-900" />
                <div className="w-8/12 h-4 rounded bg-slate-900" />
              </div>

              {/* Interactive block placeholder */}
              <div className="h-48 rounded-2xl bg-slate-900/50 border border-slate-900 p-6 flex flex-col justify-between my-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900" />
                  <div className="flex flex-col gap-2">
                    <div className="w-32 h-4 rounded bg-slate-900" />
                    <div className="w-24 h-3 rounded bg-slate-900/60" />
                  </div>
                </div>
                <div className="w-24 h-8 rounded-lg bg-slate-900 self-end" />
              </div>

              <div className="space-y-3">
                <div className="w-full h-4 rounded bg-slate-900" />
                <div className="w-10/12 h-4 rounded bg-slate-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
