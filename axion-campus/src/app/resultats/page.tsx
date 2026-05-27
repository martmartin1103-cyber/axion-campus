"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";

type Dimension = { label: string; score: number };
type ResultsData = {
  student_name: string;
  score_global: number;
  grade: "A" | "B+" | "B" | "C" | "D";
  dimensions: Dimension[];
  completed_at: string;
  ecole_nom?: string;
};

function ShareSection({ studentName, score, grade, certUid, sessionId }: {
  studentName: string; score: number; grade: string;
  certUid: string; sessionId: string;
}) {
  const [copied, setCopied] = useState(false);
  const certUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/resultats?session_id=${sessionId}&cert_uid=${certUid}` : '';
  const shareText = `Je viens d'obtenir ma certification IA Agentique AXION CAMPUS avec un score de ${score}/1000 (Grade ${grade}) ! 🎓 #IA #Certification #AxionCampus`;
  const linkedinAddUrl = [
    'https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME',
    `&name=${encodeURIComponent('Certification IA Agentique — Axion Campus')}`,
    `&organizationName=${encodeURIComponent('Axion Campus')}`,
    `&issueYear=${new Date().getFullYear()}`,
    `&issueMonth=${new Date().getMonth() + 1}`,
    `&certUrl=${encodeURIComponent(certUrl)}`,
    `&certId=${encodeURIComponent(certUid)}`,
  ].join('');
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}&summary=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(certUrl)}`;
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(certUrl); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch {}
  };
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
      <h3 className="text-lg font-bold text-slate-900 mb-1">Partagez votre certification</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">Valorisez votre niveau IA sur vos réseaux professionnels.</p>
      <a href={linkedinAddUrl} target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 w-full bg-[#0A66C2] hover:bg-[#004182] text-white px-5 py-4 rounded-2xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-blue-200 mb-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
        <div className="flex-1 text-left">
          <p className="font-bold">Ajouter à mon profil LinkedIn</p>
          <p className="text-xs text-blue-200 font-normal">Certification officielle avec lien unique</p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
      </a>
      <div className="grid grid-cols-3 gap-3">
        <a href={linkedinShareUrl} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-slate-200 hover:border-[#0A66C2] hover:bg-blue-50 transition-all group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0A66C2"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
          <span className="text-xs text-slate-600 font-medium">LinkedIn</span>
        </a>
        <a href={twitterUrl} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 transition-all group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-slate-800"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          <span className="text-xs text-slate-600 font-medium">X / Twitter</span>
        </a>
        <button onClick={copyLink}
          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all ${copied ? 'border-green-300 bg-green-50' : 'border-slate-200 hover:border-slate-400'}`}>
          {copied
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>}
          <span className={`text-xs font-medium ${copied ? 'text-green-600' : 'text-slate-600'}`}>{copied ? 'Copié !' : 'Copier lien'}</span>
        </button>
      </div>
      <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" className="shrink-0"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
        <span className="text-xs text-slate-400 font-mono truncate flex-1">{certUrl}</span>
      </div>
    </div>
  );
}

function ResultatsContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const certUid   = searchParams.get("cert_uid");

  const [data, setData]             = useState<ResultsData | null>(null);
  const [loading, setLoading]       = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!sessionId) { setLoading(false); return; }
    const fetchResults = async () => {
      try {
        const res = await fetch(`/api/get-results?session_id=${sessionId}`);
        if (!res.ok) return;
        const json = await res.json();
        setData({
          student_name:  json.sessions?.nom_etudiant ?? "Étudiant",
          score_global:  json.score_global ?? 0,
          grade:         json.grade ?? "C",
          completed_at:  json.sessions?.finished_at ?? new Date().toISOString(),
          ecole_nom:     json.sessions?.ecoles?.nom ?? "",
          dimensions: [
            { label: "Maturité IA",    score: Math.round((json.score_d1 ?? 0) / 10) },
            { label: "Agentic Usage",  score: Math.round((json.score_d2 ?? 0) / 10) },
            { label: "Gouvernance IA", score: Math.round((json.score_d3 ?? 0) / 10) },
            { label: "ROI Thinking",   score: Math.round((json.score_d4 ?? 0) / 10) },
            { label: "Transformation", score: Math.round((json.score_d5 ?? 0) / 10) },
          ],
        });
      } catch { } finally { setLoading(false); }
    };
    fetchResults();
  }, [sessionId]);

  const score  = data?.score_global || 0;
  const circle = useMemo(() => {
    const radius = 90, circumference = 2 * Math.PI * radius;
    return { radius, circumference, progress: (score / 1000) * circumference };
  }, [score]);

  const downloadPDF = async () => {
    if (!data) return;
    setPdfLoading(true);
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const W = 297, H = 210;
      for (let i = 0; i < 60; i++) {
        const t = i / 60;
        pdf.setFillColor(Math.round(10+(0-10)*t),Math.round(102+(65-102)*t),Math.round(194+(117-194)*t));
        pdf.rect((W/60)*i,0,W/60+1,H,"F");
      }
      pdf.setGState(new (pdf as any).GState({opacity:0.2}));
      pdf.setDrawColor(255,255,255); pdf.setLineWidth(0.2);
      pdf.line(W*0.62,20,W*0.62,H-22);
      pdf.setGState(new (pdf as any).GState({opacity:1}));
      pdf.setTextColor(255,255,255); pdf.setFontSize(6.5); pdf.setFont("helvetica","bold");
      pdf.setGState(new (pdf as any).GState({opacity:0.45}));
      pdf.text("AXION CAMPUS  \u00B7  CERTIFICATION IA AGENTIQUE",18,20);
      pdf.setGState(new (pdf as any).GState({opacity:1}));
      pdf.setFontSize(8.5); pdf.setFont("helvetica","normal"); pdf.setTextColor(180,210,255);
      pdf.text("CERTIFICAT DE R\u00C9USSITE",18,34);
      pdf.setFillColor(180,210,255); pdf.setGState(new (pdf as any).GState({opacity:0.4}));
      pdf.rect(18,37,22,0.4,"F"); pdf.setGState(new (pdf as any).GState({opacity:1}));
      pdf.setFontSize(9.5); pdf.setFont("helvetica","italic"); pdf.setTextColor(200,225,255);
      pdf.text("Ce certificat atteste que",18,48);
      pdf.setFont("helvetica","bold"); pdf.setFontSize(24); pdf.setTextColor(255,255,255);
      const nameLines = pdf.splitTextToSize(data.student_name,155);
      pdf.text(nameLines,18,62);
      const nameH = nameLines.length*9;
      if(data.ecole_nom){pdf.setFontSize(8);pdf.setFont("helvetica","normal");pdf.setTextColor(180,210,255);pdf.text(data.ecole_nom.toUpperCase(),18,62+nameH+3);}
      pdf.setFontSize(10);pdf.setFont("helvetica","normal");pdf.setTextColor(220,235,255);
      pdf.text(pdf.splitTextToSize(`a compl\u00E9t\u00E9 avec succ\u00E8s l'\u00E9valuation en IA avec un score de ${score}/1000.`,155),18,62+nameH+16);
      const cx=36,cy=148,outerR=17,innerR=12;
      pdf.setFillColor(255,255,255);pdf.setGState(new (pdf as any).GState({opacity:0.1}));
      pdf.circle(cx,cy,outerR,"F");pdf.setGState(new (pdf as any).GState({opacity:1}));
      const segs=Math.round((score/1000)*60);
      if(segs>0){const arcPts:[number,number][]=[];for(let i=0;i<=segs;i++){const a=(Math.PI*2*i)/60-Math.PI/2;arcPts.push([cx+outerR*Math.cos(a),cy+outerR*Math.sin(a)]);}for(let i=segs;i>=0;i--){const a=(Math.PI*2*i)/60-Math.PI/2;arcPts.push([cx+innerR*Math.cos(a),cy+innerR*Math.sin(a)]);}pdf.setFillColor(125,211,252);pdf.lines(arcPts.slice(1).map((p,i)=>[p[0]-arcPts[i][0],p[1]-arcPts[i][1]] as [number,number]),arcPts[0][0],arcPts[0][1],[1,1],"F",true);}
      pdf.setFontSize(9);pdf.setFont("helvetica","bold");pdf.setTextColor(255,255,255);pdf.text(`${score}`,cx,cy-1,{align:"center"});
      pdf.setFontSize(5.5);pdf.setFont("helvetica","normal");pdf.setTextColor(180,210,255);pdf.text("/1000",cx,cy+4,{align:"center"});
      const dateStr=new Date(data.completed_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"});
      pdf.setFontSize(7);pdf.setTextColor(160,195,240);pdf.setFont("helvetica","normal");pdf.text(`D\u00E9livr\u00E9 le ${dateStr}`,cx+24,143);
      pdf.setFont("helvetica","bold");pdf.setTextColor(255,255,255);pdf.text(`ID : ${certUid??"\u2013"}`,cx+24,150);
      const rx=W*0.62+14;
      pdf.setFillColor(255,255,255);pdf.setGState(new (pdf as any).GState({opacity:0.1}));
      pdf.roundedRect(rx,18,48,48,5,5,"F");pdf.setGState(new (pdf as any).GState({opacity:1}));
      pdf.setFontSize(34);pdf.setFont("helvetica","bold");pdf.setTextColor(255,255,255);pdf.text(data.grade,rx+24,50,{align:"center"});
      pdf.setFontSize(6.5);pdf.setFont("helvetica","normal");pdf.setTextColor(180,210,255);pdf.text("GRADE GLOBAL",rx+24,59,{align:"center"});
      pdf.setFontSize(8.5);pdf.setFont("helvetica","bold");pdf.setTextColor(255,255,255);pdf.text("Performance par dimension",rx,80);
      const barW=W-rx-14;
      data.dimensions.forEach((dim,i)=>{const y=88+i*16;pdf.setFontSize(7);pdf.setFont("helvetica","normal");pdf.setTextColor(210,230,255);pdf.text(dim.label,rx,y);pdf.setFont("helvetica","bold");pdf.setTextColor(125,211,252);pdf.text(`${dim.score}%`,rx+barW,y,{align:"right"});pdf.setFillColor(255,255,255);pdf.setGState(new (pdf as any).GState({opacity:0.1}));pdf.roundedRect(rx,y+2,barW,5,2,2,"F");pdf.setGState(new (pdf as any).GState({opacity:1}));const filled=(dim.score/100)*barW;if(filled>0){pdf.setFillColor(125,211,252);pdf.roundedRect(rx,y+2,filled,5,2,2,"F");}});
      pdf.setFontSize(6);pdf.setFont("helvetica","normal");pdf.setTextColor(160,195,240);pdf.setGState(new (pdf as any).GState({opacity:0.6}));
      pdf.text("Certification priv\u00E9e AXION CAMPUS\u2122 \u2014 Non reconnue par l'\u00C9tat",W/2,H-7,{align:"center"});
      pdf.setGState(new (pdf as any).GState({opacity:1}));
      pdf.save(`certificat-axion-${certUid??"resultat"}.pdf`);
    } catch(err){console.error(err);alert("Erreur génération PDF.");}
    finally{setPdfLoading(false);}
  };

  if (loading) return (
    <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
      <div className="text-slate-500 text-lg animate-pulse">Chargement des résultats…</div>
    </main>
  );
  if (!data) return (
    <main className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
      <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-200 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Résultats introuvables</h1>
        <p className="text-slate-500 text-sm">Identifiant de session manquant ou invalide.</p>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0A66C2] to-[#004182] px-10 py-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <p className="uppercase tracking-[0.25em] text-sm opacity-80 mb-3">Certification Results</p>
                <h1 className="text-4xl font-bold mb-2">{data.student_name}</h1>
                <p className="text-blue-100">{new Date(data.completed_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</p>
                {data.ecole_nom && <p className="text-blue-200 text-sm mt-1">{data.ecole_nom}</p>}
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-[200px] h-[200px]">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r={circle.radius} stroke="rgba(255,255,255,0.15)" strokeWidth="16" fill="none"/>
                    <circle cx="110" cy="110" r={circle.radius} stroke="#7DD3FC" strokeWidth="16" fill="none"
                      strokeLinecap="round" strokeDasharray={circle.circumference}
                      strokeDashoffset={circle.circumference-circle.progress}
                      style={{transition:"stroke-dashoffset 1.6s ease-in-out"}}/>
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
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Performance détaillée</h2>
                <div className="space-y-7">
                  {data.dimensions.map((d,i)=>(
                    <div key={i}>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-slate-700">{d.label}</span>
                        <span className="text-[#0A66C2] font-semibold">{d.score}%</span>
                      </div>
                      <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#0A66C2] to-[#38BDF8]"
                          style={{width:`${d.score}%`,transition:"width 1.2s ease-in-out"}}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#0A66C2] flex items-center justify-center text-white font-bold text-2xl mb-6">✓</div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Certification validée</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">Ce document atteste officiellement de vos résultats avec un identifiant unique et vérifiable.</p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-slate-500 text-sm">Certificat ID</span>
                      <span className="font-mono font-bold text-slate-900">{certUid}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <span className="text-slate-500 text-sm">Session</span>
                      <span className="font-medium text-slate-900 text-xs truncate max-w-[180px]">{sessionId}</span>
                    </div>
                  </div>
                </div>
                <button onClick={downloadPDF} disabled={pdfLoading}
                  className="mt-8 w-full rounded-2xl bg-[#0A66C2] hover:bg-[#004182] disabled:opacity-60 transition-all text-white py-4 font-semibold text-lg shadow-lg shadow-blue-200 flex items-center justify-center gap-2">
                  {pdfLoading
                    ? <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Génération…</>
                    : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>Télécharger mon certificat</>}
                </button>
              </div>
            </div>
          </div>
        </div>
        {sessionId && certUid && (
          <ShareSection studentName={data.student_name} score={score} grade={data.grade} certUid={certUid} sessionId={sessionId}/>
        )}
      </div>
    </main>
  );
}

export default function ResultatsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#f5f7fb] flex items-center justify-center">
        <div className="text-slate-500 text-lg animate-pulse">Chargement…</div>
      </main>
    }>
      <ResultatsContent />
    </Suspense>
  );
}
