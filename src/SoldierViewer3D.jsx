import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Генератор реалистичной текстуры камуфляжа и рельефа ткани (Cordura / Ripstop)
function useCamoTexture(isWinter) {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Базовый фон ткани
    ctx.fillStyle = isWinter ? '#475569' : '#78715a';
    ctx.fillRect(0, 0, 512, 512);

    const palette = isWinter
      ? ['#334155', '#64748b', '#94a3b8', '#1e293b', '#cbd5e1']
      : ['#4b5338', '#5c533c', '#8c8265', '#3a402b', '#a3987a'];

    // Пятна камуфляжа
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = palette[i % palette.length];
      ctx.beginPath();
      const x = (Math.sin(i * 12.9898) * 43758.5453 % 1 + 1) % 1 * 512;
      const y = (Math.sin(i * 78.233) * 43758.5453 % 1 + 1) % 1 * 512;
      const rx = 18 + (i % 35);
      const ry = 10 + ((i * 7) % 24);
      ctx.ellipse(x, y, rx, ry, (i % 6) * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Микротекстура плетения ткани (Ripstop)
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    for (let x = 0; x < 512; x += 4) ctx.fillRect(x, 0, 1, 512);
    for (let y = 0; y < 512; y += 4) ctx.fillRect(0, y, 512, 1);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [isWinter]);
}

