import React from 'react';

const ARMOR_SYSTEMS_COMPARE = [
  {
    type: 'Облегчённый плитник (Low-Vis / JPC)',
    examples: 'Crye JPC 2.0, Ferro Slickster, Ars Arma A-18',
    area: '15–18 дм² (только плиты)',
    weightEmpty: '0.55–0.85 кг',
    pros: 'Максимальная подвижность, минимальный перегрев, удобно работать в технике и с рюкзаком',
    cons: 'Открытые бока, низ живота и шея; при установке тяжёлых плит Бр5 давит на плечи без корсета'
  },
  {
    type: 'Корсетный модульный плитник (AVS / Структурный)',
    examples: 'Crye AVS, Атлас, Stich Profi Модульный',
    area: '28–36 дм² (с камербандами Бр1/Бр2)',
    weightEmpty: '1.3–1.8 кг',
    pros: 'Жёсткий корсет переносит до 40% веса с плеч на поясницу, позволяет крепить напашник и боковую защиту',
    cons: 'Сложнее подгонка по фигуре, выше тепловая нагрузка (обязателен КАП 16–20 мм)'
  },
  {
    type: 'Общевойсковой штурмовой бронежилет',
    examples: '6Б45 (Ратник), Триада-ТКО КБС Стрелок, NFM THOR',
    area: '48–56 дм² (круговая + шея + пах + плечи)',
    weightEmpty: '2.4–3.2 кг (без плит)',
    pros: 'Максимальная площадь противоосколочного перекрытия (до 75% жизненно важных зон), встроенный КАП',
    cons: 'Большая масса (12–15 кг в сборе), снижает скорость манёвра на длинных переходах'
  }
];

const PLATE_MATERIALS_COMPARE = [
  {
    material: 'СВМПЭ (UHMWPE)',
    classLevel: 'Бр3 / Бр4 (NIJ III+)',
    weightPlate: '1.2–1.6 кг',
    thickness: '22–28 мм',
    multiHit: 'Высокая (5–6 попаданий)',
    apThreat: 'Не держит пули со стальным термоупрочнённым сердечником (7Н10/7Н22/Б-32)',
    note: 'Не тонет в воде, не боится ударов об бетон. Оптимален для разведки и расчётов БПЛА.'
  },
  {
    material: 'Керамика Карбид бора (B4C) + СВМПЭ',
    classLevel: 'Бр5 (NIJ IV)',
    weightPlate: '2.2–2.6 кг',
    thickness: '20–24 мм',
    multiHit: 'Средняя (2–3 попадания)',
    apThreat: 'Держит бронебойные 7.62×54R (Б-32) и 5.45×39 (7Н22/7Н24)',
    note: 'Эталон по соотношению веса и бронестойкости. Требует бережного обращения от сильных точечных ударов.'
  },
  {
    material: 'Керамика Оксид алюминия (Al2O3) + СВМПЭ',
    classLevel: 'Бр5 (NIJ IV)',
    weightPlate: '2.8–3.3 кг',
    thickness: '22–26 мм',
    multiHit: 'Средняя (2–3 попадания)',
    apThreat: 'Держит бронебойные 7.62×54R (Б-32) и 5.45×39 (7Н22/7Н24)',
    note: 'Надежнее переносит удары при падениях, чем B4C, но тяжелее на 500–700 г на каждую плиту.'
  },
  {
    material: 'Бронесталь (Высокопрочная)',
    classLevel: 'Бр4 / Бр5',
    weightPlate: '3.4–4.2 кг',
    thickness: '6.5–8 мм',
    multiHit: 'Очень высокая (8+ попаданий)',
    apThreat: 'Зависит от марки стали и толщины',
    note: 'Критически опасен вторичный рикошет фрагментов пули в шею и подбородок без толстого антирикошета.'
  }
];

