import React, { useState, useEffect } from 'react';
import { GEAR_ROLES, GEAR_CATEGORIES } from './gearData';

export default function GearConfigurator({ currency, customRate, onCurrencyChange, currencies, formatPrice }) {
  const [role, setRole] = useState('assault');
  const currentRole = GEAR_ROLES[role];

  const [selectedArmor, setSelectedArmor] = useState(GEAR_CATEGORIES.armor[1]);
  const [selectedHelmet, setSelectedHelmet] = useState(GEAR_CATEGORIES.helmet[0]);
  const [selectedLoadout, setSelectedLoadout] = useState(GEAR_CATEGORIES.loadout[1]);
  const [selectedOptics, setSelectedOptics] = useState(GEAR_CATEGORIES.optics[0]);
  const [selectedUniform, setSelectedUniform] = useState(GEAR_CATEGORIES.uniform[0]);

  const [kitName, setKitName] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedKits, setSavedKits] = useState(() => {
    const saved = localStorage.getItem('bor_saved_gear');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bor_saved_gear', JSON.stringify(savedKits));
  }, [savedKits]);

  const handleRoleChange = (roleKey) => {
    setRole(roleKey);
    if (roleKey === 'uav') {
      setSelectedArmor(GEAR_CATEGORIES.armor[0]);
      setSelectedHelmet(GEAR_CATEGORIES.helmet[2]);
      setSelectedLoadout(GEAR_CATEGORIES.loadout[2]);
    } else if (roleKey === 'medic') {
      setSelectedArmor(GEAR_CATEGORIES.armor[1]);
      setSelectedLoadout(GEAR_CATEGORIES.loadout[3]);
    } else if (roleKey === 'recon') {
      setSelectedArmor(GEAR_CATEGORIES.armor[0]);
      setSelectedOptics(GEAR_CATEGORIES.optics[1]);
    } else {
      setSelectedArmor(GEAR_CATEGORIES.armor[1]);
      setSelectedHelmet(GEAR_CATEGORIES.helmet[0]);
      setSelectedLoadout(GEAR_CATEGORIES.loadout[1]);
    }
  };

  // Расчёты веса, защиты и бюджета
  const totalWeightKg = Number((
    selectedArmor.weight +
    selectedHelmet.weight +
    selectedLoadout.weight +
    selectedOptics.weight +
    selectedUniform.weight
  ).toFixed(2));

  const totalUsd =
    selectedArmor.price +
    selectedHelmet.price +
    selectedLoadout.price +
    selectedOptics.price +
    selectedUniform.price;

  const rawProtection = selectedArmor.protection + selectedHelmet.protection + selectedOptics.protection + selectedUniform.protection;
  const protectionPercent = Math.min(100, Math.round((rawProtection / 195) * 100));

  const weightRatio = totalWeightKg / currentRole.maxRecommendedWeight;
  let mobilityStatus = 'Оптимальный баланс';
  let statusColor = '#10b981';

  if (weightRatio > 1.15) {
    mobilityStatus = 'Критический перегруз (низкая скорость)';
    statusColor = '#ef4444';
  } else if (weightRatio > 1.0) {
    mobilityStatus = 'Повышенная нагрузка на суставы';
    statusColor = '#f59e0b';
  } else if (weightRatio < 0.75) {
    mobilityStatus = 'Высокая маневренность / Лёгкий класс';
    statusColor = '#38bdf8';
  }

  const weightPercent = Math.min(100, Math.round((totalWeightKg / 35) * 100));

  // Предупреждения
  const warnings = [];
  if (totalWeightKg > currentRole.maxRecommendedWeight) {
    warnings.push(`Вес комплекта (${totalWeightKg} кг) превышает норму для роли «${currentRole.title}» (${currentRole.maxRecommendedWeight} кг).`);
  }
  if (role === 'assault' && selectedArmor.id === 'ar1' && selectedHelmet.id === 'hl3') {
    warnings.push('Критически низкая баллистическая защита для штурмовых задач.');
  }
  if (role === 'uav' && selectedArmor.id === 'ar3') {
    warnings.push('Тяжёлый штурмовой бронекомплект сильно снизит мобильность расчёта БПЛА.');
  }

  const handleCopySpec = () => {
    const title = kitName.trim() ? `Комплект: ${kitName} (${currentRole.title})` : `Комплект: ${currentRole.title}`;
    const text = `🪖 БОР | ${title}\n💰 БЮДЖЕТ: ${formatPrice(totalUsd)}\n⚖️ БОЕВОЙ ВЕС: ${totalWeightKg} кг (норма до ${currentRole.maxRecommendedWeight} кг)\n🛡 ИНДЕКС ЗАЩИТЫ: ${protectionPercent}%\n━━━━━━━━━━━━━━━━━━━━\n• Бронезащита: ${selectedArmor.name} (${selectedArmor.weight} кг | ${formatPrice(selectedArmor.price)})\n• Шлем и связь: ${selectedHelmet.name} (${selectedHelmet.weight} кг | ${formatPrice(selectedHelmet.price)})\n• БК и снаряжение: ${selectedLoadout.name} (${selectedLoadout.weight} кг | ${formatPrice(selectedLoadout.price)})\n• Оптика и электроника: ${selectedOptics.name} (${selectedOptics.weight} кг | ${formatPrice(selectedOptics.price)})\n• Форма и обувь: ${selectedUniform.name} (${selectedUniform.weight} кг | ${formatPrice(selectedUniform.price)})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveKit = () => {
    const name = kitName.trim() || `${currentRole.title} (${totalWeightKg} кг)`;
    const newKit = {
      id: Date.now(),
      name,
      role,
      armorId: selectedArmor.id,
      helmetId: selectedHelmet.id,
      loadoutId: selectedLoadout.id,
      opticsId: selectedOptics.id,
      uniformId: selectedUniform.id,
      summary: `${formatPrice(totalUsd)} • ${totalWeightKg} кг • Защита ${protectionPercent}%`
    };
    setSavedKits([newKit, ...savedKits]);
    setKitName('');
  };

  const handleLoadKit = (kit) => {
    setRole(kit.role);
    setSelectedArmor(GEAR_CATEGORIES.armor.find(i => i.id === kit.armorId) || GEAR_CATEGORIES.armor[0]);
    setSelectedHelmet(GEAR_CATEGORIES.helmet.find(i => i.id === kit.helmetId) || GEAR_CATEGORIES.helmet[0]);
    setSelectedLoadout(GEAR_CATEGORIES.loadout.find(i => i.id === kit.loadoutId) || GEAR_CATEGORIES.loadout[0]);
    setSelectedOptics(GEAR_CATEGORIES.optics.find(i => i.id === kit.opticsId) || GEAR_CATEGORIES.optics[0]);
    setSelectedUniform(GEAR_CATEGORIES.uniform.find(i => i.id === kit.uniformId) || GEAR_CATEGORIES.uniform[0]);
  };

  const handleDeleteKit = (id) => {
    setSavedKits(savedKits.filter(k => k.id !== id));
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

  const renderSection = (title, items, selectedItem, onSelect) => (
    <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b' }}>
      <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map(item => (
          <button key={item.id} onClick={() => onSelect(item)} style={getCardStyle(selectedItem?.id === item.id)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.name}</span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#34d399', whiteSpace: 'nowrap' }}>{formatPrice(item.price)}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
              Вес: <strong style={{ color: '#e2e8f0' }}>{item.weight} кг</strong> {item.protection > 0 ? `• Защита: +${item.protection} ед.` : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Выбор специализации бойца */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', backgroundColor: '#11161f', padding: '14px 18px', borderRadius: '12px', border: '1px solid #1e293b' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase' }}>Специализация комплекта</div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '2px' }}>{currentRole.description}</div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', backgroundColor: '#161b22', padding: '4px', borderRadius: '10px', border: '1px solid #2d3748' }}>
          {Object.keys(GEAR_ROLES).map(rKey => {
            const active = role === rKey;
            return (
              <button
                key={rKey}
                onClick={() => handleRoleChange(rKey)}
                style={{
                  padding: '7px 14px', fontSize: '13px', fontWeight: '700', borderRadius: '7px', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  backgroundColor: active ? '#3b82f6' : 'transparent',
                  color: active ? '#fff' : '#94a3b8'
                }}
              >
                {GEAR_ROLES[rKey].title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Двухколоночная сетка */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '28px', alignItems: 'start' }}>
        
        {/* ЛЕВАЯ КОЛОНКА */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {renderSection('01. Бронезащита (Плитник и баллистика)', GEAR_CATEGORIES.armor, selectedArmor, setSelectedArmor)}
          {renderSection('02. Защита головы и активные наушники', GEAR_CATEGORIES.helmet, selectedHelmet, setSelectedHelmet)}
          {renderSection('03. Боекомплект, медицина и рюкзак', GEAR_CATEGORIES.loadout, selectedLoadout, setSelectedLoadout)}
          {renderSection('04. Связь, оптика и приборы наблюдения', GEAR_CATEGORIES.optics, selectedOptics, setSelectedOptics)}
          {renderSection('05. Полевая форма и обувь', GEAR_CATEGORIES.uniform, selectedUniform, setSelectedUniform)}
        </div>

        {/* ПРАВАЯ КОЛОНКА: Сводка по экипировке */}
        <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
            
            {/* Блок бюджета */}
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  💰 Стоимость комплекта
                </span>
                <div style={{ display: 'flex', gap: '4px', backgroundColor: '#0b0e14', padding: '3px', borderRadius: '6px', border: '1px solid #1e293b' }}>
                  {Object.keys(currencies).map(curr => (
                    <button
                      key={curr}
                      onClick={() => onCurrencyChange(curr)}
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
              <div style={{ fontSize: '30px', fontWeight: '800', color: '#f8fafc', letterSpacing: '-0.5px' }}>
                {formatPrice(totalUsd)}
              </div>
            </div>

            {/* Показатели бойца */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ● СВОДКА НАГРУЗКИ
              </span>
              <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: statusColor, fontWeight: '600', border: `1px solid ${statusColor}40` }}>
                {mobilityStatus}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
              <div style={{ backgroundColor: '#161b22', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Общий боевой вес</div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: statusColor, marginTop: '2px' }}>{totalWeightKg} <span style={{ fontSize: '14px', color: '#64748b' }}>кг</span></div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Норма роли: до {currentRole.maxRecommendedWeight} кг</div>
              </div>

              <div style={{ backgroundColor: '#161b22', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Индекс защиты</div>
                <div style={{ fontSize: '26px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>{protectionPercent}<span style={{ fontSize: '14px', color: '#64748b' }}>%</span></div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>Баллистика + оптика</div>
              </div>
            </div>

            {/* Шкала весовой нагрузки */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '5px' }}>
                <span>Шкала весовой нагрузки</span>
                <span>{totalWeightKg} / 35.0 кг</span>
              </div>
              <div style={{ width: '100%', height: '7px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${weightPercent}%`, height: '100%', backgroundColor: statusColor, transition: 'width 0.3s ease, background-color 0.3s ease' }} />
              </div>
            </div>

            {/* Предупреждения */}
            {warnings.length > 0 ? (
              <div style={{ padding: '12px 14px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#f87171', marginBottom: '4px' }}>⚠️ РЕКОМЕНДАЦИИ ПО КОМПЛЕКТУ</div>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#fca5a5', fontSize: '12px', lineHeight: '1.4' }}>
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            ) : (
              <div style={{ padding: '10px 14px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', marginBottom: '18px', fontSize: '12px', color: '#6ee7b7', fontWeight: '500' }}>
                ✅ Вес и защита сбалансированы под задачи роли
              </div>
            )}

            {/* Сохранение и копирование */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Название комплекта (например: Основной штурм)"
                value={kitName}
                onChange={(e) => setKitName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2d3748', backgroundColor: '#0b0e14', color: '#fff', fontSize: '13px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button
                  onClick={handleSaveKit}
                  style={{ padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#10b981', color: '#064e3b', fontWeight: '700', fontSize: '13px' }}
                >
                  💾 Сохранить комплект
                </button>
                <button
                  onClick={handleCopySpec}
                  style={{ padding: '10px', borderRadius: '8px', border: '1px solid #3b82f6', cursor: 'pointer', backgroundColor: copied ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)', color: '#fff', fontWeight: '700', fontSize: '13px' }}
                >
                  {copied ? '✅ Скопировано!' : '📋 Копировать ведомость'}
                </button>
              </div>
            </div>

          </div>

          {/* Сохранённые комплекты */}
          {savedKits.length > 0 && (
            <div style={{ backgroundColor: '#11161f', padding: '18px', borderRadius: '14px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '12px' }}>
                🎒 Сохранённые комплекты ({savedKits.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedKits.map(kit => (
                  <div key={kit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', backgroundColor: '#161b22', borderRadius: '8px', border: '1px solid #2d3748' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '13px', color: '#f8fafc' }}>{kit.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{kit.summary}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleLoadKit(kit)} style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                        Открыть
                      </button>
                      <button onClick={() => handleDeleteKit(kit.id)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', cursor: 'pointer', fontSize: '11px' }}>
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
  );
}