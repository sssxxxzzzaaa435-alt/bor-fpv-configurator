import React, { useState } from 'react';
import { GEAR_CATEGORIES } from './gearData';
import SoldierViewer3D from './SoldierViewer3D';

export default function GearConfigurator() {
  const [activeStep, setActiveStep] = useState(1);

  const [equipment, setEquipment] = useState({
    baseId: 'ar2',
    plates: { front: 'ceramic_br5', back: 'ceramic_br5', side: 'none' },
    modules: {
      neck: true, abdomen: true, groin: true, shoulders: true,
      arms: true, thighs: true, legs: true
    },
    beltAndPouches: { rpsId: 'belt_base', magPouches: 6, utility: 1, dump: 1, grenade: 2 },
    helmetId: 'hl2',
    headGear: { headset: true, goggles: true }
  });

  const steps = [
    { id: 1, title: '1. База (Плитник / Бронежилет)' },
    { id: 2, title: '2. Бронеплиты' },
    { id: 3, title: '3. Баллистические модули' },
    { id: 4, title: '4. Разгрузка и БК' },
    { id: 5, title: '5. Защита головы' },
    { id: 6, title: '6. Оборудование на шлем' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Левая колонка: 3D Визуализация */}
      <div>
        <SoldierViewer3D 
          armor={{ id: equipment.baseId }} 
          helmet={{ id: equipment.helmetId }} 
          optics={{ id: 'op1' }} 
        />
      </div>

      {/* Правая колонка: Аккордеон */}
      <div className="bg-gray-900 rounded-lg p-4 space-y-3 border border-gray-700 h-[620px] overflow-y-auto">
        {steps.map((step) => (
          <div key={step.id} className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800">
            <button
              onClick={() => setActiveStep(step.id)}
              className={`w-full text-left px-5 py-4 font-bold transition-colors flex justify-between items-center ${
                activeStep === step.id ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{step.title}</span>
              <span>{activeStep === step.id ? '▼' : '▶'}</span>
            </button>
            
            {activeStep === step.id && (
              <div className="p-5 text-gray-200 bg-gray-800/50">
                
                {/* Рендер Шага 1: База */}
                {step.id === 1 && (
                  <div className="space-y-4">
                    {GEAR_CATEGORIES.armor.map((item) => (
                      <div key={item.id} className="border border-gray-600 rounded-lg p-4 flex flex-col gap-3 bg-gray-900">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg text-white">{item.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">
                              Вес: <span className="text-white">{item.weight} кг</span> | Площадь: <span className="text-white">{item.areaDm2} дм²</span>
                            </p>
                          </div>
                          <button
                            onClick={() => setEquipment({ ...equipment, baseId: item.id })}
                            className={`px-4 py-2 rounded font-bold transition-colors ${
                              equipment.baseId === item.id 
                                ? 'bg-green-600 text-white' 
                                : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                            {equipment.baseId === item.id ? 'Выбрано ✓' : 'Выбрать'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Заглушки для остальных шагов */}
                {step.id === 2 && <p>Здесь будет выбор материалов плит.</p>}
                {step.id === 3 && <p>Здесь будут чекбоксы (Шея, пах, плечи) - все включены.</p>}
                {step.id === 4 && <p>Здесь будет настройка РПС и подсумков.</p>}
                {step.id === 5 && <p>Здесь будет выбор каски.</p>}
                {step.id === 6 && <p>Здесь будут чекбоксы активных наушников и очков.</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}