function TacticalSoldier({ armorId, helmetId, loadoutId, opticsId, uniformId }) {
  const isWinter = uniformId === 'un2';
  const camoTex = useCamoTexture(isWinter);

  const gearBaseColor = isWinter ? '#334155' : '#6e664f';
  const darkMetal = '#18181b';
  const leatherColor = '#3f352c';

  return (
    // Ноль по Y — подошвы ботинок стоят ровно на подиуме
    <group position={[0, 0, 0]}>
      
      {/* ================= ОБУВЬ (Треккинговые берцы) ================= */}
      {[-0.145, 0.145].map((xPos, idx) => (
        <group key={idx} position={[xPos, 0, 0.02]}>
          {/* Подошва с протектором */}
          <RoundedBox args={[0.115, 0.035, 0.27]} radius={0.01} position={[0, 0.0175, 0.02]} castShadow>
            <meshStandardMaterial color="#272420" roughness={0.9} />
          </RoundedBox>
          {/* Носок и союзка ботинка */}
          <RoundedBox args={[0.105, 0.08, 0.24]} radius={0.025} position={[0, 0.06, 0.015]} castShadow>
            <meshStandardMaterial color={isWinter ? '#1e293b' : '#7c6d56'} roughness={0.8} />
          </RoundedBox>
          {/* Голенище берца */}
          <mesh position={[0, 0.14, -0.02]} castShadow>
            <cylinderGeometry args={[0.056, 0.058, 0.14, 20]} />
            <meshStandardMaterial color={isWinter ? '#1e293b' : '#6e604b'} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* ================= НОГИ (Тактические брюки + наколенники) ================= */}
      {[-0.145, 0.145].map((xPos, idx) => (
        <group key={idx}>
          {/* Голень */}
          <mesh position={[xPos, 0.36, -0.005]} rotation={[0.02, 0, idx === 0 ? 0.02 : -0.02]} castShadow>
            <capsuleGeometry args={[0.068, 0.32, 12, 20]} />
            <meshStandardMaterial map={camoTex} bumpMap={camoTex} bumpScale={0.004} roughness={0.88} />
          </mesh>
          {/* Бедро */}
          <mesh position={[xPos * 0.92, 0.72, 0]} rotation={[-0.02, 0, idx === 0 ? 0.04 : -0.04]} castShadow>
            <capsuleGeometry args={[0.088, 0.32, 12, 20]} />
            <meshStandardMaterial map={camoTex} bumpMap={camoTex} bumpScale={0.004} roughness={0.88} />
          </mesh>
          {/* Набедренный грузовой карман */}
          <RoundedBox args={[0.04, 0.16, 0.12]} radius={0.012} position={[xPos * 1.38, 0.70, 0]} castShadow>
            <meshStandardMaterial map={camoTex} roughness={0.9} />
          </RoundedBox>
          {/* Встроенный демпферный наколенник */}
          <RoundedBox args={[0.085, 0.11, 0.045]} radius={0.018} position={[xPos, 0.53, 0.068]} castShadow>
            <meshStandardMaterial color={leatherColor} roughness={0.6} />
          </RoundedBox>
        </group>
      ))}

      {/* ================= ТАЗ И ВАРБЕЛТ (Боевой пояс) ================= */}
      <RoundedBox args={[0.35, 0.18, 0.21]} radius={0.06} position={[0, 0.94, 0]} castShadow>
        <meshStandardMaterial map={camoTex} bumpMap={camoTex} bumpScale={0.004} roughness={0.88} />
      </RoundedBox>

      {/* Тактический ремень с пряжкой Cobra */}
      <RoundedBox args={[0.37, 0.065, 0.23]} radius={0.02} position={[0, 0.98, 0]} castShadow>
        <meshStandardMaterial color={gearBaseColor} roughness={0.75} />
      </RoundedBox>
      <RoundedBox args={[0.06, 0.055, 0.02]} radius={0.008} position={[0, 0.98, 0.118]} castShadow>
        <meshStandardMaterial color={darkMetal} metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Набедренная / поясная спарка магазинов слева */}
      <group position={[0.21, 0.94, 0.04]}>
        <RoundedBox args={[0.06, 0.14, 0.11]} radius={0.01} castShadow>
          <meshStandardMaterial map={camoTex} roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.045, 0.16, 0.08]} radius={0.006} position={[0, 0.03, 0]} castShadow>
          <meshStandardMaterial color="#27272a" roughness={0.4} />
        </RoundedBox>
      </group>

      {/* Аптечка IFAK на пояснице сзади */}
      <RoundedBox args={[0.16, 0.11, 0.08]} radius={0.018} position={[0, 0.97, -0.14]} castShadow>
        <meshStandardMaterial map={camoTex} roughness={0.85} />
      </RoundedBox>

      {/* ================= ТОРС И ПЛЕЧИ ================= */}
      <RoundedBox args={[0.38, 0.54, 0.22]} radius={0.07} position={[0, 1.28, 0]} castShadow>
        <meshStandardMaterial map={camoTex} bumpMap={camoTex} bumpScale={0.004} roughness={0.88} />
      </RoundedBox>
      {/* Воротник боевой рубахи */}
      <mesh position={[0, 1.56, 0]} castShadow>
        <cylinderGeometry args={[0.078, 0.095, 0.09, 20]} />
        <meshStandardMaterial map={camoTex} roughness={0.85} />
      </mesh>

      {/* ================= РУКИ (Анатомическая A-поза как на референсе) ================= */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.23, 1.48, 0]} rotation={[0.05, 0, side * -0.34]}>
          {/* Плечо и бицепс */}
          <mesh position={[0, -0.13, 0]} castShadow>
            <capsuleGeometry args={[0.064, 0.20, 12, 20]} />
            <meshStandardMaterial map={camoTex} bumpMap={camoTex} bumpScale={0.004} roughness={0.88} />
          </mesh>
          {/* Нарукавный карман с велкро */}
          <RoundedBox args={[0.03, 0.11, 0.08]} radius={0.008} position={[side * 0.055, -0.12, 0]} castShadow>
            <meshStandardMaterial color={gearBaseColor} roughness={0.85} />
          </RoundedBox>
          {/* Предплечье */}
          <group position={[0, -0.27, 0.02]} rotation={[-0.18, 0, side * 0.12]}>
            <mesh position={[0, -0.13, 0]} castShadow>
              <capsuleGeometry args={[0.052, 0.21, 12, 20]} />
              <meshStandardMaterial map={camoTex} bumpMap={camoTex} bumpScale={0.004} roughness={0.88} />
            </mesh>
            {/* Тактическая перчатка с защитой костяшек */}
            <group position={[0, -0.29, 0]}>
              <RoundedBox args={[0.045, 0.09, 0.075]} radius={0.015} castShadow>
                <meshStandardMaterial color={leatherColor} roughness={0.65} />
              </RoundedBox>
              {/* Защитная накладка на костяшки */}
              <RoundedBox args={[0.02, 0.03, 0.07]} radius={0.008} position={[side * 0.02, 0.01, 0]}>
                <meshStandardMaterial color="#18181b" roughness={0.4} />
              </RoundedBox>
              {/* Пальцы */}
              <RoundedBox args={[0.035, 0.065, 0.06]} radius={0.01} position={[side * -0.008, -0.06, 0.005]} rotation={[0, 0, side * 0.15]}>
                <meshStandardMaterial color="#272420" roughness={0.7} />
              </RoundedBox>
            </group>
          </group>
        </group>
      ))}

      {/* ================= 01. БРОНЕЗАЩИТА (Плитник) ================= */}
      <group position={[0, 1.31, 0]}>
        {/* Передний и задний чехлы плитника */}
        <RoundedBox
          args={[armorId === 'ar1' ? 0.33 : 0.37, 0.41, armorId === 'ar1' ? 0.25 : 0.28]}
          radius={0.035}
          castShadow
        >
          <meshStandardMaterial map={camoTex} bumpMap={camoTex} bumpScale={0.006} roughness={0.78} />
        </RoundedBox>

        {/* Плечевые лямки плитника с демпферами */}
        {[-0.12, 0.12].map((xP, idx) => (
          <RoundedBox key={idx} args={[0.065, 0.08, 0.25]} radius={0.015} position={[xP, 0.22, 0]} castShadow>
            <meshStandardMaterial color={gearBaseColor} roughness={0.75} />
          </RoundedBox>
        ))}

        {/* Админ-панель и патч на груди */}
        <RoundedBox args={[0.18, 0.09, 0.02]} radius={0.006} position={[0, 0.11, armorId === 'ar1' ? 0.128 : 0.143]}>
          <meshStandardMaterial color={gearBaseColor} roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[0.065, 0.038, 0.008]} radius={0.003} position={[-0.03, 0.115, armorId === 'ar1' ? 0.138 : 0.153]}>
          <meshStandardMaterial color="#3f3f46" roughness={0.5} />
        </RoundedBox>

        {/* Боковые камербанды с баллистикой (ar2 и ar3) */}
        {(armorId === 'ar2' || armorId === 'ar3') && (
          <RoundedBox args={[0.41, 0.21, 0.26]} radius={0.025} position={[0, -0.05, 0]} castShadow>
            <meshStandardMaterial map={camoTex} roughness={0.8} />
          </RoundedBox>
        )}

        {/* Усиленный штурмовой модуль (ar3): защита шеи, напашник и наплечники */}
        {armorId === 'ar3' && (
          <>
            {/* Броневоротник */}
            <mesh position={[0, 0.24, -0.01]} castShadow>
              <cylinderGeometry args={[0.12, 0.15, 0.09, 20]} />
              <meshStandardMaterial map={camoTex} roughness={0.8} />
            </mesh>
            {/* Напашный модуль */}
            <RoundedBox args={[0.23, 0.19, 0.035]} radius={0.02} position={[0, -0.28, 0.135]} castShadow>
              <meshStandardMaterial map={camoTex} roughness={0.8} />
            </RoundedBox>
            {/* Баллистические наплечники */}
            {[-1, 1].map((s) => (
              <RoundedBox key={s} args={[0.06, 0.19, 0.18]} radius={0.02} position={[s * 0.24, 0.14, 0]} rotation={[0, 0, s * -0.28]} castShadow>
                <meshStandardMaterial map={camoTex} roughness={0.8} />
              </RoundedBox>
            ))}
          </>
        )}
      </group>

      {/* ================= 03. БОЕКОМПЛЕКТ, ГРАНАТЫ И РЮКЗАК ================= */}
      <group position={[0, 1.21, armorId === 'ar1' ? 0.145 : 0.16]}>
        {/* 4 подсумка с клапанами как на референсе */}
        {(loadoutId === 'ld1' || loadoutId === 'ld2') &&
          [-0.12, -0.04, 0.04, 0.12].map((xPos, i) => (
            <group key={i} position={[xPos, 0, 0]}>
              <RoundedBox args={[0.068, 0.155, 0.055]} radius={0.01} castShadow>
                <meshStandardMaterial map={camoTex} roughness={0.85} />
              </RoundedBox>
              {/* Клапан подсумка */}
              <RoundedBox args={[0.07, 0.055, 0.06]} radius={0.008} position={[0, 0.048, 0.003]}>
                <meshStandardMaterial color={gearBaseColor} roughness={0.8} />
              </RoundedBox>
            </group>
          ))}

        {/* Второй эшелон подсумков + гранаты (для усиленного БК ld2) */}
        {loadoutId === 'ld2' && (
          <>
            {[-0.08, 0, 0.08].map((xPos, i) => (
              <RoundedBox key={i} args={[0.062, 0.13, 0.045]} radius={0.008} position={[xPos, -0.01, 0.045]} castShadow>
                <meshStandardMaterial color={gearBaseColor} roughness={0.8} />
              </RoundedBox>
            ))}
            {/* Дымовая шашка M18 на груди */}
            <mesh position={[-0.11, 0.14, 0.01]} rotation={[0, 0, 0.18]} castShadow>
              <cylinderGeometry args={[0.026, 0.026, 0.11, 16]} />
              <meshStandardMaterial color="#4b5563" metalness={0.4} roughness={0.5} />
            </mesh>
            {/* Осколочная граната */}
            <mesh position={[-0.04, 0.12, 0.02]} castShadow>
              <sphereGeometry args={[0.032, 16, 16]} />
              <meshStandardMaterial color="#3f4730" roughness={0.6} />
            </mesh>
          </>
        )}
      </group>

      {/* Рация на левом плече с гибкой антенной (04) */}
      <group position={[-0.14, 1.44, 0.14]}>
        <RoundedBox args={[0.045, 0.11, 0.035]} radius={0.006} castShadow>
          <meshStandardMaterial color={darkMetal} roughness={0.4} />
        </RoundedBox>
        <mesh position={[0, 0.15, -0.01]}>
          <cylinderGeometry args={[0.004, 0.006, 0.22, 8]} />
          <meshStandardMaterial color="#09090b" />
        </mesh>
      </group>

      {/* Тактический рюкзак (Оператор БПЛА ld3 или Медик ld4) */}
      {(loadoutId === 'ld3' || loadoutId === 'ld4') && (
        <group position={[0, 1.29, -0.21]}>
          <RoundedBox args={[0.31, 0.43, 0.16]} radius={0.035} castShadow>
            <meshStandardMaterial map={camoTex} roughness={0.85} />
          </RoundedBox>
          {loadoutId === 'ld4' ? (
            <group position={[0, 0.04, -0.083]}>
              <mesh>
                <boxGeometry args={[0.11, 0.03, 0.008]} />
                <meshStandardMaterial color="#dc2626" />
              </mesh>
              <mesh>
                <boxGeometry args={[0.03, 0.11, 0.008]} />
                <meshStandardMaterial color="#dc2626" />
              </mesh>
            </group>
          ) : (
            <mesh position={[0.11, 0.30, -0.03]} castShadow>
              <cylinderGeometry args={[0.006, 0.01, 0.25, 8]} />
              <meshStandardMaterial color="#09090b" />
            </mesh>
          )}
        </group>
      )}

      {/* ================= 02. ГОЛОВА, БАЛАКЛАВА, ШЛЕМ И ОПТИКА (04) ================= */}
      <group position={[0, 1.71, 0.01]}>
        {/* Голова в балаклаве с рисунком как на референсе */}
        <mesh castShadow>
          <sphereGeometry args={[0.115, 24, 24]} />
          <meshStandardMaterial color={gearBaseColor} roughness={0.85} />
        </mesh>
        {/* Открытая зона глаз */}
        <RoundedBox args={[0.13, 0.038, 0.04]} radius={0.01} position={[0, 0.015, 0.10]}>
          <meshStandardMaterial color="#d6a384" roughness={0.6} />
        </RoundedBox>
        {/* Глаза и брови */}
        {[-0.032, 0.032].map((xE, idx) => (
          <group key={idx} position={[xE, 0.015, 0.118]}>
            <mesh>
              <sphereGeometry args={[0.011, 12, 12]} />
              <meshStandardMaterial color="#27272a" />
            </mesh>
            <mesh position={[0, 0.016, 0]}>
              <boxGeometry args={[0.032, 0.007, 0.008]} />
              <meshStandardMaterial color="#3f2e21" />
            </mesh>
          </group>
        ))}

        {/* Тактический шлем (OPS-CORE FAST) */}
        <mesh position={[0, 0.038, -0.01]} castShadow>
          <sphereGeometry args={[0.135, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.56]} />
          <meshStandardMaterial
            map={helmetId === 'hl3' ? null : camoTex}
            color={helmetId === 'hl3' ? '#18181b' : '#ffffff'}
            roughness={helmetId === 'hl3' ? 0.35 : 0.7}
          />
        </mesh>

        {/* Боковые рельсы ARC на шлеме */}
        {[-1, 1].map((s) => (
          <RoundedBox key={s} args={[0.015, 0.035, 0.11]} radius={0.004} position={[s * 0.132, 0.025, 0.01]}>
            <meshStandardMaterial color={gearBaseColor} roughness={0.5} />
          </RoundedBox>
        ))}

        {/* Баллистические уши + визор (hl2) */}
        {helmetId === 'hl2' && (
          <>
            {[-1, 1].map((s) => (
              <RoundedBox key={s} args={[0.025, 0.09, 0.10]} radius={0.008} position={[s * 0.13, -0.02, -0.02]} castShadow>
                <meshStandardMaterial map={camoTex} roughness={0.7} />
              </RoundedBox>
            ))}
            <RoundedBox args={[0.21, 0.075, 0.012]} radius={0.005} position={[0, 0.01, 0.135]}>
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.4} metalness={0.6} roughness={0.1} />
            </RoundedBox>
          </>
        )}

        {/* Активные наушники с микрофоном (hl1 и hl3) */}
        {(helmetId === 'hl1' || helmetId === 'hl3') && (
          <>
            {[-1, 1].map((s) => (
              <RoundedBox key={s} args={[0.04, 0.08, 0.065]} radius={0.015} position={[s * 0.142, -0.015, -0.005]} castShadow>
                <meshStandardMaterial color={gearBaseColor} roughness={0.55} />
              </RoundedBox>
            ))}
            {/* Штанга микрофона */}
            <mesh position={[0.09, -0.045, 0.07]} rotation={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.003, 0.003, 0.11, 8]} />
              <meshStandardMaterial color={darkMetal} />
            </mesh>
          </>
        )}

        {/* Шрауд (фронтальное крепление ПНВ) */}
        <RoundedBox args={[0.055, 0.055, 0.022]} radius={0.006} position={[0, 0.075, 0.128]} castShadow>
          <meshStandardMaterial color={darkMetal} metalness={0.6} roughness={0.3} />
        </RoundedBox>

        {/* Бинокулярный ПНВ (op2) или Тепловизор (op3) на шлеме как на референсе */}
        {(opticsId === 'op2' || opticsId === 'op3') && (
          <group position={[0, 0.13, 0.11]} rotation={[-0.35, 0, 0]}>
            {/* Рог-кронштейн Wilcox */}
            <RoundedBox args={[0.032, 0.05, 0.06]} radius={0.005} position={[0, -0.02, 0.01]}>
              <meshStandardMaterial color={darkMetal} metalness={0.7} roughness={0.3} />
            </RoundedBox>
            {/* Два тубуса бинокуляра */}
            {[-0.026, 0.026].map((xTube, idx) => (
              <group key={idx} position={[xTube, 0.025, 0.02]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.02, 0.022, 0.11, 16]} />
                  <meshStandardMaterial color={opticsId === 'op3' ? '#334155' : '#18181b'} metalness={0.65} roughness={0.25} />
                </mesh>
                {/* Светящаяся линза */}
                <mesh position={[0, 0.056, 0]}>
                  <cylinderGeometry args={[0.017, 0.017, 0.004, 16]} />
                  <meshStandardMaterial
                    color={opticsId === 'op3' ? '#f59e0b' : '#10b981'}
                    emissive={opticsId === 'op3' ? '#f59e0b' : '#10b981'}
                    emissiveIntensity={1.3}
                  />
                </mesh>
              </group>
            ))}
          </group>
        )}
      </group>
    </group>
  );
}

