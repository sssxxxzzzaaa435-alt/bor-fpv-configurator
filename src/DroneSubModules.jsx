import React, { useState } from 'react';

const UGV_PLATFORMS = [
  {
    id: 'ugv-light',
    name: 'Лёгкий гусеничный дрон-камикадзе / разведчик',
    chassis: 'Гусеничное шасси, клиренс 140 мм',
    motors: '2× BLDC 800 Вт с планетарными редукторами',
    battery: 'Li-Ion 12S4P (44.4V 16Ah • 710 Вт·ч)',
    payloadKg: 25,
    ownWeightKg: 32,
    rangeKm: 6.5,
    speedKmh: 18,
    control: 'ELRS 868/915 МГц + ретранслятор с воздуха / оптоволокно',
    tasks: 'Доставка БК на передний край, дистанционное минирование, разведка в застройке'
  },
  {
    id: 'ugv-medevac',
    name: 'Средняя транспортно-эвакуационная платформа (4×4 / Гусеницы)',
    chassis: 'Независимая подвеска, клиренс 220 мм, лебёдка',
    motors: '4× Мотор-колесо 1500 Вт (пик 6 кВт)',
    battery: 'LiFePO4 / Li-Ion 16S8P (51.2V 40Ah • 2048 Вт·ч)',
    payloadKg: 150,
    ownWeightKg: 85,
    rangeKm: 14.0,
    speedKmh: 22,
    control: 'Двухдиапазонный канал управления + курсовая тепловизионная камера',
    tasks: 'Эвакуация раненых (носилки), подвоз воды/БК, буксировка грузов'
  },
  {
    id: 'ugv-heavy',
    name: 'Тяжёлый инженерный комплекс / носитель модулей',
    chassis: 'Усиленная рама, бронезащита АКБ и отсека электроники',
    motors: '2× Тяговых электродвигателя 3.5 кВт',
    battery: 'Модульная сборка 72V 60Ah (4320 Вт·ч)',
    payloadKg: 300,
    ownWeightKg: 165,
    rangeKm: 20.0,
    speedKmh: 15,
    control: 'Защищённый цифровой канал + наземная проводная/радио станция',
    tasks: 'Прокладка минных заграждений, установка турелей, тяжёлая логистика'
  }
];

const GROUND_EQUIPMENT = [
  {
    category: 'Наземные станции управления (НСУ)',
    items: [
      {
        name: 'Выносная НСУ на мачте с ретранслятором',
        specs: 'Приёмник 5.8 / 1.2 ГГц + ретрансляция в ELRS • Питание 6S Li-Ion',
        note: 'Позволяет расчёту работать из закрытого блиндажа на удалении до 100–300 м от антенн по витой паре / коаксиалу.'
      },
      {
        name: 'Телескопическая композитная мачта (6–10 м)',
        specs: 'Стеклопластик / углепластик • Вес 3.2 кг • Растяжки и колья',
        note: 'Подъём антенн над лесополосой и складками рельефа увеличивает радиус устойчивого видеосигнала в 2–3 раза.'
      }
    ]
  },
  {
    category: 'Антенны и видеоприём',
    items: [
      {
        name: 'Направленный патч (Patch 14–16 dBi) + Хеликс (Helix 7–10 витков)',
        specs: 'Поляризация RHCP / LHCP • Угол раскрыва 35°–55°',
        note: 'Обязательная связка для дальних вылетов (7" и 10"). Требует точного наведения на сектор работы борта.'
      },
      {
        name: 'Всенаправленный клевер / Пагода (Omni 3–5 dBi)',
        specs: 'Круговая диаграмма направленности 360°',
        note: 'Используется на ближней дистанции и при полётах вокруг позиции, когда борт меняет азимут.'
      }
    ]
  },
  {
    category: 'Пульты управления и ВЧ-модули',
    items: [
      {
        name: 'Аппаратура управления (RadioMaster Boxer / TX16S) + ELRS 1W/2W',
        specs: 'Протокол ExpressLRS 915 / 750 / 2.4 ГГц • Стики на датчиках Холла',
        note: 'Рекомендуется использовать внешний ВЧ-модуль с активным охлаждением и выносной направленной антенной Яги/Moxon.'
      },
      {
        name: 'Видеошлем / Очки с модулем True Diversity (SteadyView / RapidFIRE)',
        specs: 'Сложение сигналов двух приёмников • Выход HDMI/AV на монитор',
        note: 'Снижает количество помех и полос при пролёте за препятствиями и в условиях работы РЭБ.'
      }
    ]
  }
];

