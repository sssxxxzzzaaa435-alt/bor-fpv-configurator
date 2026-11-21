import React, { useState, useEffect } from 'react';
import { DRONE_SPECS, PAYLOAD_OPTIONS } from './droneData';
import GearConfigurator from './GearConfigurator';
import KnowledgeHub from './KnowledgeHub';

const PORTAL_SECTIONS = [
  {
    id: 'drone',
    num: '01',
    icon: '🚁',
    title: 'Конфигуратор БПЛА',
    subtitle: 'Инженерный расчёт силовой установки, тяги, токов, времени полёта и спецификации пайки',
    status: 'Активен',
    accent: '#10b981',
    ready: true
  },
  {
    id: 'gear',
    num: '02',
    icon: '🪖',
    title: 'Сборка снаряжения (3D)',
    subtitle: 'Подбор бронезащиты, модулей (напашник/шея), площадь закрытия в дм² и 3D-манекен',
    status: 'Активен',
    accent: '#3b82f6',
    ready: true
  },
  {
    id: 'training',
    num: '03',
    icon: '🎯',
    title: 'Обучение и тренажёры',
    subtitle: 'Пошаговые чек-листы подготовки: эшелонирование, медицина MARCH, проверка БПЛА и ПНВ',
    status: 'Активен',
    accent: '#f59e0b',
    ready: true
  },
  {
    id: 'reference',
    num: '04',
    icon: '📚',
    title: 'Инженерный справочник',
    subtitle: 'Материалы (Cordura, IRR, СВМПЭ, керамика), классы защиты Бр1–Бр5 и видеоразборы',
    status: 'Активен',
    accent: '#38bdf8',
    ready: true
  },
  {
    id: 'slot5',
    num: '05',
    icon: '📡',
    title: 'Связь и частоты РЭБ',
    subtitle: 'Сетка частот, антенны, ретрансляторы и противодействие средствам подавления',
    status: 'Модуль в резерве',
    accent: '#64748b',
    ready: false
  },
  {
    id: 'slot6',
    num: '06',
    icon: '🩺',
    title: 'Тактическая медицина',
    subtitle: 'Комплектация аптечек 1-го и 2-го эшелона, эвакуация и протоколы помощи',
    status: 'Модуль в резерве',
    accent: '#64748b',
    ready: false
  },
  {
    id: 'slot7',
    num: '07',
    icon: '🧭',
    title: 'Топография и ориентирование',
    subtitle: 'Работа с координатами, азимутами, баллистическими поправками и рельефом',
    status: 'Модуль в резерве',
    accent: '#64748b',
    ready: false
  },
  {
    id: 'slot8',
    num: '08',
    icon: '💣',
    title: 'Инженерная безопасность',
    subtitle: 'Маркировка, типы взрывателей, дистанции поражения и правила осмотра',
    status: 'Модуль в резерве',
    accent: '#64748b',
    ready: false
  },
  {
    id: 'slot9',
    num: '09',
    icon: '🔧',
    title: 'Полевая мастерская',
    subtitle: 'Диагностика, ремонт композитов, восстановление АКБ и полевой инструмент',
    status: 'Модуль в резерве',
    accent: '#64748b',
    ready: false
  }
];

