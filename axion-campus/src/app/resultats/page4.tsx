"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";

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
  ecole_nom?: string;
};

export default function ResultatsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const certUid = searchParams.get("cert_uid");

  const [data, setData] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }

    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/get-results?session_id=${sessionId}`);
        if (!res.ok) { console.error("Erreur API get-results :", res.status); return; }
        const json = await res.json();

        setData({
          student_name: json.sessions?.nom_etudiant ?? "Étudiant",
          score_global: json.score_global ?? 0,
          grade: json.grade ?? "C",
          completed_at: json.sessions?.finished_at ?? new Date().toISOString(),
          ecole_nom: json.sessions?.ecoles?.nom ?? "",
          dimensions: [
            { label: "Maturité IA",    score: Math.round((json.score_d1 ?? 0) / 10) },
            { label: "Agentic Usage",  score: Math.round((json.score_d2 ?? 0) / 10) },
            { label: "Gouvernance IA", score: Math.round((json.score_d3 ?? 0) / 10) },
            { label: "ROI Thinking",   score: Math.round((json.score_d4 ?? 0) / 10) },
            { label: "Transformation", score: Math.round((json.score_d5 ?? 0) / 10) },
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
    return { radius, circumference, progress: (score / 1000) * circumference };
  }, [score]);

  const downloadPDF = async () => {
    if (!data) return;
    setPdfLoading(true);

    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const W = 297;
      const H = 210;

      // Fond dégradé bleu
      const steps = 60;
      for (let i = 0; i < steps; i++) {
        const t = i / steps;
        const r = Math.round(10  + (0   - 10)  * t);
        const g = Math.round(102 + (65  - 102) * t);
        const b = Math.round(194 + (117 - 194) * t);
        pdf.setFillColor(r, g, b);
        pdf.rect((W / steps) * i, 0, W / steps + 1, H, "F");
      }

      // Ligne séparation gauche/droite
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(0.2);
      pdf.setGState(new (pdf as any).GState({ opacity: 0.2 }));
      pdf.line(W * 0.62, 20, W * 0.62, H - 22);
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

      // ── COLONNE GAUCHE ──────────────────────────────────────────────────────

      // En-tête marque
      pdf.setTextColor(255, 255, 255);
      pdf.setGState(new (pdf as any).GState({ opacity: 0.45 }));
      pdf.setFontSize(6.5);
      pdf.setFont("helvetica", "bold");
      pdf.text("AXION CAMPUS\u2122  \u00B7  CERTIFICATION IA AG\u00C9NTIQUE", 18, 20);
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

      // Sous-titre
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(180, 210, 255);
      pdf.text("CERTIFICAT DE R\u00C9USSITE", 18, 34);

      // Séparateur
      pdf.setFillColor(180, 210, 255);
      pdf.setGState(new (pdf as any).GState({ opacity: 0.4 }));
      pdf.rect(18, 37, 22, 0.4, "F");
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

      // Intro
      pdf.setFontSize(9.5);
      pdf.setFont("helvetica", "italic");
      pdf.setTextColor(200, 225, 255);
      pdf.text("Ce certificat atteste que", 18, 48);

      // Nom étudiant
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      const nameLines = pdf.splitTextToSize(data.student_name, 155);
      pdf.text(nameLines, 18, 62);
      const nameH = nameLines.length * 9;

      // École
      if (data.ecole_nom) {
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(180, 210, 255);
        pdf.text(data.ecole_nom.toUpperCase(), 18, 62 + nameH + 3);
      }

      // Phrase résultat
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(220, 235, 255);
      const phrase = `a compl\u00E9t\u00E9 avec succ\u00E8s l'\u00E9valuation de certification en IA\navec un score final de ${score}/1000.`;
      pdf.text(pdf.splitTextToSize(phrase, 155), 18, 62 + nameH + 16);

      // Cercle score (approximation)
      const cx = 36, cy = 148, outerR = 17, innerR = 12;
      pdf.setFillColor(255, 255, 255);
      pdf.setGState(new (pdf as any).GState({ opacity: 0.1 }));
      pdf.circle(cx, cy, outerR, "F");
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

      const pct = score / 1000;
      const segs = Math.round(pct * 60);
      if (segs > 0) {
        const arcPts: [number, number][] = [];
        for (let i = 0; i <= segs; i++) {
          const a = (Math.PI * 2 * i) / 60 - Math.PI / 2;
          arcPts.push([cx + outerR * Math.cos(a), cy + outerR * Math.sin(a)]);
        }
        for (let i = segs; i >= 0; i--) {
          const a = (Math.PI * 2 * i) / 60 - Math.PI / 2;
          arcPts.push([cx + innerR * Math.cos(a), cy + innerR * Math.sin(a)]);
        }
        pdf.setFillColor(125, 211, 252);
        pdf.lines(
          arcPts.slice(1).map((p, i) => [p[0] - arcPts[i][0], p[1] - arcPts[i][1]] as [number, number]),
          arcPts[0][0], arcPts[0][1], [1, 1], "F", true
        );
      }

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${score}`, cx, cy - 1, { align: "center" });
      pdf.setFontSize(5.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(180, 210, 255);
      pdf.text("/1000", cx, cy + 4, { align: "center" });

      // Infos bas gauche
      const dateStr = new Date(data.completed_at).toLocaleDateString("fr-FR", {
        day: "numeric", month: "long", year: "numeric"
      });
      pdf.setFontSize(7);
      pdf.setTextColor(160, 195, 240);
      pdf.setFont("helvetica", "normal");
      pdf.text(`D\u00E9livr\u00E9 le ${dateStr}`, cx + 24, 143);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text(`ID : ${certUid ?? "\u2013"}`, cx + 24, 150);

      // ── COLONNE DROITE ──────────────────────────────────────────────────────
      const rx = W * 0.62 + 14;

      // Badge grade
      pdf.setFillColor(255, 255, 255);
      pdf.setGState(new (pdf as any).GState({ opacity: 0.1 }));
      pdf.roundedRect(rx, 18, 48, 48, 5, 5, "F");
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));
      pdf.setFontSize(34);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text(data.grade, rx + 24, 50, { align: "center" });
      pdf.setFontSize(6.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(180, 210, 255);
      pdf.text("GRADE GLOBAL", rx + 24, 59, { align: "center" });

      // Titre dimensions
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(255, 255, 255);
      pdf.text("Performance par dimension", rx, 80);

      // Barres
      const barW = W - rx - 14;
      const barH = 5;
      data.dimensions.forEach((dim, i) => {
        const y = 88 + i * 16;

        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(210, 230, 255);
        pdf.text(dim.label, rx, y);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(125, 211, 252);
        pdf.text(`${dim.score}%`, rx + barW, y, { align: "right" });

        // Fond
        pdf.setFillColor(255, 255, 255);
        pdf.setGState(new (pdf as any).GState({ opacity: 0.1 }));
        pdf.roundedRect(rx, y + 2, barW, barH, 2, 2, "F");
        pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

        // Remplissage
        const filled = (dim.score / 100) * barW;
        if (filled > 0) {
          pdf.setFillColor(125, 211, 252);
          pdf.roundedRect(rx, y + 2, filled, barH, 2, 2, "F");
        }
      });

      // Pied de page
      pdf.setFontSize(6);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(160, 195, 240);
      pdf.setGState(new (pdf as any).GState({ opacity: 0.6 }));
      pdf.text(
        "Certification priv\u00E9e AXION CAMPUS\u2122 \u2014 Non reconnue par l'\u00C9tat",
        W / 2, H - 7, { align: "center" }
      );
      pdf.setGState(new (pdf as any).GState({ opacity: 1 }));

      pdf.save(`certificat-axion-${certUid ?? "resultat"}.pdf`);
    } catch (err) {
      console.error("Erreur g\u00E9n\u00E9ration PDF :", err);
      alert("Erreur lors de la g\u00E9n\u00E9ration du PDF. Veuillez r\u00E9essayer.");
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="text-slate-500 text-lg animate-pulse">Chargement des r\u00E9sultats...</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">R\u00E9sultats introuvables</h1>
          <p className="text-slate-500 text-sm">Identifiant de session manquant ou invalide.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden">

          <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] px-10 py-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="uppercase tracking-[0.25em] text-sm opacity-80 mb-3">Certification Results</p>
                <h1 className="text-4xl font-bold mb-2">{data.student_name}</h1>
                <p className="text-blue-100">
                  {new Date(data.completed_at).toLocaleDateString("fr-FR", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="relative w-[220px] h-[220px]">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r={circle.radius} stroke="rgba(255,255,255,0.15)" strokeWidth="16" fill="none"/>
                    <circle cx="110" cy="110" r={circle.radius} stroke="#7DD3FC" strokeWidth="16" fill="none"
                      strokeLinecap="round"
                      strokeDasharray={circle.circumference}
                      strokeDashoffset={circle.circumference - circle.progress}
                      style={{ transition: "stroke-dashoffset 1.6s ease-in-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold">{score}</span>
                    <span className="text-blue-100 text-sm mt-1">/ 1000</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-10 py-8">
                  <p className="text-sm uppercase tracking-widest text-blue-100 mb-2">Grade</p>
                  <div className="text-7xl font-black leading-none">{data.grade}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-10 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Performance d\u00E9taill\u00E9e</h2>
                <div className="space-y-7">
                  {data.dimensions.map((dimension, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-slate-700">{dimension.label}</span>
                        <span className="text-[#0A66C2] font-semibold">{dimension.score}%</span>
                      </div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#0A66C2] to-[#38BDF8]"
                          style={{ width: `${dimension.score}%`, transition: "width 1.2s ease-in-out" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center text-white font-bold text-2xl mb-6">\u2713</div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Certification valid\u00E9e</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Ce document atteste officiellement des r\u00E9sultats obtenus lors de l\u2019\u00E9valuation de certification.
                    Le certificat est g\u00E9n\u00E9r\u00E9 dynamiquement avec un identifiant unique.
                  </p>
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-slate-500">Certificat ID</span>
                      <span className="font-mono font-medium text-slate-900">{certUid}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-slate-500">Session</span>
                      <span className="font-medium text-slate-900 text-xs truncate max-w-[180px]">{sessionId}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={downloadPDF}
                  disabled={pdfLoading}
                  className="mt-10 w-full rounded-2xl bg-[#0A66C2] hover:bg-[#004182] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 text-white py-4 font-semibold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  {pdfLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      G\u00E9n\u00E9ration en cours\u2026
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                      </svg>
                      T\u00E9l\u00E9charger mon certificat
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
