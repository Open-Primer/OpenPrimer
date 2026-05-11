import { TopNav } from "@/components/RefinedUI";

export default function GenericInfoPage({ title, description }: { title: string, description: string }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans pt-32 px-8">
      <TopNav />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-8 tracking-tighter">{title}</h1>
        <div className="p-10 bg-slate-900/30 border border-slate-800 rounded-[40px] text-slate-400 leading-relaxed text-lg">
          {description}
        </div>
      </div>
    </div>
  );
}
