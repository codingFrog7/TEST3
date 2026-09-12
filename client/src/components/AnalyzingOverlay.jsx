import React, { useState, useEffect } from "react";
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Camera,
} from "lucide-react";

export default function AnalyzingOverlay({
  crop = "Chilli",
  imagePreview = "",
  onCancel,
}) {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setStep(2);
      setProgress(48);
    }, 700);

    const t2 = setTimeout(() => {
      setStep(3);
      setProgress(82);
    }, 1400);

    const t3 = setTimeout(() => {
      setStep(4);
      setProgress(98);
    }, 2100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const stepsList = [
    {
      id: 1,
      label: "Calibrating leaf image & lighting angle",
      hindi: "पत्ती की तस्वीर और रोशनी की जांच...",
    },
    {
      id: 2,
      label: "Scanning lesion margins, spots & curl vectors",
      hindi: "धब्बे, मरोड़िया और फफूंद के लक्षणों का विश्लेषण...",
    },
    {
      id: 3,
      label: "Connecting to Google AI & ICAR agronomy database",
      hindi: "Google AI और कृषि अनुसंधान से सही समाधान खोजना...",
    },
    {
      id: 4,
      label: "Formulating prescription in simple farmer language",
      hindi: "सरल भाषा में दवा और देसी नुस्खे तैयार करना...",
    },
  ];

  return (
    <div
      className="relative w-full rounded-2xl sm:rounded-3xl border border-emerald-300 dark:border-emerald-800/70 bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 p-6 sm:p-8 shadow-xl overflow-hidden animate-fade-in my-4"
      id="crop-doctor-analyzing-panel"
    >
      {/* Background ambient decorative glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center gap-6 sm:gap-8 z-10">
        {/* Leaf image with live scanning laser beam */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg bg-slate-950 shrink-0">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Analyzing plant leaf"
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-emerald-400 p-4 text-center">
              <Camera size={36} className="animate-pulse mb-2" />
              <span className="text-xs font-semibold">
                Scanning {crop} leaf...
              </span>
            </div>
          )}

          {/* Glowing Animated Laser Line */}
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scanner-beam" />

          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Live Scanner Tag */}
          <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-md py-1 px-2 rounded-lg text-[11px] font-mono text-emerald-300 flex items-center justify-between border border-emerald-500/30">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              VISION SCAN
            </span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Progress Stages & Dynamic Explanation */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              <Sparkles
                size={13}
                className="text-emerald-600 dark:text-emerald-400"
              />
              AI Agronomy Analysis In Progress
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white underline underline-offset-2"
              >
                Cancel
              </button>
            )}
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              Checking your {crop} crop with Google AI...
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Analyzing discoloration, spots, and pest damage to give you simple
              remedies in your language.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_#10b981]"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Diagnostic Steps Checklist */}
          <div className="space-y-2 pt-1">
            {stepsList.map(s => {
              const isDone = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div
                  key={s.id}
                  className={`flex items-center gap-2.5 text-xs sm:text-sm transition-colors ${
                    isDone
                      ? "text-emerald-700 dark:text-emerald-300 font-medium"
                      : isCurrent
                        ? "text-slate-900 dark:text-white font-bold"
                        : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2
                      size={16}
                      className="text-emerald-500 shrink-0"
                    />
                  ) : isCurrent ? (
                    <Loader2
                      size={16}
                      className="text-emerald-500 animate-spin shrink-0"
                    />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 inline-block shrink-0" />
                  )}
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>
              Compliant with Central Insecticides Board (CIB) & ICAR standards
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
