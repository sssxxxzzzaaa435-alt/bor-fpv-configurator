import React, { useState, useEffect } from 'react';
import { GEAR_ROLES, GEAR_CATEGORIES } from './gearData';
import SoldierViewer3D from './SoldierViewer3D';

export default function GearConfigurator({ onOpenKnowledge }) {
  const [role, setRole] = useState('assault');
  const currentRole = GEAR_ROLES[role];

  const [selectedArmor, setSelectedArmor] = useState(GEAR_CATEGORIES.armor[1]);
  const [selectedModules, setSelectedModules] = useState(GEAR_CATEGORIES.modules[1]);
  const [selectedHelmet, setSelectedHelmet] = useState(GEAR_CATEGORIES.helmet[0]);
  const [selectedLoadout, setSelectedLoadout] = useState(GEAR_CATEGORIES.loadout[1]);
  const [selectedOptics, setSelectedOptics] = useState(GEAR_CATEGORIES.optics[0]);
  const [selectedUniform, setSelectedUniform] = useState(GEAR_CATEGORIES.uniform[0]);

  const [kitName, setKitName] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedKits, setSavedKits] = useState(() => {
    const saved = localStorage.getItem('bor_saved_gear_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bor_saved_gear_v2', JSON.stringify(savedKits));
  }, [savedKits]);

  const handleRoleChange = (roleKey) => {
    setRole(roleKey);
    if (roleKey === 'uav') {
      setSelectedArmor(GEAR_CATEGORIES.armor[0]);
      setSelectedModules(GEAR_CATEGORIES.modules[0]);
      setSelectedHelmet(GEAR_CATEGORIES.helmet[2]);
      setSelectedLoadout(GEAR_CATEGORIES.loadout[2]);
    } else if (roleKey === 'medic') {
      setSelectedArmor(GEAR_CATEGORIES.armor[1]);
      setSelectedModules(GEAR_CATEGORIES.modules[1]);
      setSelectedLoadout(GEAR_CATEGORIES.loadout[3]);
    } else if (roleKey === 'recon') {
      setSelectedArmor(GEAR_CATEGORIES.armor[0]);
      setSelectedModules(GEAR_CATEGORIES.modules[0]);
      setSelectedOptics(GEAR_CATEGORIES.optics[1]);
    } else {
      setSelectedArmor(GEAR_CATEGORIES.armor[1]);
      setSelectedModules(GEAR_CATEGORIES.modules[2]);
      setSelectedHelmet(GEAR_CATEGORIES.helmet[0]);
      setSelectedLoadout(GEAR_CATEGORIES.loadout[1]);
    }
  };

  // Расчёты боевого веса и площади защиты (дм²)
  const totalWeightKg = Number((
    selectedArmor.weight +
    selectedModules.weight +
    selectedHelmet.weight +
    selectedLoadout.weight +
    selectedOptics.weight +
    selectedUniform.weight
  ).toFixed(2));

  const totalAreaDm2 = Number((
    selectedArmor.areaDm2 +
    selectedModules.areaDm2 +
    selectedHelmet.areaDm2 +
    selectedLoadout.areaDm2 +
    selectedOptics.areaDm2 +
    selectedUniform.areaDm2
  ).toFixed(1));

  // Уникальные защищённые зоны
  const allProtectedZones = Array.from(
    new Set([
      ...selectedArmor.zones,
      ...selectedModules.zones,
      ...selectedHelmet.zones,
      ...selectedLoadout.zones,
      ...selectedOptics.zones
    ])
  );

  // Оценка мобильности
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
  const areaPercent = Math.min(100, Math.round((totalAreaDm2 / 75) * 100));

  // Инженерные рекомендации и предупреждения
  const warnings = [];
  if (totalWeightKg > currentRole.maxRecommendedWeight) {
    warnings.push(`Масса выкладки (${totalWeightKg} кг) превышает норму для роли «${currentRole.title}» (${currentRole.maxRecommendedWeight} кг).`);
  }
  if (totalAreaDm2 < currentRole.minRecommendedAreaDm2) {
    warnings.push(`Площадь защиты (${totalAreaDm2} дм²) ниже рекомендуемой для задач роли «${currentRole.title}» (от ${currentRole.minRecommendedAreaDm2} дм²).`);
  }
  if (role === 'assault' && selectedHelmet.id === 'hl3') {
    warnings.push('Пластиковый Bump-шлем не имеет баллистической защиты от осколков.');
  }

  const handleCopySpec = () => {
    const title = kitName.trim() ? `Комплект: ${kitName} (${currentRole.title})` : `Комплект: ${currentRole.title}`;
    const text = `🪖 БОР | ТТХ КОМПЛЕКТА ЭКИПИРОВКИ\n📌 ${title}\n⚖️ БОЕВОЙ ВЕС: ${totalWeightKg} кг (норма до ${currentRole.maxRecommendedWeight} кг)\n📐 ПЛОЩАДЬ ЗАЩИТЫ: ${totalAreaDm2} дм²\n🛡 ЗАКРЫТЫЕ ЗОНЫ: ${allProtectedZones.join(', ') || 'Нет'}\n━━━━━━━━━━━━━━━━━━━━\n01. Плитник: ${selectedArmor.name} [${selectedArmor.protectionClass}] (${selectedArmor.weight} кг)\n02. Модули защиты: ${selectedModules.name} [${selectedModules.protectionClass}] (${selectedModules.weight} кг)\n03. Шлем и слух: ${selectedHelmet.name} [${selectedHelmet.protectionClass}] (${selectedHelmet.weight} кг)\n04. Выкладка и БК: ${selectedLoadout.name} (${selectedLoadout.weight} кг)\n05. Связь и оптика: ${selectedOptics.name} (${selectedOptics.weight} кг)\n06. Форма и обувь: ${selectedUniform.name} (${selectedUniform.weight} кг)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveKit = () => {
    const name = kitName.trim() || `${currentRole.title} (${totalWeightKg} кг • ${totalAreaDm2} дм²)`;
    const newKit = {
      id: Date.now(),
      name,
      role,
      armorId: selectedArmor.id,
      modulesId: selectedModules.id,
      helmetId: selectedHelmet.id,
      loadoutId: selectedLoadout.id,
      opticsId: selectedOptics.id,
      uniformId: selectedUniform.id,
      summary: `${totalWeightKg} кг • Площадь ${totalAreaDm2} дм²`
    };
    setSavedKits([newKit, ...savedKits]);
    setKitName('');
  };

  const handleLoadKit = (kit) => {
    setRole(kit.role);
    setSelectedArmor(GEAR_CATEGORIES.armor.find(i => i.id === kit.armorId) || GEAR_CATEGORIES.armor[0]);
    setSelectedModules(GEAR_CATEGORIES.modules.find(i => i.id === kit.modulesId) || GEAR_CATEGORIES.modules[0]);
    setSelectedHelmet(GEAR_CATEGORIES.helmet.find(i => i.id === kit.helmetId) || GEAR_CATEGORIES.helmet[0]);
    setSelectedLoadout(GEAR_CATEGORIES.loadout.find(i => i.id === kit.loadoutId) || GEAR_CATEGORIES.loadout[0]);
    setSelectedOptics(GEAR_CATEGORIES.optics.find(i => i.id === kit.opticsId) || GEAR_CATEGORIES.optics[0]);
    setSelectedUniform(GEAR_CATEGORIES.uniform.find(i => i.id === kit.uniformId) || GEAR_CATEGORIES.uniform[0]);
  };

  const handleDeleteKit = (id) => {
    setSavedKits(savedKits.filter(k => k.id !== id));
  };

  // Обработка клика по микро-значку (переход в Справочник или Обучение)
  const handleTagClick = (e, tag) => {
    e.stopPropagation();
    if (tag.articleId) {
      onOpenKnowledge('reference', tag.articleId);
    } else if (tag.trainingId) {
      onOpenKnowledge('training', tag.trainingId);
    }
  };

  const renderSection = (title, items, selectedItem, onSelect) => (
    <div style={{ backgroundColor: '#11161f', padding: '14px', borderRadius: '12px', border: '1px solid #1e293b' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.map(item => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              style={{
                padding: '11px 13px',
                borderRadius: '9px',
                cursor: 'pointer',
                color: '#f8fafc',
                transition: 'all 0.15s ease',
                backgroundColor: isSelected ? 'rgba(16, 185, 129, 0.12)' : '#161b22',
                border: isSelected ? '1px solid #10b981' : '1px solid #2d3748',
                boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.15)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ fontWeight: '700', fontSize: '13px', lineHeight: '1.35' }}>{item.name}</span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', whiteSpace: 'nowrap', backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                  {item.weight} кг
                </span>
              </div>

              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                {item.material}
              </div>

              {/* Интерактивные микро-значки (ссылки в Справочник / Обучение) */}
              {item.tags && item.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '8px' }}>
                  {item.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={(e) => handleTagClick(e, tag)}
                      title={tag.articleId ? 'Открыть разбор в Справочнике' : 'Открыть модуль в Обучении'}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 7px',
                        borderRadius: '5px',
                        fontSize: '10px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        backgroundColor: tag.articleId ? 'rgba(56, 189, 248, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        border: tag.articleId ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid rgba(245, 158, 11, 0.35)',
                        color: tag.articleId ? '#7dd3fc' : '#fcd34d',
                        transition: 'transform 0.1s'
                      }}
                    >
                      <span>{tag.icon}</span>
                      <span>{tag.label}</span>
                      <span style={{ opacity: 0.7 }}>↗</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  // Передаём объединённый индекс брони в 3D-манекен (если выбран напашник или полный обвес)
  const effectiveArmorFor3D =
    selectedModules.id === 'md2' || selectedArmor.id === 'ar3'
      ? { id: 'ar3' }
      : selectedModules.id === 'md1'
      ? { id: 'ar3' }
      : selectedArmor;

  return (
    <div>
      {/* Выбор специализации бойца */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', backgroundColor: '#11161f', padding: '14px 18px', borderRadius: '12px', border: '1px solid #1e293b' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#3b82f6', textTransform: 'uppercase' }}>Тактическая специализация</div>
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

      {/* ТРЁХКОЛОНОЧНАЯ СЕТКА: Слева выбор — По центру 3D-боец — Справа инженерные ТТХ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', alignItems: 'start' }}>
        
        {/* ЛЕВАЯ КОЛОНКА: Выбор элементов с микро-значками */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {renderSection('01. Бронежилет и основные плиты', GEAR_CATEGORIES.armor, selectedArmor, setSelectedArmor)}
          {renderSection('02. Дополнительные модули (Напашник / Шея / Плечи)', GEAR_CATEGORIES.modules, selectedModules, setSelectedModules)}
          {renderSection('03. Защита головы и активный слух', GEAR_CATEGORIES.helmet, selectedHelmet, setSelectedHelmet)}
          {renderSection('04. Эшелонирование БК, медицина и рюкзак', GEAR_CATEGORIES.loadout, selectedLoadout, setSelectedLoadout)}
          {renderSection('05. Связь, оптика и ночные приборы', GEAR_CATEGORIES.optics, selectedOptics, setSelectedOptics)}
          {renderSection('06. Полевая форма (IRR) и обувь', GEAR_CATEGORIES.uniform, selectedUniform, setSelectedUniform)}
        </div>

        {/* ЦЕНТРАЛЬНАЯ КОЛОНКА: Интерактивный 3D-манекен */}
        <div style={{ position: 'sticky', top: '20px' }}>
          <SoldierViewer3D
            armor={effectiveArmorFor3D}
            helmet={selectedHelmet}
            loadout={selectedLoadout}
            optics={selectedOptics}
            uniform={selectedUniform}
          />
        </div>

        {/* ПРАВАЯ КОЛОНКА: Профессиональные ТТХ, площадь защиты и материалы */}
        <div style={{ position: 'sticky', top: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#11161f', padding: '20px', borderRadius: '14px', border: '1px solid #2d3748', boxShadow: '0 10px 30px rgba(0,0,0,0.4)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ● ИНЖЕНЕРНЫЕ ТТХ КОМПЛЕКТА
              </span>
              <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.05)', color: statusColor, fontWeight: '600', border: `1px solid ${statusColor}40` }}>
                {mobilityStatus}
              </span>
            </div>

            {/* Главные метрики: Боевой вес и Площадь защиты */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Масса выкладки</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: statusColor, marginTop: '2px' }}>{totalWeightKg} <span style={{ fontSize: '13px', color: '#64748b' }}>кг</span></div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Норма роли: до {currentRole.maxRecommendedWeight} кг</div>
              </div>

              <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Площадь защиты</div>
                <div style={{ fontSize: '24px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>{totalAreaDm2} <span style={{ fontSize: '13px', color: '#64748b' }}>дм²</span></div>
                <div style={{ fontSize: '10px', color: '#94a3b8' }}>Рекомендуемо: от {currentRole.minRecommendedAreaDm2} дм²</div>
              </div>
            </div>

            {/* Шкалы нагрузки и площади */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                  <span>Весовая нагрузка на опорно-двигательный аппарат</span>
                  <span>{totalWeightKg} / 35.0 кг</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${weightPercent}%`, height: '100%', backgroundColor: statusColor, transition: 'width 0.3s ease' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                  <span>Закрытие жизненно важных зон (площадь)</span>
                  <span>{totalAreaDm2} / 75.0 дм²</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${areaPercent}%`, height: '100%', backgroundColor: '#38bdf8', transition: 'width 0.3s ease' }} />
                </div>
              </div>
            </div>

            {/* Защищённые анатомические зоны */}
            <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '14px' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px' }}>
                🛡 Перекрытые анатомические проекции:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {allProtectedZones.length > 0 ? (
                  allProtectedZones.map((zone, i) => (
                    <span key={i} style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'rgba(16, 185, 129, 0.14)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      ✓ {zone}
                    </span>
                  ))
                ) : (
                  <span style={{ fontSize: '11px', color: '#f87171' }}>Нет баллистической защиты</span>
                )}
              </div>
            </div>

            {/* Сводка по материалам и ориентирам производителей */}
            <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b', marginBottom: '16px', fontSize: '11px', lineHeight: '1.5' }}>
              <div style={{ fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', marginBottom: '6px' }}>
                🏭 Профильные системы и производители:
              </div>
              <div style={{ color: '#cbd5e1', marginBottom: '4px' }}>
                <strong style={{ color: '#94a3b8' }}>Броня:</strong> {selectedArmor.brands}
              </div>
              <div style={{ color: '#cbd5e1', marginBottom: '4px' }}>
                <strong style={{ color: '#94a3b8' }}>Шлем:</strong> {selectedHelmet.brands}
              </div>
              <div style={{ color: '#cbd5e1', marginBottom: '4px' }}>
                <strong style={{ color: '#94a3b8' }}>Оптика / Связь:</strong> {selectedOptics.brands}
              </div>
              <div style={{ color: '#cbd5e1' }}>
                <strong style={{ color: '#94a3b8' }}>Терморегуляция:</strong> {selectedArmor.ventilation}
              </div>
            </div>

            {/* Предупреждения */}
            {warnings.length > 0 ? (
              <div style={{ padding: '10px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#f87171', marginBottom: '4px' }}>⚠️ ИНЖЕНЕРНЫЕ ЗАМЕЧАНИЯ</div>
                <ul style={{ margin: 0, paddingLeft: '16px', color: '#fca5a5', fontSize: '11px', lineHeight: '1.4' }}>
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            ) : (
              <div style={{ padding: '10px 12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', marginBottom: '16px', fontSize: '11px', color: '#6ee7b7', fontWeight: '500' }}>
                ✅ Масса и площадь защиты сбалансированы под задачи роли
              </div>
            )}

            {/* Сохранение и копирование ведомости ТТХ */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input
                type="text"
                placeholder="Название профиля (например: Штурм застройки)"
                value={kitName}
                onChange={(e) => setKitName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #2d3748', backgroundColor: '#0b0e14', color: '#fff', fontSize: '12px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={handleSaveKit}
                  style={{ padding: '9px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: '#10b981', color: '#064e3b', fontWeight: '700', fontSize: '12px' }}
                >
                  💾 Сохранить профиль
                </button>
                <button
                  onClick={handleCopySpec}
                  style={{ padding: '9px', borderRadius: '8px', border: '1px solid #3b82f6', cursor: 'pointer', backgroundColor: copied ? '#3b82f6' : 'rgba(59, 130, 246, 0.1)', color: '#fff', fontWeight: '700', fontSize: '12px' }}
                >
                  {copied ? '✅ Скопировано!' : '📋 Копировать ТТХ'}
                </button>
              </div>
            </div>

          </div>

          {/* Сохранённые профили */}
          {savedKits.length > 0 && (
            <div style={{ backgroundColor: '#11161f', padding: '16px', borderRadius: '14px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px' }}>
                🎒 Сохранённые профили ({savedKits.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {savedKits.map(kit => (
                  <div key={kit.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', backgroundColor: '#161b22', borderRadius: '8px', border: '1px solid #2d3748' }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '12px', color: '#f8fafc' }}>{kit.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{kit.summary}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleLoadKit(kit)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>
                        Открыть
                      </button>
                      <button onClick={() => handleDeleteKit(kit.id)} style={{ padding: '4px 7px', borderRadius: '6px', border: '1px solid #ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', cursor: 'pointer', fontSize: '11px' }}>
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