export default function SoldierViewer3D({ armor, helmet, loadout, optics, uniform }) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '620px',
        backgroundColor: '#0b0e14',
        borderRadius: '14px',
        border: '1px solid #2d3748',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8), 0 10px 30px rgba(0, 0, 0, 0.4)'
      }}
    >
      {/* Верхний HUD-оверлей */}
      <div style={{ position: 'absolute', top: '14px', left: '16px', right: '16px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase' }}>
            3D TACTICAL SPECIMEN
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: 'rgba(17, 22, 31, 0.85)', padding: '4px 10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
          🖱 Вращение 360° • Зум
        </span>
      </div>

      {/* 3D-сцена: камера отцентрирована на высоту бойца (y = 0.92) */}
      <Canvas shadows camera={{ position: [0, 1.05, 2.55], fov: 42 }}>
        <color attach="background" args={['#0b0e14']} />
        <fog attach="fog" args={['#0b0e14', 4.5, 9.5]} />

        <ambientLight intensity={0.85} />
        <directionalLight position={[2.5, 4.5, 3.5]} intensity={1.9} castShadow />
        <directionalLight position={[-2.5, 3, -2.5]} intensity={0.7} color="#38bdf8" />
        <spotLight position={[0, 4, -2]} intensity={1.1} color="#10b981" />

        {/* Тактический подиум строго на уровне подошв (y = 0) */}
        <mesh position={[0, -0.02, 0]} receiveShadow>
          <cylinderGeometry args={[0.65, 0.72, 0.04, 48]} />
          <meshStandardMaterial color="#161b22" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.61, 0.64, 48]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        <TacticalSoldier
          armorId={armor?.id}
          helmetId={helmet?.id}
          loadoutId={loadout?.id}
          opticsId={optics?.id}
          uniformId={uniform?.id}
        />

        <ContactShadows position={[0, 0.002, 0]} opacity={0.65} scale={2.5} blur={1.8} />
        <Environment preset="city" />
        <OrbitControls
          target={[0, 0.92, 0]}
          enablePan={false}
          minDistance={1.4}
          maxDistance={3.8}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.02}
        />
      </Canvas>

      {/* Нижняя панель активных модулей */}
      <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', zIndex: 10, display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center', pointerEvents: 'none' }}>
        <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(17, 22, 31, 0.85)', border: '1px solid #2d3748', color: '#cbd5e1' }}>
          Броня: <strong style={{ color: '#10b981' }}>{armor?.id.toUpperCase()}</strong>
        </span>
        <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(17, 22, 31, 0.85)', border: '1px solid #2d3748', color: '#cbd5e1' }}>
          Шлем: <strong style={{ color: '#10b981' }}>{helmet?.id.toUpperCase()}</strong>
        </span>
        <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(17, 22, 31, 0.85)', border: '1px solid #2d3748', color: '#cbd5e1' }}>
          Оптика: <strong style={{ color: '#38bdf8' }}>{optics?.id.toUpperCase()}</strong>
        </span>
      </div>
    </div>
  );
}