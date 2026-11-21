import React, { useState, useEffect } from 'react';
import { KNOWLEDGE_ARTICLES, TRAINING_MODULES } from './knowledgeData';

export default function KnowledgeHub({ mode, initialItemId, onNavigate }) {
  // mode: 'reference' (Раздел 04) или 'training' (Раздел 03)
  const [selectedArticleId, setSelectedArticleId] = useState(
    initialItemId || KNOWLEDGE_ARTICLES[0].id
  );
  const [selectedTrainingId, setSelectedTrainingId] = useState(
    initialItemId || TRAINING_MODULES[0].id
  );
  const [completedSteps, setCompletedSteps] = useState(() => {
    const saved = localStorage.getItem('bor_training_progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    if (mode === 'reference' && initialItemId) {
      setSelectedArticleId(initialItemId);
    }
    if (mode === 'training' && initialItemId) {
      setSelectedTrainingId(initialItemId);
    }
  }, [mode, initialItemId]);

  const toggleChecklistStep = (moduleId, idx) => {
    const key = `${moduleId}_${idx}`;
    const updated = { ...completedSteps, [key]: !completedSteps[key] };
    setCompletedSteps(updated);
    localStorage.setItem('bor_training_progress', JSON.stringify(updated));
  };

  if (mode === 'reference') {
    const activeArticle =
      KNOWLEDGE_ARTICLES.find((a) => a.id === selectedArticleId) || KNOWLEDGE_ARTICLES[0];

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Левое меню тем справочника */}
        <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            📚 Темы инженерного справочника
          </div>
          {KNOWLEDGE_ARTICLES.map((art) => {
            const isSelected = art.id === activeArticle.id;
            return (
              <button
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                style={{
                  padding: '12px 14px',
                  textAlign: 'left',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  backgroundColor: isSelected ? 'rgba(56, 189, 248, 0.12)' : '#161b22',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid #2d3748',
                  color: '#f8fafc'
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: '700', color: isSelected ? '#38bdf8' : '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                  {art.category}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.35' }}>{art.title}</div>
              </button>
            );
          })}
        </div>

        {/* Правая панель: Детальный разбор + YouTube */}
        <div style={{ backgroundColor: '#11161f', padding: '28px', borderRadius: '14px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>
            {activeArticle.badge}
          </div>

          <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: '800', color: '#f8fafc', lineHeight: '1.3' }}>
            {activeArticle.title}
          </h2>

          <p style={{ margin: '0 0 22px 0', fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', paddingBottom: '18px', borderBottom: '1px solid #1e293b' }}>
            {activeArticle.summary}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '26px' }}>
            {activeArticle.details.map((paragraph, index) => (
              <div
                key={index}
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#161b22',
                  borderRadius: '10px',
                  borderLeft: '3px solid #10b981',
                  fontSize: '14px',
                  color: '#e2e8f0',
                  lineHeight: '1.6'
                }}
              >
                {paragraph}
              </div>
            ))}
          </div>

          {/* Кнопка перехода на YouTube и возврата в сборку */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid #1e293b' }}>
            <a
              href={activeArticle.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 20px',
                borderRadius: '10px',
                backgroundColor: '#dc2626',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '13px',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)'
              }}
            >
              <span>▶</span>
              <span>{activeArticle.youtubeLabel}</span>
            </a>

            <button
              onClick={() => onNavigate('gear')}
              style={{
                padding: '11px 18px',
                borderRadius: '10px',
                border: '1px solid #10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                color: '#34d399',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              🪖 Применить в сборке снаряжения →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // РЕЖИМ ОБУЧЕНИЯ (Раздел 03)
  const activeTraining =
    TRAINING_MODULES.find((t) => t.id === selectedTrainingId) || TRAINING_MODULES[0];

  const completedCount = activeTraining.checklist.filter(
    (_, idx) => completedSteps[`${activeTraining.id}_${idx}`]
  ).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px', alignItems: 'start' }}>
      {/* Список учебных модулей */}
      <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
          🎯 Программа подготовки
        </div>
        {TRAINING_MODULES.map((mod) => {
          const isSelected = mod.id === activeTraining.id;
          return (
            <button
              key={mod.id}
              onClick={() => setSelectedTrainingId(mod.id)}
              style={{
                padding: '12px 14px',
                textAlign: 'left',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.12)' : '#161b22',
                border: isSelected ? '1px solid #f59e0b' : '1px solid #2d3748',
                color: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: '700', color: isSelected ? '#f59e0b' : '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>
                <span>{mod.duration}</span>
                <span>{mod.level}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '700', lineHeight: '1.35' }}>{mod.title}</div>
            </button>
          );
        })}
      </div>

      {/* Интерактивный чек-лист модуля + видеоурок */}
      <div style={{ backgroundColor: '#11161f', padding: '28px', borderRadius: '14px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
          <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
            {activeTraining.duration} • {activeTraining.level}
          </span>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>
            Освоено пунктов: {completedCount} из {activeTraining.checklist.length}
          </span>
        </div>

        <h2 style={{ margin: '0 0 12px 0', fontSize: '24px', fontWeight: '800', color: '#f8fafc', lineHeight: '1.3' }}>
          {activeTraining.title}
        </h2>

        <p style={{ margin: '0 0 22px 0', fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', paddingBottom: '18px', borderBottom: '1px solid #1e293b' }}>
          {activeTraining.description}
        </p>

        <div style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '12px' }}>
          Интерактивный контрольный лист (отмечайте изученное):
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '26px' }}>
          {activeTraining.checklist.map((step, idx) => {
            const isChecked = !!completedSteps[`${activeTraining.id}_${idx}`];
            return (
              <div
                key={idx}
                onClick={() => toggleChecklistStep(activeTraining.id, idx)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '14px 16px',
                  backgroundColor: isChecked ? 'rgba(16, 185, 129, 0.1)' : '#161b22',
                  border: isChecked ? '1px solid #10b981' : '1px solid #2d3748',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: isChecked ? 'none' : '2px solid #475569',
                    backgroundColor: isChecked ? '#10b981' : 'transparent',
                    color: '#064e3b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '13px',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  {isChecked ? '✓' : ''}
                </div>
                <div style={{ fontSize: '14px', color: isChecked ? '#a7f3d0' : '#e2e8f0', lineHeight: '1.55' }}>
                  {step}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid #1e293b' }}>
          <a
            href={activeTraining.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 20px',
              borderRadius: '10px',
              backgroundColor: '#dc2626',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '13px',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)'
            }}
          >
            <span>▶</span>
            <span>{activeTraining.youtubeLabel}</span>
          </a>

          <button
            onClick={() => onNavigate('reference')}
            style={{
              padding: '11px 18px',
              borderRadius: '10px',
              border: '1px solid #38bdf8',
              backgroundColor: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            📚 Открыть инженерный справочник →
          </button>
        </div>
      </div>
    </div>
  );
}