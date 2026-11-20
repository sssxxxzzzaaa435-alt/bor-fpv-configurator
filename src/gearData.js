export const GEAR_ROLES = {
  assault: {
    title: 'Штурмовик',
    description: 'Максимальная площадь противоосколочной и бронезащиты, усиленный БК',
    maxRecommendedWeight: 28
  },
  uav: {
    title: 'Оператор БПЛА',
    description: 'Облегченная защита для мобильности + место под наземную станцию и пульт',
    maxRecommendedWeight: 22
  },
  recon: {
    title: 'Разведка / Снайпер',
    description: 'Минимальный вес, низкий профиль, упор на оптику и маскировку',
    maxRecommendedWeight: 20
  },
  medic: {
    title: 'Полевой медик',
    description: 'Сбалансированная защита + расширенный медицинский рюкзак / подсумки',
    maxRecommendedWeight: 25
  }
};

export const GEAR_CATEGORIES = {
  armor: [
    { id: 'ar1', name: 'Облегченный плитник + плиты СВМПЭ (Бр4)', weight: 5.2, protection: 65, price: 420 },
    { id: 'ar2', name: 'Плитник + керамика (Бр5) + КАП', weight: 8.4, protection: 85, price: 680 },
    { id: 'ar3', name: 'Штурмовой комплект (Бр5 + баллистика шеи/паха/плеч)', weight: 12.6, protection: 98, price: 1150 }
  ],
  helmet: [
    { id: 'hl1', name: 'Безухий шлем СВМПЭ (Бр2) + активные наушники', weight: 1.85, protection: 75, price: 480 },
    { id: 'hl2', name: 'Шлем с баллистическими ушами + визор', weight: 2.4, protection: 90, price: 620 },
    { id: 'hl3', name: 'Облегченный карбоновый bump-шлем (для операторов)', weight: 0.95, protection: 30, price: 190 }
  ],
  loadout: [
    { id: 'ld1', name: 'Базовый БК (4 магазина) + аптечка 1-го эшелона', weight: 3.8, protection: 0, price: 240 },
    { id: 'ld2', name: 'Усиленный БК (8 магазинов) + гранатные подсумки + 2 аптечки', weight: 7.4, protection: 0, price: 390 },
    { id: 'ld3', name: 'Рюкзак оператора БПЛА (пульт, очки, 6 АКБ, антенны)', weight: 5.6, protection: 0, price: 310 },
    { id: 'ld4', name: 'Штурмовой мед. рюкзак (эвакуационный комплект)', weight: 8.2, protection: 0, price: 540 }
  ],
  optics: [
    { id: 'op1', name: 'Цифровая рация (AES-256) + тактические очки', weight: 0.75, protection: 10, price: 290 },
    { id: 'op2', name: 'Рация + монокуляр ПНВ (Gen 2+/3) на шлем', weight: 1.35, protection: 10, price: 1850 },
    { id: 'op3', name: 'Рация + тепловизионный прицел / гляделка', weight: 1.5, protection: 10, price: 2200 }
  ],
  uniform: [
    { id: 'un1', name: 'Боевая рубаха, брюки с наколенниками, треккинговые ботинки', weight: 3.1, protection: 5, price: 340 },
    { id: 'un2', name: 'Демисезонный мембранный комплект (Gore-Tex) + утепленные берцы', weight: 4.4, protection: 5, price: 520 }
  ]
};