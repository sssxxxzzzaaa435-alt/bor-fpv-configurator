import React, { useState, useEffect } from 'react';
import { DRONE_SPECS, PAYLOAD_OPTIONS } from './droneData';
import GearConfigurator from './GearConfigurator';
import KnowledgeHub from './KnowledgeHub';
import DroneSubModules from './DroneSubModules';
import GearSubModules from './GearSubModules';

const PORTAL_SECTIONS = [
  {
    id: 'drone',
    num: '01',
    icon: '🚁',
    title: 'Конфигуратор БПЛА',
    subtitle: 'Инженерный расчёт FPV, наземные комплексы НРК, станции НСУ и планирование полётов',
    status: 'Активен',
    accent: '#10b981',
    ready: true,
    defaultSubTab: 'fpv',
    subTabs: [
      { id: 'fpv', label: '1. FPV-дроны' },
      { id: 'ugv', label: '2. НРК' },
      { id: 'equipment', label: '3. Оборудование' },
      { id: 'flights', label: '4. Полёты' }
    ]
  },
  {
    id: 'gear',
    num: '02',
    icon: '🪖',
    title: 'Сборка снаряжения (3D)',
    subtitle: '3D-манекен бойца, сравнение броников и плит, типы касок и модульная защита в дм²',
    status: 'Активен',
    accent: '#3b82f6',
    ready: true,
    defaultSubTab: '3d',
    subTabs: [
      { id: '3d', label: '1. Общий 3D-обзор' },
      { id: 'armor', label: '2. Броники и плитоноски' },
      { id: 'helmets', label: '3. Каски' },
      { id: 'modules', label: '4. Модули и разгрузка' }
    ]
  },
  {
    id: 'training',
    num: '03',
    icon: '🎯',
    title: 'Обучение и тренажёры',
    subtitle: 'Пошаговые чек-листы подготовки: эшелонирование, медицина MARCH, проверка БПЛА и ПНВ',
    status: 'Активен',
    accent: '#f59e0b',
    ready: true,
    defaultSubTab: 'tr1',
    subTabs: [
      { id: 'tr1', label: '1. Подгонка брони' },
      { id: 'tr2', label: '2. Медицина MARCH' },
      { id: 'tr3', label: '3. Чек-лист БПЛА' },
      { id: 'tr4', label: '4. Работа в ПНВ' }
    ]
  },
  {
    id: 'reference',
    num: '04',
    icon: '📚',
    title: 'Инженерный справочник',
    subtitle: 'Материалы (Cordura, IRR, СВМПЭ, керамика), классы защиты Бр1–Бр5 и видеоразборы',
    status: 'Активен',
    accent: '#38bdf8',
    ready: true,
    defaultSubTab: 'cordura',
    subTabs: [
      { id: 'cordura', label: '1. Ткани и IRR' },
      { id: 'armor-classes', label: '2. Классы Бр1–Бр5' },
      { id: 'plate-materials', label: '3. СВМПЭ / Керамика' },
      { id: 'groin-neck', label: '4. Напашник и шея' },
      { id: 'fpv-tech', label: '5. Электроника FPV' }
    ]
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
  const [activeSection, setActiveSection] = useState('hub');
  const [activeSubTab, setActiveSubTab] = useState('fpv');

  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  const handleEnterApp = () => {
    if (splashFading) return;
    setSplashFading(true);
    setTimeout(() => {
      setShowSplash(false);
    }, 650);
  };

  // Открытие раздела из сетки 3x3
  const handleSelectSection = (sectionObj) => {
    if (!sectionObj.ready) return;
    setActiveSection(sectionObj.id);
    setActiveSubTab(sectionObj.defaultSubTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Переход из микро-значков экипировки прямо в нужную подвкладку Справочника или Обучения
  const handleOpenKnowledge = (sectionMode, itemId) => {
    setActiveSection(sectionMode);
    setActiveSubTab(itemId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- СОСТОЯНИЯ КОНФИГУРАТОРА БПЛА (Раздел 01 -> 1. FPV-дроны) ---
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
                onClick={() => handleSelectSection(sec)}
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

                <div style={{ margin: '10px 0' }}>
                  <div style={{ fontSize: '34px', marginBottom: '8px' }}>{sec.icon}</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc', lineHeight: '1.25' }}>
                    {sec.title}
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.45' }}>
                  {sec.subtitle}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '1340px', margin: '0 auto', padding: '22px 24px' }}>
          {/* ШАПКА РАЗДЕЛА: Слева возврат в меню 3x3, Справа — свои подпункты активного раздела */}
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

            {/* КОНТЕКСТНЫЕ ПОДПУНКТЫ АКТИВНОГО РАЗДЕЛА */}
            {activeSectionMeta?.subTabs && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', backgroundColor: '#11161f', padding: '5px', borderRadius: '12px', border: '1px solid #2d3748' }}>
                {activeSectionMeta.subTabs.map(tab => {
                  const isActive = activeSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSubTab(tab.id)}
                      style={{
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: '700',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        backgroundColor: isActive ? '#10b981' : 'transparent',
                        color: isActive ? '#064e3b' : '#94a3b8'
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </header>

          {/* РАЗДЕЛ 02: СБОРКА СНАРЯЖЕНИЯ И ЕГО ПОДПУНКТЫ */}
          {activeSection === 'gear' && (
            activeSubTab === '3d' ? (
              <GearConfigurator onOpenKnowledge={handleOpenKnowledge} />
            ) : (
              <GearSubModules subTab={activeSubTab} onGoTo3D={() => setActiveSubTab('3d')} />
            )
          )}

          {/* РАЗДЕЛ 03: ОБУЧЕНИЕ И ЕГО ПОДПУНКТЫ */}
          {activeSection === 'training' && (
            <KnowledgeHub
              mode="training"
              initialItemId={activeSubTab}
              onNavigate={(targetSec) => {
                const targetObj = PORTAL_SECTIONS.find(s => s.id === targetSec);
                if (targetObj) handleSelectSection(targetObj);
              }}
            />
          )}

          {/* РАЗДЕЛ 04: ИНЖЕНЕРНЫЙ СПРАВОЧНИК И ЕГО ПОДПУНКТЫ */}
          {activeSection === 'reference' && (
            <KnowledgeHub
              mode="reference"
              initialItemId={activeSubTab}
              onNavigate={(targetSec) => {
                const targetObj = PORTAL_SECTIONS.find(s => s.id === targetSec);
                if (targetObj) handleSelectSection(targetObj);
              }}
            />
          )}

          {/* РАЗДЕЛ 01: КОНФИГУРАТОР БПЛА И ЕГО ПОДПУНКТЫ */}
          {activeSection === 'drone' && (
            activeSubTab !== 'fpv' ? (
              <DroneSubModules subTab={activeSubTab} />
            ) : (
              <>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px', alignItems: 'start' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>01. Рама (Frame)</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {currentSpec.frames.map(frame => (
                            <button key={frame.id} onClick={() => setSelectedFrame(frame)} style={getCardStyle(selectedFrame?.id === frame.id)}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', fontSize: '14px' }}>{frame.name}</span>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8' }}>{frame.weight} г</span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Посадка моторов: {frame.mount} мм</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>02. Моторы (4 шт)</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {currentSpec.motors.map(motor => (
                            <button key={motor.id} onClick={() => setSelectedMotor(motor)} style={getCardStyle(selectedMotor?.id === motor.id)}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', fontSize: '14px' }}>{motor.name} <span style={{ color: '#3b82f6', fontSize: '12px' }}>({motor.recommendedCells}S)</span></span>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8' }}>{motor.weight * 4} г</span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Крепл. {motor.mount} мм • Пик {motor.amps}A • Тяга {motor.maxThrust}г</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>03. Пропеллеры</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {currentSpec.props.map(prop => (
                            <button key={prop.id} onClick={() => setSelectedProp(prop)} style={getCardStyle(selectedProp?.id === prop.id)}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '600', fontSize: '13px' }}>{prop.name}</span>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8', whiteSpace: 'nowrap' }}>{prop.weight * 4} г</span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Коэф. тяги: x{prop.thrustFactor}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>04. Регулятор (ESC)</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {currentSpec.escs.map(esc => (
                            <button key={esc.id} onClick={() => setSelectedEsc(esc)} style={getCardStyle(selectedEsc?.id === esc.id)}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '600', fontSize: '14px' }}>{esc.name}</span>
                                <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8' }}>{esc.weight} г</span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Ток до {esc.maxAmps}A • Напряжение до {esc.maxCells}S</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>05. Аккумулятор (LiPo / Li-Ion)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {currentSpec.batteries.map(bat => (
                          <button key={bat.id} onClick={() => setSelectedBattery(bat)} style={getCardStyle(selectedBattery?.id === bat.id)}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontWeight: '600', fontSize: '14px' }}>{bat.name}</span>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8' }}>{bat.weight} г</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Энергоёмкость: {Math.round((bat.mah / 1000) * bat.cells * 3.7)} Вт·ч</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>06. Полезная нагрузка (Оптика / Груз)</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                        {PAYLOAD_OPTIONS.map(cam => (
                          <button key={cam.id} onClick={() => setSelectedPayload(cam)} style={getCardStyle(selectedPayload?.id === cam.id)}>
                            <div style={{ fontWeight: '600', fontSize: '13px' }}>{cam.name}</div>
                            <div style={{ fontSize: '12px', marginTop: '6px', color: '#38bdf8', fontWeight: '700' }}>
                              Масса: +{cam.weight} г
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>
                          ● РАСЧЁТНЫЕ ТТХ БОРТА
                        </span>
                        <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: statusColor, fontWeight: '600', border: `1px solid ${statusColor}40` }}>
                          {flightCharacter}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                        <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Взлётный вес (AUW)</div>
                          <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginTop: '2px' }}>{totalWeight} <span style={{ fontSize: '13px', color: '#64748b' }}>г</span></div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Сухой борт: {dryWeight} г</div>
                        </div>

                        <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Тяговооружённость</div>
                          <div style={{ fontSize: '24px', fontWeight: '800', color: statusColor, marginTop: '2px' }}>{thrustToWeight} <span style={{ fontSize: '13px', color: '#64748b' }}>: 1</span></div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Макс. тяга: ~{totalThrust} г</div>
                        </div>

                        <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Время полёта</div>
                          <div style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>~{cruiseMinutes} <span style={{ fontSize: '13px', color: '#64748b' }}>мин</span></div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Активный режим: ~{freestyleMinutes} мин</div>
                        </div>

                        <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                          <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Пиковый ток / Запас</div>
                          <div style={{ fontSize: '22px', fontWeight: '800', color: '#fb923c', marginTop: '2px' }}>{totalPeakAmps} <span style={{ fontSize: '13px', color: '#64748b' }}>A</span></div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Батарея: {totalWh} Вт·ч ({gramsPerWatt} г/Вт)</div>
                        </div>
                      </div>

                      <div style={{ marginBottom: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '5px' }}>
                          <span>Шкала тяговооружённости (TWR)</span>
                          <span>{thrustToWeight} / 10.0</span>
                        </div>
                        <div style={{ width: '100%', height: '7px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${twrPercent}%`, height: '100%', backgroundColor: statusColor, transition: 'width 0.3s ease, background-color 0.3s ease' }} />
                        </div>
                      </div>

                      {warnings.length > 0 ? (
                        <div style={{ padding: '12px 14px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', marginBottom: '18px' }}>
                          <div style={{ fontSize: '12px', fontWeight: '700', color: '#f87171', marginBottom: '4px' }}>⚠️ ИНЖЕНЕРНЫЕ ОШИБКИ СОВМЕСТИМОСТИ</div>
                          <ul style={{ margin: 0, paddingLeft: '18px', color: '#fca5a5', fontSize: '12px', lineHeight: '1.4' }}>
                            {warnings.map((w, i) => <li key={i}>{w}</li>)}
                          </ul>
                        </div>
                      ) : (
                        <div style={{ padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', marginBottom: '18px', fontSize: '12px', color: '#6ee7b7', fontWeight: '500' }}>
                          ✅ Геометрия креплений, токи и напряжение полностью согласованы
                        </div>
                      )}

                      <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '18px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#eab308', textTransform: 'uppercase', marginBottom: '8px' }}>⚡ Спецификация монтажа и пайки</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '5px' }}>
                            <span style={{ color: '#94a3b8' }}>Силовой провод + разъём:</span>
                            <span style={{ fontWeight: '600', color: '#f8fafc' }}>{dynamicWiring.powerWire} ({dynamicWiring.connector})</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '5px' }}>
                            <span style={{ color: '#94a3b8' }}>Провода на моторы:</span>
                            <span style={{ fontWeight: '600', color: '#f8fafc' }}>{dynamicWiring.motorWire}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', paddingBottom: '5px' }}>
                            <span style={{ color: '#94a3b8' }}>Фильтрация / защита:</span>
                            <span style={{ fontWeight: '600', color: '#f8fafc' }}>{dynamicWiring.capacitor}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#94a3b8' }}>Первичный запуск:</span>
                            <span style={{ fontWeight: '600', color: '#f8fafc' }}>{dynamicWiring.smokeStopper}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input
                          type="text"
                          placeholder="Маркировка борта (например: 7&quot; Дальний носитель)"
                          value={buildName}
                          onChange={(e) => setBuildName(e.target.value)}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2d3748', backgroundColor: '#0b0e14', color: '#fff', fontSize: '13px' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <button
                            onClick={handleSaveBuild}
                            style={{ padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#10b981', color: '#064e3b', fontWeight: '700', fontSize: '13px' }}
                          >
                            💾 Сохранить в ангар
                          </button>
                          <button
                            onClick={handleCopySpec}
                            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #3b82f6', cursor: 'pointer', backgroundColor: copied ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)', color: '#fff', fontWeight: '700', fontSize: '13px' }}
                          >
                            {copied ? '✅ Скопировано!' : '📋 Копировать ТТХ'}
                          </button>
                        </div>
                      </div>
                    </div>

                    {savedBuilds.length > 0 && (
                      <div style={{ backgroundColor: '#11161f', padding: '18px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                          📁 Ангар конфигураций ({savedBuilds.length})
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {savedBuilds.map(build => (
                            <div key={build.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#161b22', borderRadius: '8px', border: '1px solid #2d3748' }}>
                              <div>
                                <div style={{ fontWeight: '600', fontSize: '13px', color: '#f8fafc' }}>{build.name}</div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{build.frameSize} • {build.summary}</div>
                              </div>
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button onClick={() => handleLoadBuild(build)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                                  Открыть
                                </button>
                                <button onClick={() => handleDeleteBuild(build.id)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', cursor: 'pointer', fontSize: '11px' }}>
                                  ✕
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )
          )}
        </div>
      )}
    </>
  );
}

export default App;