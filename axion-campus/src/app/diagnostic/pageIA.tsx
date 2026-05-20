'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QUESTIONS from '@/data/questions';

export default function DiagnosticPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(-1));
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const passeId = localStorage.getItem('passe_id');
    const ecoleId = localStorage.getItem('ecole_id');
    const nomEtudiant = localStorage.getItem('nom_etudiant');
    const promo = localStorage.getItem('promo');
    const reponses = localStorage.getItem('reponses');

    if (!passeId || !ecoleId || !nomEtudiant || !promo || !reponses) {
      router.replace('/');
      return;
    }

    setReady(true);
  }, [router]);

  if (!ready) {
    return null;
  }

  const question = QUESTIONS[currentIndex];
  const isLastQuestion = currentIndex === QUESTIONS.length - 1;
  const progressPercent = Math.round(((currentIndex + 1) / QUESTIONS.length) * 100);

  const handleAnswerChange = (value: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = value;
    setAnswers(nextAnswers);
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goNext = async () => {
    if (isLastQuestion) {
      await submitAnswers();
      return;
    }
    setCurrentIndex(currentIndex + 1);
  };

  const submitAnswers = async () => {
    if (submitting) return;
    setSubmitting(true);

    if (typeof window === 'undefined') return;

    const passeId = localStorage.getItem('passe_id');
    const ecoleId = localStorage.getItem('ecole_id');
    const nomEtudiant = localStorage.getItem('nom_etudiant');
    const promo = localStorage.getItem('promo');
    const rawReponses = localStorage.getItem('reponses');

    if (!passeId || !ecoleId || !nomEtudiant || !promo || !rawReponses) {
      router.replace('/');
      return;
    }

    let parsedReponses;
    try {
      parsedReponses = JSON.parse(rawReponses);
    } catch {
      parsedReponses = answers;
    }

    const payload = {
      passe_id: passeId,
      ecole_id: ecoleId,
      nom_etudiant: nomEtudiant,
      promo,
      reponses: parsedReponses,
    };

    const response = await fetch('/api/submit-test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setSubmitting(false);
      return;
    }

    const data = await response.json();
    if (data?.session_id) {
      router.replace(`/resultats?session_id=${encodeURIComponent(data.session_id)}`);
      return;
    }

    setSubmitting(false);
  };

  return (
    <main style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Question {currentIndex + 1} de {QUESTIONS.length}</span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{ width: '100%', height: 10, background: '#e5e7eb', borderRadius: 9999 }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: '#2563eb', borderRadius: 9999 }} />
          </div>
        </div>

        <section style={{ border: '1px solid #d1d5db', borderRadius: 16, padding: 24, background: '#ffffff' }}>
          <h2 style={{ margin: 0, marginBottom: 12, fontSize: 24 }}>{question.dimension}</h2>
          <p style={{ margin: 0, marginBottom: 24, color: '#374151' }}>{question.question}</p>

          <div style={{ display: 'grid', gap: 12 }}>
            {[0, 1, 2, 3].map((optionIndex) => {
              const optionText = question.options?.[optionIndex] ?? `Option ${optionIndex + 1}`;
              const checked = answers[currentIndex] === optionIndex;

              return (
                <label
                  key={optionIndex}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: checked ? '2px solid #2563eb' : '1px solid #d1d5db',
                    background: checked ? '#eff6ff' : '#f9fafb',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${currentIndex}`}
                    value={optionIndex}
                    checked={checked}
                    onChange={() => handleAnswerChange(optionIndex)}
                    style={{ marginRight: 12 }}
                  />
                  <span>{optionText}</span>
                </label>
              );
            })}
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button
            type="button"
            onClick={goPrevious}
            disabled={currentIndex === 0}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              border: '1px solid #d1d5db',
              background: currentIndex === 0 ? '#f3f4f6' : '#ffffff',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            Précédent
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={answers[currentIndex] === -1 || submitting}
            style={{
              padding: '12px 20px',
              borderRadius: 10,
              border: 'none',
              background: '#2563eb',
              color: '#ffffff',
              cursor: answers[currentIndex] === -1 || submitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isLastQuestion ? (submitting ? 'Envoi...' : 'Soumettre') : 'Suivant'}
          </button>
        </div>
      </div>
    </main>
  );
}
