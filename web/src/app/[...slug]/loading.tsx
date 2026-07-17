import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen skeleton-bg-page flex flex-col">
      {/* Skeleton TopNav */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b skeleton-border skeleton-bg-page px-6 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          {/* Menu button placeholder */}
          <div className="w-8 h-8 rounded-lg skeleton-block" />
          {/* Logo placeholder */}
          <div className="w-32 h-6 rounded skeleton-block" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-24 h-8 rounded-lg skeleton-block" />
          <div className="w-8 h-8 rounded-full skeleton-block" />
        </div>
      </div>

      <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden">
        {/* Skeleton Sidebar */}
        <div className="w-64 border-r skeleton-border skeleton-bg-page p-6 hidden md:flex flex-col gap-6 select-none">
          <div className="flex items-center gap-2 pb-4 border-b skeleton-border">
            <div className="w-6 h-6 rounded-md skeleton-block" />
            <div className="w-24 h-4 rounded skeleton-block" />
          </div>
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-16 h-3 rounded skeleton-block" />
                <div className="flex items-center gap-2 pl-3">
                  <div className="w-1 h-6 skeleton-block opacity-60 rounded" />
                  <div className="w-full h-4 rounded skeleton-block opacity-40" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton Main Pane */}
        <div className="flex-1 h-full overflow-y-auto p-6 md:p-12 lg:p-16 max-w-4xl mx-auto w-full">
          <div className="flex flex-col gap-8">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-3 rounded skeleton-block" />
              <div className="w-2 h-2 rounded-full skeleton-block" />
              <div className="w-24 h-3 rounded skeleton-block" />
              <div className="w-2 h-2 rounded-full skeleton-block" />
              <div className="w-32 h-3 rounded skeleton-block opacity-60" />
            </div>

            {/* Title Section */}
            <div className="flex flex-col gap-4">
              <div className="w-16 h-5 rounded skeleton-block" />
              <div className="w-3/4 h-12 rounded skeleton-gradient" />
              <div className="w-16 h-1 skeleton-block opacity-50 rounded-full" />
            </div>

            {/* Prose Content Skeleton */}
            <div className="flex flex-col gap-6 mt-4">
              <div className="space-y-3">
                <div className="w-full h-4 rounded skeleton-block" />
                <div className="w-11/12 h-4 rounded skeleton-block" />
                <div className="w-10/12 h-4 rounded skeleton-block" />
              </div>

              {/* Blockquote Skeleton */}
              <div className="border-l-4 skeleton-border skeleton-block opacity-25 py-4 px-8 rounded-r-3xl my-6 flex flex-col gap-2">
                <div className="w-full h-4 rounded skeleton-block" />
                <div className="w-9/12 h-4 rounded skeleton-block" />
              </div>

              <div className="space-y-3">
                <div className="w-full h-4 rounded skeleton-block" />
                <div className="w-full h-4 rounded skeleton-block" />
                <div className="w-8/12 h-4 rounded skeleton-block" />
              </div>

              {/* Interactive block placeholder */}
              <div className="h-48 rounded-2xl border skeleton-border skeleton-block opacity-50 p-6 flex flex-col justify-between my-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl skeleton-block" />
                  <div className="flex flex-col gap-2">
                    <div className="w-32 h-4 rounded skeleton-block" />
                    <div className="w-24 h-3 rounded skeleton-block opacity-60" />
                  </div>
                </div>
                <div className="w-24 h-8 rounded-lg skeleton-block self-end" />
              </div>

              <div className="space-y-3">
                <div className="w-full h-4 rounded skeleton-block" />
                <div className="w-10/12 h-4 rounded skeleton-block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
