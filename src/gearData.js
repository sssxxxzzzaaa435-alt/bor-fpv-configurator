export const GEAR_ROLES = {
  assault: {
    title: 'Штурмовик',
    description: 'Максимальная площадь противоосколочной и бронезащиты, работа в плотном контакте и застройке',
    maxRecommendedWeight: 28,
    minRecommendedAreaDm2: 42
  },
  uav: {
    title: 'Оператор БПЛА',
    description: 'Облегчённый профиль для быстрой смены позиций + размещение НСУ, пульта, мачты и АКБ',
    maxRecommendedWeight: 22,
    minRecommendedAreaDm2: 24
  },
  recon: {
    title: 'Разведка / Снайпер',
    description: 'Минимальный силуэт и вес, высокая скрытность в ПНВ/тепловизоре, упор на оптику и автономность',
    maxRecommendedWeight: 20,
    minRecommendedAreaDm2: 20
  },
  medic: {
    title: 'Полевой медик',
    description: 'Сбалансированная защита для работы в красной/жёлтой зоне + эвакуационный мед. модуль',
    maxRecommendedWeight: 25,
    minRecommendedAreaDm2: 30
  }
};

export const GEAR_CATEGORIES = {
  armor: [
    {
      id: 'ar1',
      name: 'Облегчённый плитник (Slick / JPC) + плиты СВМПЭ',
      protectionClass: 'Бр4 / NIJ III+',
      material: 'Cordura 500D IRR • СВМПЭ (UHMWPE)',
      areaDm2: 16.5,
      zones: ['Грудь', 'Спина'],
      weight: 5.2,
      ventilation: 'Высокая (открытые бока)',
      brands: 'Crye Precision JPC 2.0, Ferro Concepts Slickster, Ars Arma A-18',
      tags: [
        { icon: '🧱', label: 'Cordura 500D IRR', articleId: 'cordura' },
        { icon: '🛡', label: 'СВМПЭ Бр4', articleId: 'plate-materials' },
        { icon: '📐', label: '16.5 дм²', articleId: 'armor-classes' },
        { icon: '🎯', label: 'БПЛА / Разведка', trainingId: 'tr1' }
      ]
    },
    {
      id: 'ar2',
      name: 'Общевойсковой плитник + керамика (B4C) + боковые пакеты + КАП',
      protectionClass: 'Бр5 / NIJ IV + Бр1 (бока)',
      material: 'Cordura 1000D IRR • Карбид бора + Арамид',
      areaDm2: 31.0,
      zones: ['Грудь', 'Спина', 'Бока'],
      weight: 8.4,
      ventilation: 'Средняя (климатико-амортизационный подпор)',
      brands: 'Crye AVS, Warrior Assault DCS, Stich Profi, Атлас',
      tags: [
        { icon: '🧱', label: 'Cordura 1000D IRR', articleId: 'cordura' },
        { icon: '🛡', label: 'Керамика Бр5', articleId: 'plate-materials' },
        { icon: '📐', label: '31.0 дм²', articleId: 'armor-classes' },
        { icon: '🎯', label: 'Общевойсковой / Медик', trainingId: 'tr1' }
      ]
    },
    {
      id: 'ar3',
      name: 'Штурмовой бронекомплект (Бр5 + баллистика шеи, плеч и паха)',
      protectionClass: 'Бр5 / NIJ IV + Бр2 (круговая)',
      material: 'Cordura 1000D IRR • Керамика B4C + 24 слоя СВМПЭ',
      areaDm2: 52.0,
      zones: ['Грудь', 'Спина', 'Бока', 'Шея', 'Плечи', 'Пах'],
      weight: 12.6,
      ventilation: 'Низкая (требуется усиленный КАП 20 мм)',
      brands: '6Б45 (Ратник), NFM THOR, Триада-ТКО КБС Стрелок',
      tags: [
        { icon: '🧱', label: 'Cordura 1000D + СВМПЭ', articleId: 'cordura' },
        { icon: '🛡', label: 'Напашник + Шея (Бр2)', articleId: 'groin-neck' },
        { icon: '📐', label: '52.0 дм² (Макс. площадь)', articleId: 'armor-classes' },
        { icon: '🎯', label: 'Штурм / Застройка', trainingId: 'tr1' }
      ]
    }
  ],
  modules: [
    {
      id: 'md0',
      name: 'Без дополнительных модулей (минимальный силуэт)',
      protectionClass: 'Базовая проекция плитника',
      material: 'Только основной чехол плитника',
      areaDm2: 0,
      zones: [],
      weight: 0,
      ventilation: 'Максимальная подвижность корпуса',
      brands: 'Базовая конфигурация',
      tags: [
        { icon: '⚡', label: 'Макс. мобильность', trainingId: 'tr1' }
      ]
    },
    {
      id: 'md1',
      name: 'Баллистический напашник (Бр2) + пятиточечник',
      protectionClass: 'Бр2 (осколки V50 ≥ 680 м/с)',
      material: 'Cordura 1000D IRR • 24 слоя СВМПЭ / Арамид',
      areaDm2: 6.8,
      zones: ['Пах', 'Бедренные артерии', 'Низ живота'],
      weight: 1.15,
      ventilation: 'Не перекрывает теплоотвод корпуса',
      brands: 'Ars Arma, Stich Profi, Crye Precision Lap Panel',
      tags: [
        { icon: '🧱', label: 'СВМПЭ 24 слоя + 1000D', articleId: 'cordura' },
        { icon: '🛡', label: 'Защита артерий паха', articleId: 'groin-neck' },
        { icon: '📐', label: '+6.8 дм²', articleId: 'armor-classes' },
        { icon: '🩺', label: 'Профилактика кровопотери', trainingId: 'tr2' }
      ]
    },
    {
      id: 'md2',
      name: 'Полный штурмовой обвес: Напашник + Броневоротник + Наплечники',
      protectionClass: 'Бр2 (круговая противоосколочная)',
      material: 'Cordura 1000D IRR • Многослойный арамид + СВМПЭ',
      areaDm2: 18.5,
      zones: ['Пах', 'Шея / Сонные артерии', 'Плечи'],
      weight: 3.1,
      ventilation: 'Требуется КАП 20 мм',
      brands: 'Триада-ТКО, 5.45 Design, NFM',
      tags: [
        { icon: '🧱', label: 'Арамид + СВМПЭ IRR', articleId: 'cordura' },
        { icon: '🛡', label: 'Шея + Пах + Плечи', articleId: 'groin-neck' },
        { icon: '📐', label: '+18.5 дм²', articleId: 'armor-classes' },
        { icon: '🎯', label: 'Арт. обстрел / Застройка', trainingId: 'tr1' }
      ]
    }
  ],
  helmet: [
    {
      id: 'hl1',
      name: 'Безухий шлем High-Cut + активные наушники на рельсах',
      protectionClass: 'Бр2 / NIJ IIIA (V50 ≥ 680 м/с)',
      material: 'Арамид / СВМПЭ • Рельсы ARC • Подвес BOA',
      areaDm2: 11.2,
      zones: ['Купол черепа'],
      weight: 1.85,
      ventilation: 'Оптимальная (открытые височные зоны)',
      brands: 'Ops-Core FAST SF, Team Wendy EXFIL, 5.45 Design Спартанец',
      tags: [
        { icon: '🧱', label: 'Арамид / СВМПЭ', articleId: 'plate-materials' },
        { icon: '🛡', label: 'Класс Бр2', articleId: 'armor-classes' },
        { icon: '📐', label: '11.2 дм²', articleId: 'armor-classes' },
        { icon: '🎧', label: 'Активная защита слуха', trainingId: 'tr4' }
      ]
    },
    {
      id: 'hl2',
      name: 'Полноразмерный шлем Full-Cut + баллистический визор',
      protectionClass: 'Бр2 + Забрало Бр1 (V50 ≥ 720 м/с)',
      material: 'Многослойный арамид + поликарбонат 22 мм',
      areaDm2: 15.8,
      zones: ['Купол черепа', 'Виски / Уши', 'Лицо'],
      weight: 2.45,
      ventilation: 'Ограниченная (защита от вторичных осколков)',
      brands: '6Б47, Ops-Core XP, Ulbrichts, Омнитек',
      tags: [
        { icon: '🧱', label: 'Арамид + Поликарбонат', articleId: 'plate-materials' },
        { icon: '🛡', label: 'Бр2 + Визор Бр1', articleId: 'armor-classes' },
        { icon: '📐', label: '15.8 дм²', articleId: 'armor-classes' },
        { icon: '🎯', label: 'Штурм / Инженерные работы', trainingId: 'tr1' }
      ]
    },
    {
      id: 'hl3',
      name: 'Облегчённый тактический Bump-шлем (без баллистики)',
      protectionClass: 'Ударная защита (EN 1385)',
      material: 'Карбон / ABS-полимер с вентиляцией',
      areaDm2: 0,
      zones: ['Защита от ударов и падений'],
      weight: 0.95,
      ventilation: 'Максимальная (перфорация купола)',
      brands: 'Ops-Core Carbon, Team Wendy LTP, FMA',
      tags: [
        { icon: '🧱', label: 'Карбон / Полимер', articleId: 'cordura' },
        { icon: '⚠', label: 'Не держит осколки!', articleId: 'armor-classes' },
        { icon: '🚁', label: 'Только тыл / Расчёт БПЛА', trainingId: 'tr3' }
      ]
    }
  ],
  loadout: [
    {
      id: 'ld1',
      name: 'Лёгкий разгрузочный пояс (Warbelt) + 4 магазина + аптечка IFAK',
      protectionClass: 'Опционально Бр1 в поясе',
      material: 'Ламинат Cordura 500D/1000D Laser-Cut IRR',
      areaDm2: 4.5,
      zones: ['Поясница'],
      weight: 3.8,
      ventilation: 'Высокая (разгрузка позвоночника)',
      brands: 'Blue Force Gear, Ferro Bison Belt, Wartech TV-106',
      tags: [
        { icon: '🧱', label: 'Cordura Laser-Cut IRR', articleId: 'cordura' },
        { icon: '🩺', label: '1-й эшелон + MARCH', trainingId: 'tr2' },
        { icon: '🎯', label: 'Эшелонирование веса', trainingId: 'tr1' }
      ]
    },
    {
      id: 'ld2',
      name: 'Штурмовой эшелон: 8 магазинов + гранатные подсумки + 2 аптечки IFAK',
      protectionClass: 'Нет (боевая выкладка)',
      material: 'Cordura 1000D IRR • Пластиковые вставки Kydex',
      areaDm2: 0,
      zones: [],
      weight: 7.4,
      ventilation: 'Сниженная (плотная компоновка на груди)',
      brands: 'Esstac KYWI, Haley Strategic D3CRM, Mordor Tac',
      tags: [
        { icon: '🧱', label: 'Cordura 1000D + Kydex', articleId: 'cordura' },
        { icon: '🩺', label: 'Двойной мед. эшелон', trainingId: 'tr2' },
        { icon: '🎯', label: 'Интенсивный огневой контакт', trainingId: 'tr1' }
      ]
    },
    {
      id: 'ld3',
      name: 'Выкладка расчёта БПЛА: рюкзак НСУ, мачта, 6 АКБ, пульт и шлем FPV',
      protectionClass: 'Нет (спец. выкладка)',
      material: 'Cordura 1000D с жёстким каркасом и влагозащитой',
      areaDm2: 0,
      zones: [],
      weight: 5.6,
      ventilation: 'Средняя (анатомическая спинка)',
      brands: 'Mystery Ranch, Eberlestock, Татонка, Gruppa 99',
      tags: [
        { icon: '🧱', label: 'Cordura 1000D Влагозащита', articleId: 'cordura' },
        { icon: '🚁', label: 'Подготовка борта и НСУ', trainingId: 'tr3' },
        { icon: '⚡', label: 'Питание и связь БПЛА', articleId: 'fpv-tech' }
      ]
    },
    {
      id: 'ld4',
      name: 'Штурмовой медицинский рюкзак + эвакуационная стропа и турникеты',
      protectionClass: 'Нет (мед. эшелон)',
      material: 'Cordura 500D IRR • Быстросброс + модульные подсумки',
      areaDm2: 0,
      zones: [],
      weight: 8.2,
      ventilation: 'Средняя',
      brands: 'Tasmanian Tiger Medic, NAR Squad Kit, Медплант',
      tags: [
        { icon: '🧱', label: 'Cordura 500D IRR', articleId: 'cordura' },
        { icon: '🩺', label: 'Протокол MARCH-PAWS', trainingId: 'tr2' },
        { icon: '🎯', label: 'Эвакуация из красной зоны', trainingId: 'tr1' }
      ]
    }
  ],
  optics: [
    {
      id: 'op1',
      name: 'Цифровая радиостанция (AES-256) + баллистические очки-маска',
      protectionClass: 'Очки: MIL-PRF-32432 (осколок до 200 м/с)',
      material: 'Поликарбонат 2.8 мм с антифогом • Кнопка PTT',
      areaDm2: 1.4,
      zones: ['Органы зрения'],
      weight: 0.75,
      ventilation: 'Продуваемая оправа',
      brands: 'Motorola DP4400/4800, Hytera, ESS Crossbow, Revision',
      tags: [
        { icon: '🛡', label: 'Защита глаз MIL-PRF', articleId: 'armor-classes' },
        { icon: '📡', label: 'Шифрование AES-256', articleId: 'fpv-tech' }
      ]
    },
    {
      id: 'op2',
      name: 'Рация + бинокулярный ПНВ (ЭОП Gen 3) на кронштейне Wilcox',
      protectionClass: 'Очки: MIL-PRF-32432',
      material: 'Алюминий 7075-T6 • Белый люминофор (White Phosphor)',
      areaDm2: 1.4,
      zones: ['Органы зрения'],
      weight: 1.35,
      ventilation: 'Требуется противовес на затылок шлема (350 г)',
      brands: 'L3Harris PVS-31, AN/PVS-14, Katod, Dedal-NV',
      tags: [
        { icon: '🌙', label: 'Работа в ПНВ без засвета', trainingId: 'tr4' },
        { icon: '🧱', label: 'Проверка снаряжения на IRR', articleId: 'cordura' }
      ]
    },
    {
      id: 'op3',
      name: 'Рация + тепловизионный монокуляр / предобъективная насадка',
      protectionClass: 'Очки: MIL-PRF-32432',
      material: 'Матрица 640×512 (12 мкм) • Германиевая линза',
      areaDm2: 1.4,
      zones: ['Органы зрения'],
      weight: 1.5,
      ventilation: 'Автономность до 6 ч на морозе',
      brands: 'iRay / InfiRay, Pulsar, Flir Breach, Fortuna',
      tags: [
        { icon: '🔥', label: 'Тепловизионная разведка', trainingId: 'tr4' },
        { icon: '🛡', label: 'Защита глаз MIL-PRF', articleId: 'armor-classes' }
      ]
    }
  ],
  uniform: [
    {
      id: 'un1',
      name: 'Боевой комплект (Combat Shirt + брюки с наколенниками) + треккинги',
      protectionClass: 'ИК-ремиссия (не светится в ПНВ)',
      material: 'NYCO Ripstop (50% нейлон / 50% хлопок) + Cordura на коленях',
      areaDm2: 0,
      zones: [],
      weight: 3.1,
      ventilation: 'Высокая (потоотводящий торс Coolmax)',
      brands: 'Crye Precision G3/G4, UF PRO Striker, Lowa Zephyr GTX',
      tags: [
        { icon: '🧱', label: 'NYCO Ripstop + IRR', articleId: 'cordura' },
        { icon: '🌙', label: 'Маскировка в ПНВ', trainingId: 'tr4' }
      ]
    },
    {
      id: 'un2',
      name: 'Мембранный штормовой комплект (3-слойный) + утеплённые берцы',
      protectionClass: 'Влагозащита 20 000 мм + ИК-ремиссия',
      material: 'Gore-Tex / ePTFE мембрана + утеплитель Primaloft',
      areaDm2: 0,
      zones: [],
      weight: 4.4,
      ventilation: 'Паропроницаемость 15 000 г/м²/24ч',
      brands: 'ECWCS Gen III (L5/L6), ВКПО 3.0, Salomon Quest 4D, Haix',
      tags: [
        { icon: '🧱', label: 'Gore-Tex + IRR', articleId: 'cordura' },
        { icon: '🩺', label: 'Защита от гипотермии', trainingId: 'tr2' }
      ]
    }
  ]
};