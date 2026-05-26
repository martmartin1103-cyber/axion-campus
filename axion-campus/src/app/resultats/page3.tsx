"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type Dimension = {
  label: string;
  score: number;
};

type ResultsData = {
  student_name: string;
  score_global: number;
  grade: "A" | "B+" | "B" | "C" | "D";
  dimensions: Dimension[];
  completed_at: string;
};

export default function ResultatsPage() {
  const searchParams = useSearchParams();

  // BUG 3 CORRIGÉ (côté lecture) : session_id correspond maintenant au paramètre envoyé par diagnostic
  const sessionId = searchParams.get("session_id");
  const certUid = searchParams.get("cert_uid");

  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);

  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si pas de sessionId dans l'URL, on arrête le loading immédiatement
    if (!sessionId) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await fetch(
          `/api/get-results?session_id=${sessionId}`
        );

        if (!res.ok) {
          console.error("Erreur API get-results :", res.status);
          return;
        }

        const json = await res.json();

        // MAPPING CORRIGÉ : transformation des champs bruts Supabase
        // vers la structure ResultsData attendue par la page.
        // json contient : score_global, grade, score_d1..d5, cert_uid
        //                 + sessions : { nom_etudiant, finished_at }
        // Les scores d1..d5 sont sur 1000 → on divise par 10 pour obtenir %
        setData({
          student_name: json.sessions?.nom_etudiant ?? "Étudiant",
          score_global: json.score_global ?? 0,
          grade: json.grade ?? "C",
          completed_at:
            json.sessions?.finished_at ?? new Date().toISOString(),
          dimensions: [
            {
              label: "Maturité IA",
              score: Math.round((json.score_d1 ?? 0) / 10),
            },
            {
              label: "Agentic Usage",
              score: Math.round((json.score_d2 ?? 0) / 10),
            },
            {
              label: "Gouvernance IA",
              score: Math.round((json.score_d3 ?? 0) / 10),
            },
            {
              label: "ROI Thinking",
              score: Math.round((json.score_d4 ?? 0) / 10),
            },
            {
              label: "Transformation",
              score: Math.round((json.score_d5 ?? 0) / 10),
            },
          ],
        });
      } catch (error) {
        console.error("Erreur chargement résultats :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [sessionId]);

  const score = data?.score_global || 0;

  const circle = useMemo(() => {
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 1000) * circumference;

    return {
      radius,
      circumference,
      progress,
    };
  }, [score]);

  const downloadPDF = async () => {
    if (!certRef.current) return;

    const canvas = await html2canvas(certRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      canvas.width,
      canvas.height
    );

    pdf.save(`certificat-${certUid || "resultat"}.pdf`);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="text-slate-500 text-lg animate-pulse">
          Chargement des résultats...
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Résultats introuvables
          </h1>
          <p className="text-slate-500 text-sm">
            Identifiant de session manquant ou invalide.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] px-10 py-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="uppercase tracking-[0.25em] text-sm opacity-80 mb-3">
                  Certification Results
                </p>

                <h1 className="text-4xl font-bold mb-2">
                  {data.student_name}
                </h1>

                <p className="text-blue-100">
                  {new Date(data.completed_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-[220px] h-[220px]">
                  <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 220 220"
                  >
                    <circle
                      cx="110"
                      cy="110"
                      r={circle.radius}
                      stroke="rgba(255,255,255,0.15)"
                      strokeWidth="16"
                      fill="none"
                    />

                    <circle
                      cx="110"
                      cy="110"
                      r={circle.radius}
                      stroke="#7DD3FC"
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circle.circumference}
                      strokeDashoffset={
                        circle.circumference - circle.progress
                      }
                      style={{
                        transition: "stroke-dashoffset 1.6s ease-in-out",
                      }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{score}</span>
                    <span className="text-blue-100 text-sm mt-1">
                      / 1000
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-8">
                  <p className="text-sm uppercase tracking-widest text-blue-100 mb-2">
                    Grade
                  </p>

                  <div className="text-7xl font-black leading-none">
                    {data.grade}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-10 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">
                  Performance détaillée
                </h2>

                <div className="space-y-7">
                  {data.dimensions.map((dimension, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-slate-700">
                          {dimension.label}
                        </span>

                        <span className="text-[#0A66C2] font-semibold">
                          {dimension.score}%
                        </span>
                      </div>

                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0A66C2] to-[#38BDF8]"
                          style={{
                            width: `${dimension.score}%`,
                            transition: "width 1.2s ease-in-out",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center text-white font-bold text-2xl mb-6">
                    ✓
                  </div>

                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    Certification validée
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    Ce document atteste officiellement des résultats
                    obtenus lors de l'évaluation de certification.
                    Le certificat est généré dynamiquement avec un
                    identifiant unique.
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-slate-500">Certificat ID</span>
                      <span className="font-medium text-slate-900">
                        {certUid}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-slate-500">Session</span>
                      <span className="font-medium text-slate-900 text-xs">
                        {sessionId}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={downloadPDF}
                  className="mt-10 w-full rounded-2xl bg-[#0A66C2] hover:bg-[#004182] transition-all duration-300 text-white py-4 font-semibold text-lg shadow-lg shadow-blue-200"
                >
                  Télécharger mon certificat
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Certificate Preview — rendu hors écran pour html2canvas */}
        <div className="fixed -left-[9999px] top-0">
          <div
            id="cert-preview"
            ref={certRef}
            className="w-[1400px] h-[900px] bg-white relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2] to-[#003B75]" />

            <div className="absolute inset-0 p-20 flex flex-col justify-between text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="uppercase tracking-[0.4em] text-sm text-blue-100">
                    Professional Certification
                  </p>
                  <h1 className="text-6xl font-black mt-6">
                    Certificate of Achievement
                  </h1>
                </div>

                <div className="w-36 h-36 rounded-full border-[10px] border-white/20 flex items-center justify-center text-5xl font-black">
                  {data.grade}
                </div>
              </div>

              <div>
                <p className="text-2xl text-blue-100 mb-5">
                  This certifies that
                </p>
                <h2 className="text-7xl font-black mb-10">
                  {data.student_name}
                </h2>
                <p className="text-3xl text-blue-100 leading-relaxed max-w-4xl">
                  successfully completed the certification assessment with a
                  final score of{" "}
                  <span className="font-bold text-white">{score}/1000</span>.
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-blue-100 mb-2">Certification ID</p>
                  <p className="text-2xl font-semibold">{certUid}</p>
                </div>

                <div className="text-right">
                  <p className="text-blue-100 mb-2">Date d'obtention</p>
                  <p className="text-2xl font-semibold">
                    {new Date(data.completed_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