const HELMET_TYPES = [
  {
    cut: 'High-Cut (Безухий)',
    models: 'Ops-Core FAST SF, Team Wendy EXFIL, 5.45 Спартанец',
    protection: 'Бр2 / NIJ IIIA (V50 ≥ 680 м/с)',
    area: '10.8–11.5 дм²',
    weight: '1.15–1.45 кг (купол)',
    features: 'Вырез над ушами позволяет крепить активные наушники на рельсы ARC без сдавливания головы. Оптимальный обзор и вентиляция.'
  },
  {
    cut: 'Mid-Cut / Full-Cut (Полноразмерный)',
    models: '6Б47, Ops-Core XP, ACH / MICH 2000',
    protection: 'Бр2 + опция визора Бр1 (V50 ≥ 720 м/с)',
    area: '13.5–15.8 дм²',
    weight: '1.35–1.75 кг (купол)',
    features: 'Закрывает височные доли и ушные раковины от осколков. Позволяет установить забрало для штурма и инженерных работ.'
  },
  {
    cut: 'Bump-шлем (Небаллистический)',
    models: 'Ops-Core Carbon, Team Wendy LTP',
    protection: 'Только ударная (EN 1385)',
    area: '0 дм² (нет баллистики)',
    weight: '0.65–0.85 кг',
    features: 'Защищает голову от ударов в технике, при падениях и прыжках, имеет шрауд для ПНВ, но НЕ защищает от пуль и осколков.'
  }
];

const MODULES_GUIDE = [
  {
    title: 'Баллистический напашник (Бр1 / Бр2)',
    area: '+6.5 – 7.5 дм²',
    weight: '0.9 – 1.3 кг',
    material: 'Cordura 1000D IRR + 20–24 слоя СВМПЭ или арамида',
    purpose: 'Закрывает нижнюю треть живота, паховую область и верхнюю часть бедренных артерий. При повреждении бедренной артерии критическая кровопотеря наступает за 40–60 секунд, а наложить турникет в паху невозможно.'
  },
  {
    title: 'Броневоротник (Защита шеи и трапеции)',
    area: '+6.0 – 8.0 дм²',
    weight: '1.1 – 1.5 кг',
    material: 'Анатомические сегменты с арамидным пакетом Бр1/Бр2',
    purpose: 'Защищает сонные артерии, яремную вену и шейный отдел позвоночника от осколков при разрывах сверху и сбоку. Важно, чтобы воротник не упирался в заднюю кромку шлема в положении лёжа.'
  },
  {
    title: 'Баллистические наплечники',
    area: '+5.0 – 6.5 дм²',
    weight: '0.8 – 1.2 кг',
    material: 'Cordura 500D/1000D + пакет Бр1/Бр2',
    purpose: 'Перекрывают плечевые суставы и подмышечные артерии сбоку, где плитник не даёт защиты при стрельбе из-за укрытия.'
  },
  {
    title: 'Разгрузочный пояс (Warbelt) с баллистическим пакетом',
    area: '+4.5 – 6.0 дм²',
    weight: '1.2 – 1.8 кг (пустой с пакетом)',
    material: 'Ламинат Cordura Laser-Cut + пакет Бр1 по всей окружности',
    purpose: 'Защищает поясницу, почки и тазовые кости, а также формирует 1-й эшелон снаряжения (аптечка IFAK, турникеты, 2–4 магазина), который остаётся на бойце при экстренном сбросе плитника.'
  }
];

