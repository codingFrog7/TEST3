import React from "react";
import { Link } from "wouter";

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-[#eff0eb] font-sans flex flex-col pt-24 px-6 pb-12">
      <div className="w-full max-w-4xl mx-auto flex-1">
        <div className="mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 transition-colors">
              &larr; Back to Home
            </a>
          </Link>
        </div>
        
        <div className="bg-white border-4 border-slate-900 rounded-2xl shadow-[8px_8px_0px_0px_#0f172a] p-8 md:p-12 min-h-[50vh] flex flex-col">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-4">Team Froggers</h1>
            <div className="h-2 w-24 bg-[#b6f022] border-2 border-slate-900"></div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden shadow-[4px_4px_0px_0px_#0f172a] mb-6">
              <img 
                src="/team-froggers.jpg" 
                alt="Team Froggers Logo" 
                className="w-full h-full object-cover object-top scale-[1.3] translate-y-2"
              />
            </div>
            <h2 className="text-2xl font-black text-slate-700 mb-2">Coming Soon</h2>
            <p className="text-slate-500 font-bold max-w-md">
              We are working hard to bring you more information about the team behind Agro Sathi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
