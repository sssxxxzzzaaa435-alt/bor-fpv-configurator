export const PAYLOAD_OPTIONS = [
  { id: 'cam_none', name: 'Без экшн-камеры (только курсовая)', weight: 0, price: 0 },
  { id: 'cam_naked', name: 'Naked GoPro / Thumb Pro (легкая)', weight: 35, price: 110 },
  { id: 'cam_action', name: 'DJI Osmo Action 4 / 5 Pro', weight: 145, price: 320 },
  { id: 'cam_gopro', name: 'GoPro Hero 12 / 13 Black', weight: 155, price: 350 },
  { id: 'cam_heavy', name: 'Полезная нагрузка / сброс (~500г)', weight: 500, price: 45 }
];

export const DRONE_SPECS = {
  '3"': {
    title: '3" CineWhoop / Toothpick',
    frames: [
      { id: 'f1', name: 'CineLog 30 (CineWhoop)', mount: '9x9', weight: 65, stackMount: '25.5x25.5', price: 48 },
      { id: 'f2', name: 'Crux35 Toothpick', mount: '12x12', weight: 28, stackMount: '25.5x25.5', price: 24 }
    ],
    motors: [
      { id: 'm1', name: '1404 4500KV', recommendedCells: 4, mount: '9x9', amps: 18, weight: 9.5, maxThrust: 380, price: 14 },
      { id: 'm2', name: '1507 3800KV', recommendedCells: 4, mount: '12x12', amps: 24, weight: 14.5, maxThrust: 520, price: 16 },
      { id: 'm2_6s', name: '1404 2750KV', recommendedCells: 6, mount: '9x9', amps: 15, weight: 9.5, maxThrust: 390, price: 15 }
    ],
    props: [
      { id: 'p1', name: 'Gemfan D76 (3" 5-лопастные для вупа)', weight: 2.1, thrustFactor: 1.05, price: 4 },
      { id: 'p2', name: 'HQProp T3x3x3 (3" легкие)', weight: 1.5, thrustFactor: 0.95, price: 3 }
    ],
    escs: [
      { id: 'e1', name: 'AIO 20A (25.5x25.5)', maxAmps: 20, maxCells: 4, weight: 8, price: 45 },
      { id: 'e2', name: 'AIO 35A (25.5x25.5)', maxAmps: 35, maxCells: 6, weight: 10, price: 58 }
    ],
    batteries: [
      { id: 'b1', name: '4S LiPo 850mAh', cells: 4, mah: 850, weight: 105, price: 22 },
      { id: 'b2', name: '6S LiPo 650mAh', cells: 6, mah: 650, weight: 115, price: 25 }
    ]
  },
  '5"': {
    title: '5" Freestyle / Racing',
    frames: [
      { id: 'f3', name: 'TBS Source One V5', mount: '16x16', weight: 123, stackMount: '30.5x30.5', price: 32 },
      { id: 'f4', name: 'ImpulseRC Apex 5"', mount: '16x16', weight: 118, stackMount: '30.5x30.5', price: 95 }
    ],
    motors: [
      { id: 'm3', name: '2207 1950KV', recommendedCells: 6, mount: '16x16', amps: 42, weight: 33, maxThrust: 1550, price: 21 },
      { id: 'm4', name: '2306 2450KV', recommendedCells: 4, mount: '16x16', amps: 48, weight: 31, maxThrust: 1480, price: 20 }
    ],
    props: [
      { id: 'p3', name: 'HQProp J37 (5.1x3.7x3 плавные)', weight: 3.7, thrustFactor: 0.95, price: 4 },
      { id: 'p4', name: 'Gemfan 51466 (5.1x4.66x3 агрессивные)', weight: 4.2, thrustFactor: 1.08, price: 4 }
    ],
    escs: [
      { id: 'e3', name: 'Стек 45A (30.5x30.5)', maxAmps: 45, maxCells: 6, weight: 22, price: 65 },
      { id: 'e4', name: 'Стек 60A (30.5x30.5)', maxAmps: 60, maxCells: 6, weight: 25, price: 85 }
    ],
    batteries: [
      { id: 'b3', name: '4S LiPo 1500mAh', cells: 4, mah: 1500, weight: 175, price: 28 },
      { id: 'b4', name: '6S LiPo 1300mAh', cells: 6, mah: 1300, weight: 215, price: 36 }
    ]
  },
  '7"': {
    title: '7" Long Range Cruiser',
    frames: [
      { id: 'f5', name: 'GEPRC Crocodile75', mount: '19x19', weight: 195, stackMount: '30.5x30.5', price: 89 },
      { id: 'f6', name: 'iFlight Chimera7 Pro', mount: '19x19', weight: 210, stackMount: '30.5x30.5', price: 110 }
    ],
    motors: [
      { id: 'm5', name: '2806.5 1300KV', recommendedCells: 6, mount: '19x19', amps: 48, weight: 46, maxThrust: 2100, price: 26 },
      { id: 'm6', name: '2807 1500KV', recommendedCells: 6, mount: '19x19', amps: 55, weight: 48, maxThrust: 2450, price: 28 }
    ],
    props: [
      { id: 'p5', name: 'HQProp 7x4x3 (стандарт)', weight: 8.5, thrustFactor: 1.0, price: 6 },
      { id: 'p6', name: 'Gemfan 7035-2 (2-лопастные экономичные)', weight: 6.2, thrustFactor: 0.88, price: 5 }
    ],
    escs: [
      { id: 'e5', name: 'Стек 50A (30.5x30.5)', maxAmps: 50, maxCells: 6, weight: 24, price: 75 },
      { id: 'e6', name: 'Стек 65A (30.5x30.5)', maxAmps: 65, maxCells: 6, weight: 28, price: 95 }
    ],
    batteries: [
      { id: 'b5', name: '6S Li-Ion 4000mAh (дальнолет)', cells: 6, mah: 4000, weight: 420, price: 68 },
      { id: 'b6', name: '6S LiPo 2200mAh (динамика)', cells: 6, mah: 2200, weight: 350, price: 48 }
    ]
  },
  '10"': {
    title: '10" Heavy Lifter / X-Class',
    frames: [
      { id: 'f7', name: 'Mark4 10" XL', mount: '19x19', weight: 290, stackMount: '30.5x30.5', price: 55 },
      { id: 'f8', name: 'iFlight Helion 10', mount: '19x19', weight: 340, stackMount: '30.5x30.5', price: 145 }
    ],
    motors: [
      { id: 'm7', name: '3115 900KV', recommendedCells: 6, mount: '19x19', amps: 65, weight: 112, maxThrust: 3800, price: 42 },
      { id: 'm8', name: '3214 760KV', recommendedCells: 8, mount: '19x19', amps: 75, weight: 135, maxThrust: 4600, price: 54 }
    ],
    props: [
      { id: 'p7', name: 'HQProp 10x5x3 (грузовые)', weight: 21, thrustFactor: 1.0, price: 11 },
      { id: 'p8', name: 'Gemfan 1050-3 (усиленные)', weight: 24, thrustFactor: 1.05, price: 12 }
    ],
    escs: [
      { id: 'e7', name: 'Стек 65A (до 6S)', maxAmps: 65, maxCells: 6, weight: 32, price: 105 },
      { id: 'e8', name: 'Стек 80A (до 8S)', maxAmps: 80, maxCells: 8, weight: 40, price: 135 }
    ],
    batteries: [
      { id: 'b7', name: '6S LiPo 6000mAh', cells: 6, mah: 6000, weight: 820, price: 115 },
      { id: 'b8', name: '8S LiPo 5000mAh', cells: 8, mah: 5000, weight: 910, price: 140 }
    ]
  }
};