function App() {
  // 'hub' — главный экран 3x3 на весь экран; или 'drone' | 'gear' | 'training' | 'reference'
  const [activeSection, setActiveSection] = useState('hub');
  const [knowledgeTargetId, setKnowledgeTargetId] = useState(null);

  // Стартовый экран-заставка
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  const handleEnterApp = () => {
    if (splashFading) return;
    setSplashFading(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 650);
  };

  // Переход из микро-значков экипировки прямо в нужную статью Справочника или Обучения
  const handleOpenKnowledge = (sectionMode, itemId) => {
    setKnowledgeTargetId(itemId);
    setActiveSection(sectionMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- СОСТОЯНИЯ КОНФИГУРАТОРА БПЛА (Раздел 01) ---
  const [frameSize, setFrameSize] = useState('5"');
  const currentSpec = DRONE_SPECS[frameSize];

  const [selectedFrame, setSelectedFrame] = useState(currentSpec.frames[0]);
  const [selectedMotor, setSelectedMotor] = useState(currentSpec.motors[0]);
  const [selectedProp, setSelectedProp] = useState(currentSpec.props[0]);
  const [selectedEsc, setSelectedEsc] = useState(currentSpec.escs[0]);
  const [selectedBattery, setSelectedBattery] = useState(currentSpec.batteries[0]);
  const [selectedPayload, setSelectedPayload] = useState(PAYLOAD_OPTIONS[0]);

  const [buildName, setBuildName] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState(() => {
    const saved = localStorage.getItem('fpv_saved_builds_pro');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fpv_saved_builds_pro', JSON.stringify(savedBuilds));
  }, [savedBuilds]);

  const handleFrameSizeChange = (size) => {
    setFrameSize(size);
    const spec = DRONE_SPECS[size];
    setSelectedFrame(spec.frames[0]);
    setSelectedMotor(spec.motors[0]);
    setSelectedProp(spec.props[0]);
    setSelectedEsc(spec.escs[0]);
    setSelectedBattery(spec.batteries[0]);
  };

  // Инженерная физика БПЛА (без коммерческих цен)
  const miscElectronicsWeight = frameSize === '3"' ? 25 : frameSize === '10"' ? 85 : 45;
  const dryWeight = Math.round(
    selectedFrame.weight +
    selectedMotor.weight * 4 +
    selectedProp.weight * 4 +
    selectedEsc.weight +
    miscElectronicsWeight
  );

  const totalWeight = dryWeight + selectedBattery.weight + selectedPayload.weight;
  const totalThrust = Math.round(selectedMotor.maxThrust * 4 * selectedProp.thrustFactor);
  const thrustToWeight = Number((totalThrust / totalWeight).toFixed(1));

  const singleMotorAmps = selectedMotor.amps;
  const totalPeakAmps = singleMotorAmps * 4;

  const calculateWiring = (totalAmps, motorAmps, cells, size) => {
    let powerWire = '16 AWG';
    let connector = 'XT30';
    let smokeStopper = '1A (лимит)';

    if (totalAmps > 220) {
      powerWire = '10 AWG';
      connector = 'XT90 Anti-Spark';
      smokeStopper = 'Мультиметр (высокий ток)';
    } else if (totalAmps > 140) {
      powerWire = '12 AWG';
      connector = 'XT60 Amass';
      smokeStopper = '2A (лимит)';
    } else if (totalAmps > 85) {
      powerWire = '14 AWG';
      connector = 'XT60';
      smokeStopper = '2A (лимит)';
    }

    let motorWire = '20 AWG';
    if (motorAmps > 55 || size === '10"') motorWire = '14 AWG';
    else if (motorAmps > 35 || size === '7"') motorWire = '16 AWG';
    else if (motorAmps > 20) motorWire = '18 AWG';

    let capVoltage = cells >= 8 ? '50V' : cells >= 6 ? '35V' : '25V';
    let capCapacity = (totalAmps > 200 || cells >= 8) ? '2200uF' : (totalAmps > 110 || cells >= 6) ? '1000uF' : '470uF';
    let tvsNote = (totalAmps > 110 || cells >= 6) ? ' + TVS-диод' : '';

    return {
      powerWire,
      motorWire,
      connector,
      capacitor: `${capVoltage} ${capCapacity} Low-ESR${tvsNote}`,
      smokeStopper
    };
  };

  const dynamicWiring = calculateWiring(totalPeakAmps, singleMotorAmps, selectedBattery.cells, frameSize);

  const nominalVoltage = selectedBattery.cells * 3.7;
  const totalWh = Math.round((selectedBattery.mah / 1000) * nominalVoltage);
  const usableWh = totalWh * 0.8;
  const gramsPerWatt = frameSize === '3"' ? 4.5 : frameSize === '5"' ? 6.0 : frameSize === '7"' ? 7.8 : 9.2;
  const hoverWatts = totalWeight / gramsPerWatt;

  const cruiseMinutes = Math.max(1, Math.round((usableWh / hoverWatts) * 60));
  const freestyleMinutes = Math.max(1, Math.round(cruiseMinutes * 0.42));

  const warnings = [];
  if (selectedFrame && selectedMotor && selectedEsc && selectedBattery) {
    if (selectedFrame.mount !== selectedMotor.mount) {
      warnings.push(`Крепления не совпадают: рама ${selectedFrame.mount} мм, моторы ${selectedMotor.mount} мм.`);
    }
    if (selectedMotor.amps > selectedEsc.maxAmps) {
      warnings.push(`Перегруз по току: пик мотора (${selectedMotor.amps}A) выше лимита ESC (${selectedEsc.maxAmps}A).`);
    } else if (selectedEsc.maxAmps - selectedMotor.amps < 5) {
      warnings.push(`Малый запас по току (<5A). При длительной нагрузке ESC может перегреться.`);
    }
    if (selectedBattery.cells > selectedEsc.maxCells) {
      warnings.push(`Выгорит ESC: выбрана батарея ${selectedBattery.cells}S, лимит регулятора ${selectedEsc.maxCells}S.`);
    }
    if (selectedBattery.cells > selectedMotor.recommendedCells) {
      warnings.push(`Перегрев обмоток моторов: рассчитаны на ${selectedMotor.recommendedCells}S, выбрана батарея ${selectedBattery.cells}S.`);
    } else if (selectedBattery.cells < selectedMotor.recommendedCells) {
      warnings.push(`Снижение тяги: моторы под ${selectedMotor.recommendedCells}S на батарее ${selectedBattery.cells}S не выйдут на расчётные обороты.`);
    }
    if (thrustToWeight < 2.2) {
      warnings.push(`Критический перевес: тяговооружённость ${thrustToWeight}:1. Недостаточный запас тяги для манёвра и ветра.`);
    }
  }

  let flightCharacter = 'Сбалансированный';
  let statusColor = '#10b981';
  if (thrustToWeight < 2.5) {
    flightCharacter = 'Критический перевес';
    statusColor = '#ef4444';
  } else if (thrustToWeight < 4.5) {
    flightCharacter = 'Дальний крейсер / Носитель';
    statusColor = '#3b82f6';
  } else if (thrustToWeight < 7.0) {
    flightCharacter = 'Уверенный манёвренный';
    statusColor = '#10b981';
  } else {
    flightCharacter = 'Высокоскоростной перехват';
    statusColor = '#f59e0b';
  }

  const twrPercent = Math.min(100, Math.round((thrustToWeight / 10) * 100));

  const handleCopySpec = () => {
    const title = buildName.trim() ? `Борт: ${buildName} (${currentSpec.title})` : `Борт: ${currentSpec.title}`;
    const text = `🚁 БОР | ИНЖЕНЕРНАЯ СПЕЦИФИКАЦИЯ БПЛА\n📌 ${title}\n━━━━━━━━━━━━━━━━━━━━\n🛠 КОМПОНЕНТЫ:\n• Рама: ${selectedFrame.name} (${selectedFrame.mount} мм, ${selectedFrame.weight} г)\n• Моторы (4 шт): ${selectedMotor.name} (${selectedMotor.recommendedCells}S, пик ${selectedMotor.amps}A)\n• Пропеллеры: ${selectedProp.name} (коэф. тяги x${selectedProp.thrustFactor})\n• ESC: ${selectedEsc.name} (до ${selectedEsc.maxAmps}A, ${selectedEsc.maxCells}S)\n• АКБ: ${selectedBattery.name} (${totalWh} Вт·ч, ${selectedBattery.weight} г)\n• Полезная нагрузка: ${selectedPayload.name} (+${selectedPayload.weight} г)\n\n📊 ЛЁТНЫЕ ТТХ:\n• Взлётный вес (AUW): ${totalWeight} г (сухой: ${dryWeight} г)\n• Тяговооружённость: ${thrustToWeight} : 1 (суммарная тяга ~${totalThrust} г)\n• Расчётное время: ~${cruiseMinutes} мин (крейсер) / ~${freestyleMinutes} мин (активный режим)\n\n⚡ ЭЛЕКТРИКА И ПАЙКА:\n• Пиковый ток: ${totalPeakAmps}A\n• Силовой провод: ${dynamicWiring.powerWire} (${dynamicWiring.connector})\n• Провода моторов: ${dynamicWiring.motorWire}\n• Защита по питанию: ${dynamicWiring.capacitor}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveBuild = () => {
    const name = buildName.trim() || `${frameSize} ${selectedFrame.name}`;
    const newBuild = {
      id: Date.now(),
      name,
      frameSize,
      frameId: selectedFrame.id,
      motorId: selectedMotor.id,
      propId: selectedProp.id,
      escId: selectedEsc.id,
      batteryId: selectedBattery.id,
      payloadId: selectedPayload.id,
      summary: `${totalWeight}г • Тяга ${thrustToWeight}:1 • ~${cruiseMinutes} мин`
    };
    setSavedBuilds([newBuild, ...savedBuilds]);
    setBuildName('');
  };

  const handleLoadBuild = (build) => {
    const spec = DRONE_SPECS[build.frameSize];
    if (!spec) return;
    setFrameSize(build.frameSize);
    setSelectedFrame(spec.frames.find(f => f.id === build.frameId) || spec.frames[0]);
    setSelectedMotor(spec.motors.find(m => m.id === build.motorId) || spec.motors[0]);
    setSelectedProp(spec.props.find(p => p.id === build.propId) || spec.props[0]);
    setSelectedEsc(spec.escs.find(e => e.id === build.escId) || spec.escs[0]);
    setSelectedBattery(spec.batteries.find(b => b.id === build.batteryId) || spec.batteries[0]);
    setSelectedPayload(PAYLOAD_OPTIONS.find(c => c.id === build.payloadId) || PAYLOAD_OPTIONS[0]);
  };

  const handleDeleteBuild = (id) => {
    setSavedBuilds(savedBuilds.filter(b => b.id !== id));
  };

  const getCardStyle = (isSelected) => ({
    padding: '11px 13px',
    textAlign: 'left',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#f8fafc',
    transition: 'all 0.15s ease',
    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : '#161b22',
    border: isSelected ? '1px solid #10b981' : '1px solid #2d3748',
    boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.15)' : 'none',
  });

  const activeSectionMeta = PORTAL_SECTIONS.find(s => s.id === activeSection);

  return (
    <>
      {/* СТАРТОВЫЙ ЭКРАН-ЗАСТАВКА */}
      {showSplash && (
        <div
          onClick={handleEnterApp}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0b0e14',
            backgroundImage: `linear-gradient(to bottom, rgba(11, 14, 20, 0.35), rgba(11, 14, 20, 0.85)), url('/hero-fpv.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: splashFading ? 0 : 1,
            transform: splashFading ? 'scale(1.06)' : 'scale(1)',
            transition: 'opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1), transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '36px 56px',
              borderRadius: '20px',
              backgroundColor: 'rgba(11, 14, 20, 0.58)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '4px', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '12px' }}>
              TACTICAL & FPV ENGINEERING PORTAL
            </div>
            <h1 style={{ margin: 0, fontSize: '72px', fontWeight: '900', letterSpacing: '8px', color: '#ffffff', textShadow: '0 4px 24px rgba(59, 130, 246, 0.5)' }}>
              БОР
            </h1>
            <p style={{ margin: '14px 0 28px 0', fontSize: '15px', color: '#cbd5e1', maxWidth: '440px' }}>
              Некоммерческая инженерно-тактическая база: проектирование БПЛА, подбор баллистической защиты, материалы и обучение
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 28px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #3b82f6, #10b981)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '14px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
              }}
            >
              <span>Открыть терминал</span>
              <span>→</span>
            </div>
          </div>
        </div>
      )}

      {/* ЭКРАН 1: ГЛАВНОЕ МЕНЮ 3x3 НА ВЕСЬ ЭКРАН (9 одинаковых прямоугольников) */}
      {activeSection === 'hub' ? (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 24px',
            boxSizing: 'border-box',
            backgroundColor: '#0b0e14'
          }}
        >
          {/* Компактная верхняя строка терминала */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #3b82f6, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '16px', color: '#fff' }}>
                Б
              </div>
              <div>
                <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', color: '#f8fafc' }}>БОР</span>
                <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '12px', fontWeight: '600' }}>
                  ВЫБЕРИТЕ РАЗДЕЛ ПОРТАЛА (9 МОДУЛЕЙ)
                </span>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '700', padding: '5px 12px', borderRadius: '999px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              ● НЕКОММЕРЧЕСКИЙ ПРОЕКТ • ТТХ И БАЗА ЗНАНИЙ
            </div>
          </div>

          {/* СЕТКА 3x3 НА ВЕСЬ ЭКРАН */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridTemplateRows: 'repeat(3, 1fr)',
              gap: '16px',
              minHeight: 'calc(100vh - 90px)'
            }}
          >
            {PORTAL_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  if (sec.ready) {
                    setKnowledgeTargetId(null);
                    setActiveSection(sec.id);
                  }
                }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  padding: '22px 24px',
                  borderRadius: '14px',
                  backgroundColor: sec.ready ? '#11161f' : '#0e131b',
                  border: sec.ready ? `1px solid ${sec.accent}55` : '1px solid #1e293b',
                  cursor: sec.ready ? 'pointer' : 'default',
                  opacity: sec.ready ? 1 : 0.55,
                  transition: 'all 0.2s ease',
                  boxShadow: sec.ready ? '0 8px 24px rgba(0, 0, 0, 0.35)' : 'none',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (sec.ready) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = sec.accent;
                    e.currentTarget.style.backgroundColor = '#161d29';
                  }
                }}
                onMouseLeave={(e) => {
                  if (sec.ready) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = `${sec.accent}55`;
                    e.currentTarget.style.backgroundColor = '#11161f';
                  }
                }}
              >
                {/* Верхняя строка карточки: номер + статус */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontSize: '13px', fontWeight: '900', letterSpacing: '1.5px', color: sec.accent }}>
                    РАЗДЕЛ {sec.num}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      backgroundColor: sec.ready ? `${sec.accent}20` : 'rgba(255,255,255,0.04)',
                      color: sec.ready ? sec.accent : '#64748b',
                      border: `1px solid ${sec.ready ? `${sec.accent}40` : '#1e293b'}`
                    }}
                  >
                    {sec.status}
                  </span>
                </div>

                {/* Центр карточки: иконка и название */}
                <div style={{ margin: '10px 0' }}>
                  <div style={{ fontSize: '34px', marginBottom: '8px' }}>{sec.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc', lineHeight: '1.25' }}>
                    {sec.title}
                  </div>
                </div>

                {/* Низ карточки: описание */}
                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.45' }}>
                  {sec.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ЭКРАН 2: ВНУТРЕННИЕ РАЗДЕЛЫ С КНОПКОЙ ВОЗВРАТА В СЕТКУ 3x3 */
        <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '22px 24px' }}>
          
          {/* Навигационная шапка портала */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', paddingBottom: '18px', borderBottom: '1px solid #1e293b', marginBottom: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                onClick={() => setActiveSection('hub')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 15px',
                  borderRadius: '10px',
                  border: '1px solid #3b82f6',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  color: '#93c5fd',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <span>⊞</span>
                <span>Все разделы (3×3)</span>
              </button>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{activeSectionMeta?.icon}</span>
                  <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '900', color: '#f8fafc' }}>
                    {activeSectionMeta?.title}
                  </h1>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                  БОР • РАЗДЕЛ {activeSectionMeta?.num}
                </div>
              </div>
            </div>

            {/* Быстрый переключатель между 4 активными разделами */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', backgroundColor: '#11161f', padding: '5px', borderRadius: '12px', border: '1px solid #2d3748' }}>
              {PORTAL_SECTIONS.filter(s => s.ready).map(sec => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setKnowledgeTargetId(null);
                      setActiveSection(sec.id);
                    }}
                    style={{
                      padding: '8px 14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: isActive ? '#10b981' : 'transparent',
                      color: isActive ? '#064e3b' : '#94a3b8'
                    }}
                  >
                    {sec.num}. {sec.icon} {sec.title.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </header>

          {/* СОДЕРЖИМОЕ АКТИВНОГО РАЗДЕЛА */}
          {activeSection === 'gear' && (
            <GearConfigurator onOpenKnowledge={handleOpenKnowledge} />
          )}

          {activeSection === 'training' && (
            <KnowledgeHub
              mode="training"
              initialItemId={knowledgeTargetId}
              onNavigate={(targetSec) => setActiveSection(targetSec)}
            />
          )}

          {activeSection === 'reference' && (
            <KnowledgeHub
              mode="reference"
              initialItemId={knowledgeTargetId}
              onNavigate={(targetSec) => setActiveSection(targetSec)}
            />
          )}

          {activeSection === 'drone' && (
            <>
              {/* Переключатель классов дрона + кнопка в справочник */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', backgroundColor: '#11161f', padding: '12px 18px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#94a3b8' }}>
                    Класс платформы: <strong style={{ color: '#f8fafc' }}>{currentSpec.title}</strong>
                  </span>
                  <button
                    onClick={() => handleOpenKnowledge('reference', 'fpv-tech')}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(56, 189, 248, 0.12)',
                      border: '1px solid rgba(56, 189, 248, 0.35)',
                      color: '#7dd3fc'
                    }}
                  >
                    📚 Ликбез: частоты, АКБ и пайка ↗
                  </button>
                </div>

                <div style={{ display: 'flex', backgroundColor: '#161b22', padding: '4px', borderRadius: '10px', border: '1px solid #2d3748' }}>
                  {Object.keys(DRONE_SPECS).map(size => {
                    const active = frameSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => handleFrameSizeChange(size)}
                        style={{
                          padding: '7px 18px', fontSize: '13px', fontWeight: '700', borderRadius: '7px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                          backgroundColor: active ? '#3b82f6' : 'transparent',
                          color: active ? '#fff' : '#94a3b8',
                          boxShadow: active ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none'
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Основная двухколоночная сетка БПЛА (чистые ТТХ без цен) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px', alignItems: 'start' }}>
                
                {/* ЛЕВАЯ КОЛОНКА: Выбор комплектующих */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ backgroundColor: '#11161f', padding: '16