export default function GearSubModules({ subTab, onGoTo3D }) {
  if (subTab === 'armor') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Блок 1: Сравнение типов бронежилетов и плитников */}
        <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🛡 Сравнительный анализ платформ
              </div>
              <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>
                Разновидности бронежилетов и плитоносок
              </h2>
            </div>
            <button
              onClick={onGoTo3D}
              style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#34d399', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
            >
              🪖 Примерить на 3D-манекене →
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px' }}>
            {ARMOR_SYSTEMS_COMPARE.map((sys, idx) => (
              <div key={idx} style={{ backgroundColor: '#161b22', padding: '18px', borderRadius: '12px', border: '1px solid #2d3748', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc', marginBottom: '6px' }}>{sys.type}</div>
                  <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600', marginBottom: '12px' }}>Примеры: {sys.examples}</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#6ee7b7', fontWeight: '700' }}>
                      Площадь: {sys.area}
                    </span>
                    <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'rgba(255,255,255,0.06)', color: '#cbd5e1', fontWeight: '600' }}>
                      Чехол: {sys.weightEmpty}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#a7f3d0', marginBottom: '8px', lineHeight: '1.45' }}>
                    <strong>+ Плюсы:</strong> {sys.pros}
                  </div>
                  <div style={{ fontSize: '13px', color: '#fca5a5', lineHeight: '1.45' }}>
                    <strong>− Ограничения:</strong> {sys.cons}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Блок 2: Таблица сравнения материалов бронеплит */}
        <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #1e293b', overflowX: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>
            🧱 Баллистические характеристики материалов
          </div>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
            Сравнение бронеплит: СВМПЭ vs Керамика (B4C / Al2O3) vs Сталь
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left', minWidth: '720px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2d3748', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Материал плиты</th>
                <th style={{ padding: '10px 12px' }}>Класс защиты</th>
                <th style={{ padding: '10px 12px' }}>Вес 1 плиты</th>
                <th style={{ padding: '10px 12px' }}>Живучесть</th>
                <th style={{ padding: '10px 12px' }}>Бронебойные пули</th>
                <th style={{ padding: '10px 12px' }}>Инженерная особенность</th>
              </tr>
            </thead>
            <tbody>
              {PLATE_MATERIALS_COMPARE.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #1e293b', color: '#e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: '700', color: '#38bdf8' }}>{row.material}</td>
                  <td style={{ padding: '12px', fontWeight: '700', color: '#10b981' }}>{row.classLevel}</td>
                  <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>{row.weightPlate} ({row.thickness})</td>
                  <td style={{ padding: '12px' }}>{row.multiHit}</td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>{row.apThreat}</td>
                  <td style={{ padding: '12px', color: '#94a3b8' }}>{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (subTab === 'helmets') {
    return (
      <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px' }}>
              ⛑ Баллистика и эргономика защиты головы
            </div>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>
              Сравнение форм-факторов шлемов (High-Cut / Full-Cut / Bump)
            </h2>
          </div>
          <button
            onClick={onGoTo3D}
            style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#34d399', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
          >
            🪖 Посмотреть на 3D-модели →
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {HELMET_TYPES.map((h, idx) => (
            <div key={idx} style={{ backgroundColor: '#161b22', padding: '18px', borderRadius: '12px', border: '1px solid #2d3748' }}>
              <div style={{ fontSize: '17px', fontWeight: '800', color: '#f8fafc', marginBottom: '4px' }}>{h.cut}</div>
              <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: '600', marginBottom: '12px' }}>{h.models}</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', marginBottom: '12px', padding: '10px', backgroundColor: '#0b0e14', borderRadius: '8px' }}>
                <div><strong style={{ color: '#94a3b8' }}>Класс защиты:</strong> <span style={{ color: '#10b981', fontWeight: '700' }}>{h.protection}</span></div>
                <div><strong style={{ color: '#94a3b8' }}>Площадь закрытия:</strong> <span style={{ color: '#e2e8f0' }}>{h.area}</span></div>
                <div><strong style={{ color: '#94a3b8' }}>Масса купола:</strong> <span style={{ color: '#e2e8f0' }}>{h.weight}</span></div>
              </div>

              <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{h.features}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 16px', backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '10px', fontSize: '13px', color: '#fde68a', lineHeight: '1.5' }}>
          <strong>Важный инженерный нюанс:</strong> при установке на шлем бинокулярного ПНВ или тепловизора (массой 450–650 г) центр тяжести смещается вперёд. Обязательно устанавливайте на затылок шлема противовес (300–450 г) и используйте 4-точечную подвесную систему с затылочным роликом (типа BOA / Team Wendy Cam-Fit).
        </div>
      </div>
    );
  }

  // subTab === 'modules' (4. Модули и разгрузка)
  return (
    <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
            📐 Расширение площади противоосколочной защиты
          </div>
          <h2 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>
            Дополнительные баллистические модули и эшелонирование
          </h2>
        </div>
        <button
          onClick={onGoTo3D}
          style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #10b981', backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#34d399', fontWeight: '700', fontSize: '12px', cursor: 'pointer' }}
        >
          🪖 Собрать комплект в 3D →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
        {MODULES_GUIDE.map((mod, idx) => (
          <div key={idx} style={{ backgroundColor: '#161b22', padding: '18px', borderRadius: '12px', border: '1px solid #2d3748' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#f8fafc' }}>{mod.title}</div>
              <span style={{ fontSize: '11px', fontWeight: '800', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', whiteSpace: 'nowrap' }}>
                {mod.area}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '10px' }}>
              Масса: {mod.weight} • Состав: {mod.material}
            </div>
            <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.55' }}>{mod.purpose}</div>
          </div>
        ))}
      </div>
    </div>
  );
}