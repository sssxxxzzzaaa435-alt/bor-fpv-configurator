import React, { useState, useEffect } from 'react';
import { DRONE_SPECS, PAYLOAD_OPTIONS } from './droneData';

const CURRENCIES = {
  USD: { symbol: '$', rate: 1, label: 'USD ($)' },
  EUR: { symbol: '€', rate: 0.92, label: 'EUR (€)' },
  PLN: { symbol: 'zł', rate: 4.0, label: 'PLN (zł)' },
  RUB: { symbol: '₽', rate: 95, label: 'RUB (₽)' }
};

function App() {
  // Состояния стартового экрана (Splash Screen)
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);

  const handleEnterApp = () => {
    if (splashFading) return;
    setSplashFading(true);
    // Через 700 мс (когда анимация растворения завершится) убираем экран из DOM
    setTimeout(() => {
      setShowSplash(false);
    }, 700);
  };

  const [frameSize, setFrameSize] = useState('5"');
  const currentSpec = DRONE_SPECS[frameSize];

  // Состояния компонентов
  const [selectedFrame, setSelectedFrame] = useState(currentSpec.frames[0]);
  const [selectedMotor, setSelectedMotor] = useState(currentSpec.motors[0]);
  const [selectedProp, setSelectedProp] = useState(currentSpec.props[0]);
  const [selectedEsc, setSelectedEsc] = useState(currentSpec.escs[0]);
  const [selectedBattery, setSelectedBattery] = useState(currentSpec.batteries[0]);
  const [selectedPayload, setSelectedPayload] = useState(PAYLOAD_OPTIONS[0]);

  // Настройки валюты
  const [currency, setCurrency] = useState('USD');
  const [customRate, setCustomRate] = useState(1);

  const handleCurrencyChange = (currKey) => {
    setCurrency(currKey);
    setCustomRate(CURRENCIES[currKey].rate);
  };

  const formatPrice = (usdAmount) => {
    const val = Math.round(usdAmount * customRate);
    return currency === 'USD' || currency === 'EUR' 
      ? `${CURRENCIES[currency].symbol}${val}` 
      : `${val.toLocaleString('ru-RU')} ${CURRENCIES[currency].symbol}`;
  };

  // Состояния для сохранения и экспорта
  const [buildName, setBuildName] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedBuilds, setSavedBuilds] = useState(() => {
    const saved = localStorage.getItem('fpv_saved_builds');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('fpv_saved_builds', JSON.stringify(savedBuilds));
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

  // --- ФИЗИКА, ВЕС И ЦЕНА ---
  const miscElectronicsWeight = frameSize === '3"' ? 25 : frameSize === '10"' ? 85 : 45;
  const miscElectronicsPrice = frameSize === '3"' ? 65 : frameSize === '10"' ? 120 : 85;
  
  const dryWeight = Math.round(
    selectedFrame.weight + 
    (selectedMotor.weight * 4) + 
    (selectedProp.weight * 4) + 
    selectedEsc.weight + 
    miscElectronicsWeight
  );
  
  const totalWeight = dryWeight + selectedBattery.weight + selectedPayload.weight;
  const totalThrust = Math.round(selectedMotor.maxThrust * 4 * selectedProp.thrustFactor);
  const thrustToWeight = Number((totalThrust / totalWeight).toFixed(1));

  const baseDroneUsd = 
    selectedFrame.price + 
    (selectedMotor.price * 4) + 
    selectedProp.price + 
    selectedEsc.price + 
    selectedBattery.price + 
    miscElectronicsPrice;

  const totalBuildUsd = baseDroneUsd + selectedPayload.price;
  
  const singleMotorAmps = selectedMotor.amps;
  const totalPeakAmps = singleMotorAmps * 4;

  // Динамическая электрика
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

  // Время полета
  const nominalVoltage = selectedBattery.cells * 3.7;
  const usableWh = (selectedBattery.mah / 1000) * nominalVoltage * 0.8;
  const gramsPerWatt = frameSize === '3"' ? 4.5 : frameSize === '5"' ? 6.0 : frameSize === '7"' ? 7.8 : 9.2;
  const hoverWatts = totalWeight / gramsPerWatt;
  
  const cruiseMinutes = Math.max(1, Math.round((usableWh / hoverWatts) * 60));
  const freestyleMinutes = Math.max(1, Math.round(cruiseMinutes * 0.42));

  // Проверка совместимости
  const warnings = [];
  if (selectedFrame && selectedMotor && selectedEsc && selectedBattery) {
    if (selectedFrame.mount !== selectedMotor.mount) {
      warnings.push(`Крепления не совпадают: рама ${selectedFrame.mount} мм, моторы ${selectedMotor.mount} мм.`);
    }
    if (selectedMotor.amps > selectedEsc.maxAmps) {
      warnings.push(`Перегруз по току: пик мотора (${selectedMotor.amps}A) выше лимита ESC (${selectedEsc.maxAmps}A).`);
    } else if (selectedEsc.maxAmps - selectedMotor.amps < 5) {
      warnings.push(`Малый запас по току (<5A). В жару ESC может перегреться.`);
    }
    if (selectedBattery.cells > selectedEsc.maxCells) {
      warnings.push(`Сгорит ESC: выбрана батарея ${selectedBattery.cells}S, лимит регулятора ${selectedEsc.maxCells}S.`);
    }
    if (selectedBattery.cells > selectedMotor.recommendedCells) {
      warnings.push(`Сгорят моторы: рассчитаны на ${selectedMotor.recommendedCells}S, выбрана батарея ${selectedBattery.cells}S.`);
    } else if (selectedBattery.cells < selectedMotor.recommendedCells) {
      warnings.push(`Потеря мощности: моторы под ${selectedMotor.recommendedCells}S на батарее ${selectedBattery.cells}S будут вялыми.`);
    }
    if (thrustToWeight < 2.2) {
      warnings.push(`Критический перевес: тяговооруженность ${thrustToWeight}:1. Дрон едва оторвется от земли.`);
    }
  }

  let flightCharacter = 'Сбалансированный';
  let statusColor = '#10b981';
  if (thrustToWeight < 2.5) {
    flightCharacter = 'Критический перевес';
    statusColor = '#ef4444';
  } else if (thrustToWeight < 4.5) {
    flightCharacter = 'Плавный круиз / Long Range';
    statusColor = '#3b82f6';
  } else if (thrustToWeight < 7.0) {
    flightCharacter = 'Уверенный фристайл';
    statusColor = '#10b981';
  } else {
    flightCharacter = 'Гоночная ракета (Хардкор)';
    statusColor = '#f59e0b';
  }

  const twrPercent = Math.min(100, Math.round((thrustToWeight / 10) * 100));

  // Экспорт и сохранение
  const handleCopySpec = () => {
    const title = buildName.trim() ? `Сборка: ${buildName} (${currentSpec.title})` : `Сборка: ${currentSpec.title}`;
    const text = `🚁 БОР | ${title}\n💰 БЮДЖЕТ: ${formatPrice(totalBuildUsd)} (дрон: ${formatPrice(baseDroneUsd)} + нагрузка: ${formatPrice(selectedPayload.price)})\n━━━━━━━━━━━━━━━━━━━━\n🛠 КОМПЛЕКТУЮЩИЕ:\n• Рама: ${selectedFrame.name} (${formatPrice(selectedFrame.price)})\n• Моторы (4 шт): ${selectedMotor.name} (${formatPrice(selectedMotor.price * 4)})\n• Пропеллеры: ${selectedProp.name} (${formatPrice(selectedProp.price)})\n• ESC: ${selectedEsc.name} (${formatPrice(selectedEsc.price)})\n• АКБ: ${selectedBattery.name} (${formatPrice(selectedBattery.price)})\n• FPV-система и расходники: ~${formatPrice(miscElectronicsPrice)}\n• Нагрузка: ${selectedPayload.name} (${formatPrice(selectedPayload.price)})\n\n📊 ТЕЛЕМЕТРИЯ:\n• Взлетный вес: ${totalWeight} г (сухой: ${dryWeight} г)\n• Тяговооруженность: ${thrustToWeight} : 1 (~${totalThrust} г)\n• Полет: ~${cruiseMinutes} мин (круиз) / ~${freestyleMinutes} мин (фристайл)\n\n⚡ ЭЛЕКТРИКА:\n• Пиковый ток: ${totalPeakAmps}A\n• Силовой провод: ${dynamicWiring.powerWire} (${dynamicWiring.connector})\n• Провода моторов: ${dynamicWiring.motorWire}\n• Защита: ${dynamicWiring.capacitor}`;
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
      summary: `${formatPrice(totalBuildUsd)} • ${totalWeight}г • ${thrustToWeight}:1`
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
    padding: '12px 14px',
    textAlign: 'left',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#f8fafc',
    transition: 'all 0.15s ease',
    backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : '#161b22',
    border: isSelected ? '1px solid #10b981' : '1px solid #2d3748',
    boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.15)' : 'none',
  });

  return (
    <>
      {/* СТАРТОВЫЙ ЭКРАН-ЗАСТАВКА (SPLASH SCREEN) */}
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
            transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            userSelect: 'none'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              padding: '36px 56px',
              borderRadius: '20px',
              backgroundColor: 'rgba(11, 14, 20, 0.55)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: '700', letterSpacing: '4px', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '12px' }}>
              FPV SYSTEM ARCHITECT
            </div>
            <h1 style={{ margin: 0, fontSize: '72px', fontWeight: '900', letterSpacing: '8px', color: '#ffffff', textShadow: '0 4px 24px rgba(59, 130, 246, 0.5)' }}>
              БОР
            </h1>
            <p style={{ margin: '14px 0 28px 0', fontSize: '15px', color: '#cbd5e1', maxWidth: '400px' }}>
              Инженерный конфигуратор, расчет телеметрии и сметы беспилотных систем
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
              <span>Кликните для запуска</span>
              <span>→</span>
            </div>
          </div>
        </div>
      )}

      {/* ОСНОВНОЙ ИНТЕРФЕЙС КОНФИГУРАТОРА */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '24px',
          opacity: showSplash && !splashFading ? 0 : 1,
          transition: 'opacity 0.7s ease'
        }}
      >
        
        {/* Верхняя шапка */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #1e293b', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              🚁
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', letterSpacing: '1px', color: '#f8fafc' }}>
                БОР
              </h1>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>ИНЖЕНЕРНЫЙ КОНФИГУРАТОР И КАЛЬКУЛЯТОР СМЕТЫ</div>
            </div>
          </div>

          {/* Переключатель классов дрона */}
          <div style={{ display: 'flex', backgroundColor: '#161b22', padding: '4px', borderRadius: '10px', border: '1px solid #2d3748' }}>
            {Object.keys(DRONE_SPECS).map(size => {
              const active = frameSize === size;
              return (
                <button
                  key={size}
                  onClick={() => handleFrameSizeChange(size)}
                  style={{
                    padding: '8px 20px', fontSize: '14px', fontWeight: '700', borderRadius: '7px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
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
        </header>

        {/* Основная двухколоночная сетка */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px', alignItems: 'start' }}>
          
          {/* ЛЕВАЯ КОЛОНКА: Выбор железа */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Рама и Моторы */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>01. Рама (Frame)</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentSpec.frames.map(frame => (
                    <button key={frame.id} onClick={() => setSelectedFrame(frame)} style={getCardStyle(selectedFrame?.id === frame.id)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{frame.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399' }}>{formatPrice(frame.price)}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{frame.mount} мм • {frame.weight} г</div>
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
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399' }}>{formatPrice(motor.price * 4)}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{motor.mount} мм • {motor.amps}A • {motor.weight}г</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Пропеллеры и ESC */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>03. Пропеллеры</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentSpec.props.map(prop => (
                    <button key={prop.id} onClick={() => setSelectedProp(prop)} style={getCardStyle(selectedProp?.id === prop.id)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px' }}>{prop.name}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399', whiteSpace: 'nowrap' }}>{formatPrice(prop.price)}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Тяга x{prop.thrustFactor} • {prop.weight} г/шт</div>
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
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399' }}>{formatPrice(esc.price)}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>До {esc.maxAmps}A • До {esc.maxCells}S • {esc.weight}г</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Аккумулятор */}
            <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>05. Аккумулятор (LiPo / Li-Ion)</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {currentSpec.batteries.map(bat => (
                  <button key={bat.id} onClick={() => setSelectedBattery(bat)} style={getCardStyle(selectedBattery?.id === bat.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>{bat.name}</span>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399' }}>{formatPrice(bat.price)}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Вес: {bat.weight} г • Запас: {Math.round((bat.mah/1000) * bat.cells * 3.7)} Вт·ч</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Полезная нагрузка */}
            <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>06. Полезная нагрузка (Камера / Груз)</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '8px' }}>
                {PAYLOAD_OPTIONS.map(cam => (
                  <button key={cam.id} onClick={() => setSelectedPayload(cam)} style={getCardStyle(selectedPayload?.id === cam.id)}>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{cam.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '6px' }}>
                      <span style={{ color: '#94a3b8' }}>+{cam.weight} г</span>
                      <span style={{ color: '#34d399', fontWeight: '700' }}>{cam.price === 0 ? 'Бесплатно' : formatPrice(cam.price)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ПРАВАЯ КОЛОНКА: Закрепленная панель телеметрии и бюджета */}
          <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
              
              {/* БЛОК КАЛЬКУЛЯТОРА СТОИМОСТИ */}
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                    💰 Итоговый бюджет сборки
                  </span>
                  
                  {/* Переключатель валют */}
                  <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0b0e14', padding: '3px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                    {Object.keys(CURRENCIES).map(curr => (
                      <button
                        key={curr}
                        onClick={() => handleCurrencyChange(curr)}
                        style={{
                          padding: '3px 7px', fontSize: '11px', fontWeight: '700', borderRadius: '4px', border: 'none', cursor: 'pointer',
                          backgroundColor: currency === curr ? '#10b981' : 'transparent',
                          color: currency === curr ? '#064e3b' : '#94a3b8'
                        }}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '30px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.5px' }}>
                    {formatPrice(totalBuildUsd)}
                  </div>
                  {currency !== 'USD' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
                      <span>Курс 1$:</span>
                      <input
                        type="number"
                        step="0.1"
                        value={customRate}
                        onChange={(e) => setCustomRate(Math.max(0.01, Number(e.target.value)))}
                        style={{ width: '55px', padding: '2px 5px', borderRadius: '4px', border: '1px solid #2d3748', backgroundColor: '#0b0e14', color: '#fff', fontSize: '11px' }}
                      />
                    </div>
                  )}
                </div>

                {/* Разбивка цены */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <span>Дрон + FPV-система (~{formatPrice(miscElectronicsPrice)}): <strong>{formatPrice(baseDroneUsd)}</strong></span>
                  <span>Камера/груз: <strong>{formatPrice(selectedPayload.price)}</strong></span>
                </div>
              </div>

              {/* Заголовок телеметрии */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  ● LIVE TELEMETRY
                </span>
                <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: statusColor, fontWeight: '600', border: `1px solid ${statusColor}40` }}>
                  {flightCharacter}
                </span>
              </div>

              {/* 4 главных датчика */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Взлётный вес (AUW)</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginTop: '2px' }}>{totalWeight} <span style={{ fontSize: '13px', color: '#64748b' }}>г</span></div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Сухой: {dryWeight} г</div>
                </div>

                <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Тяговооружённость</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: statusColor, marginTop: '2px' }}>{thrustToWeight} <span style={{ fontSize: '13px', color: '#64748b' }}>: 1</span></div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Тяга: ~{totalThrust} г</div>
                </div>

                <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Круиз / Висение</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>~{cruiseMinutes} <span style={{ fontSize: '13px', color: '#64748b' }}>мин</span></div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Фристайл: ~{freestyleMinutes} мин</div>
                </div>

                <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Пиковый ток</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#fb923c', marginTop: '2px' }}>{totalPeakAmps} <span style={{ fontSize: '13px', color: '#64748b' }}>A</span></div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{singleMotorAmps}A / мотор</div>
                </div>
              </div>

              {/* Прогресс-бар тяговооруженности */}
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '5px' }}>
                  <span>Шкала динамики (TWR)</span>
                  <span>{thrustToWeight} / 10.0</span>
                </div>
                <div style={{ width: '100%', height: '7px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${twrPercent}%`, height: '100%', backgroundColor: statusColor, transition: 'width 0.3s ease, background-color 0.3s ease' }} />
                </div>
              </div>

              {/* Статус совместимости */}
              {warnings.length > 0 ? (
                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', marginBottom: '18px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#f87171', marginBottom: '4px' }}>⚠️ ОШИБКИ СОВМЕСТИМОСТИ</div>
                  <ul style={{ margin: 0, paddingLeft: '18px', color: '#fca5a5', fontSize: '12px', lineHeight: '1.4' }}>
                    {warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              ) : (
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', marginBottom: '18px', fontSize: '12px', color: '#6ee7b7', fontWeight: '500' }}>
                  ✅ Железо, токи и геометрия полностью совместимы
                </div>
              )}

              {/* Таблица пайки */}
              <div style={{ backgroundColor: '#161b22', padding: '12px 14px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '18px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#eab308', textTransform: 'uppercase', marginBottom: '8px' }}>⚡ Спецификация пайки</div>
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
                    <span style={{ color: '#94a3b8' }}>Конденсатор / защита:</span>
                    <span style={{ fontWeight: '600', color: '#f8fafc' }}>{dynamicWiring.capacitor}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8' }}>Smoke Stopper:</span>
                    <span style={{ fontWeight: '600', color: '#f8fafc' }}>{dynamicWiring.smokeStopper}</span>
                  </div>
                </div>
              </div>

              {/* Сохранение и экспорт */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Название сборки (например: Мой 5&quot; Фристайл)"
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
                    {copied ? '✅ Скопировано!' : '📋 Копировать смету'}
                  </button>
                </div>
              </div>

            </div>

            {/* Ангар */}
            {savedBuilds.length > 0 && (
              <div style={{ backgroundColor: '#11161f', padding: '18px', borderRadius: '14px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                  📁 Ангар сборок ({savedBuilds.length})
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
      </div>
    </>
  );
}

export default App;