export default function DroneSubModules({ subTab }) {
  const [selectedUgv, setSelectedUgv] = useState(UGV_PLATFORMS[0]);

  // Калькулятор полёта и ветрового сноса (вкладка "4. Полёты")
  const [cruiseSpeedKmh, setCruiseSpeedKmh] = useState(65);
  const [windSpeedMs, setWindSpeedMs] = useState(7);
  const [flightTimeMin, setFlightTimeMin] = useState(14);
  const [dropAltitudeM, setDropAltitudeM] = useState(80);

  // Расчёт тактического радиуса туда-обратно с учётом встречного/попутного ветра и 25% резерва АКБ
  const windKmh = windSpeedMs * 3.6;
  const effectiveCruiseSpeed = Math.max(15, cruiseSpeedKmh);
  const vOut = Math.max(10, effectiveCruiseSpeed - windKmh * 0.7); // против ветра
  const vBack = effectiveCruiseSpeed + windKmh * 0.7; // по ветру
  const usableHours = (flightTimeMin * 0.75) / 60;
  const tacticalRadiusKm = Number(((usableHours * vOut * vBack) / (vOut + vBack)).toFixed(1));
  const oneWayRangeKm = Number((usableHours * vOut).toFixed(1));

  // Расчёт времени падения и сноса груза при сбросе
  const fallTimeSec = Number(Math.sqrt((2 * dropAltitudeM) / 9.81).toFixed(2));
  const windDriftM = Number((windSpeedMs * fallTimeSec * 0.85).toFixed(1));

  if (subTab === 'ugv') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            🚜 Классы наземных роботизированных комплексов (НРК)
          </div>
          {UGV_PLATFORMS.map((ugv) => {
            const active = ugv.id === selectedUgv.id;
            return (
              <button
                key={ugv.id}
                onClick={() => setSelectedUgv(ugv)}
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: active ? 'rgba(16, 185, 129, 0.12)' : '#11161f',
                  border: active ? '1px solid #10b981' : '1px solid #2d3748',
                  color: '#f8fafc',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: '15px', fontWeight: '800', marginBottom: '6px' }}>{ugv.name}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Полезная нагрузка: <strong style={{ color: '#10b981' }}>до {ugv.payloadKg} кг</strong> • Запас хода: <strong style={{ color: '#38bdf8' }}>{ugv.rangeKm} км</strong>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ backgroundColor: '#11161f', padding: '24px', borderRadius: '14px', border: '1px solid #2d3748' }}>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', marginBottom: '8px' }}>
            ● ИНЖЕНЕРНЫЕ ТТХ ПЛАТФОРМЫ НРК
          </div>
          <h2 style={{ margin: '0 0 18px 0', fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>{selectedUgv.name}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
            <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Грузоподъёмность</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>{selectedUgv.payloadKg} кг</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Собственная масса: {selectedUgv.ownWeightKg} кг</div>
            </div>
            <div style={{ backgroundColor: '#161b22', padding: '12px', borderRadius: '10px', border: '1px solid #1e293b' }}>
              <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Запас хода / Скорость</div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#38bdf8' }}>{selectedUgv.rangeKm} км</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>Макс. скорость: {selectedUgv.speedKmh} км/ч</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#cbd5e1' }}>
            <div style={{ padding: '10px 12px', backgroundColor: '#161b22', borderRadius: '8px' }}>
              <strong style={{ color: '#94a3b8' }}>Ходовая часть:</strong> {selectedUgv.chassis}
            </div>
            <div style={{ padding: '10px 12px', backgroundColor: '#161b22', borderRadius: '8px' }}>
              <strong style={{ color: '#94a3b8' }}>Силовая установка:</strong> {selectedUgv.motors}
            </div>
            <div style={{ padding: '10px 12px', backgroundColor: '#161b22', borderRadius: '8px' }}>
              <strong style={{ color: '#94a3b8' }}>Батарейный блок:</strong> {selectedUgv.battery}
            </div>
            <div style={{ padding: '10px 12px', backgroundColor: '#161b22', borderRadius: '8px' }}>
              <strong style={{ color: '#94a3b8' }}>Канал управления:</strong> {selectedUgv.control}
            </div>
            <div style={{ padding: '10px 12px', backgroundColor: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', color: '#e0f2fe' }}>
              <strong>Тактическое применение:</strong> {selectedUgv.tasks}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subTab === 'equipment') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {GROUND_EQUIPMENT.map((block, idx) => (
          <div key={idx} style={{ backgroundColor: '#11161f', padding: '20px', borderRadius: '14px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px' }}>
              📡 {block.category}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '14px' }}>
              {block.items.map((item, i) => (
                <div key={i} style={{ backgroundColor: '#161b22', padding: '16px', borderRadius: '10px', border: '1px solid #2d3748' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginBottom: '6px' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981', marginBottom: '8px' }}>{item.specs}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>{item.note}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // subTab === 'flights' (4. Полёты и баллистика сброса)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px', alignItems: 'start' }}>
      <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
          🧭 Исходные параметры вылета и метеоусловия
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
            <span>Крейсерская скорость борта:</span>
            <strong style={{ color: '#38bdf8' }}>{cruiseSpeedKmh} км/ч</strong>
          </div>
          <input type="range" min="30" max="120" value={cruiseSpeedKmh} onChange={(e) => setCruiseSpeedKmh(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
            <span>Скорость ветра на высоте полёта:</span>
            <strong style={{ color: '#f59e0b' }}>{windSpeedMs} м/с ({Math.round(windKmh)} км/ч)</strong>
          </div>
          <input type="range" min="0" max="18" value={windSpeedMs} onChange={(e) => setWindSpeedMs(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
            <span>Расчётное время полёта по АКБ:</span>
            <strong style={{ color: '#10b981' }}>{flightTimeMin} мин</strong>
          </div>
          <input type="range" min="4" max="45" value={flightTimeMin} onChange={(e) => setFlightTimeMin(Number(e.target.value))} style={{ width: '100%' }} />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>
            <span>Высота сброса полезной нагрузки:</span>
            <strong style={{ color: '#e2e8f0' }}>{dropAltitudeM} м</strong>
          </div>
          <input type="range" min="20" max="250" step="5" value={dropAltitudeM} onChange={(e) => setDropAltitudeM(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
      </div>

      <div style={{ backgroundColor: '#11161f', padding: '22px', borderRadius: '14px', border: '1px solid #2d3748' }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
          ● РАСЧЁТ ТАКТИЧЕСКОГО РАДИУСА И СНОСА
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
          <div style={{ backgroundColor: '#161b22', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Радиус (туда-обратно)</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#10b981' }}>{tacticalRadiusKm} <span style={{ fontSize: '14px' }}>км</span></div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>С учётом ветра и 25% резерва</div>
          </div>

          <div style={{ backgroundColor: '#161b22', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Дальность в один конец</div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#38bdf8' }}>{oneWayRangeKm} <span style={{ fontSize: '14px' }}>км</span></div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Полёт против ветра</div>
          </div>

          <div style={{ backgroundColor: '#161b22', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Время падения груза</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc' }}>{fallTimeSec} <span style={{ fontSize: '14px' }}>сек</span></div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>С высоты {dropAltitudeM} м</div>
          </div>

          <div style={{ backgroundColor: '#161b22', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Поправка на снос ветром</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>{windDriftM} <span style={{ fontSize: '14px' }}>м</span></div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Упреждение против ветра</div>
          </div>
        </div>

        <div style={{ padding: '12px 14px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '10px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.5' }}>
          <strong>Правило тактического планирования:</strong> всегда закладывайте маршрут к цели <strong>против ветра</strong>, чтобы возврат на разряженном аккумуляторе проходил по ветру с минимальным током потребления.
        </div>
      </div>
    </div>
  );
}