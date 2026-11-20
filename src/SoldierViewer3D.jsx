import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';

function SoldierModel({ armorId, helmetId, loadoutId, opticsId, uniformId }) {
  const groupRef = useRef();

  // Лёгкое «дыхание» манекена в реальном времени
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.015;
    }
  });

  // Расцветка формы: Мультикам / Олива (un1) или Тёмно-серый демисезон (un2)
  const isWinter = uniformId === 'un2';
  const uniformColor = isWinter ? '#334155' : '#4b5338';
  const pantsColor = isWinter ? '#1e293b' : '#3f4730';
  const bootsColor = isWinter ? '#0f172a' : '#5c4d3c';
  const gearColor = '#2b3025'; // Тактический олива / койот
  const pouchColor = '#5c5342';

  return (
    <group ref={groupRef} position={[0, -0.95, 0]}>
      {/* БОТИНКИ */}
      <mesh position={[-0.14, 0.08, 0.04]} castShadow>
        <boxGeometry args={[0.13, 0.16, 0.28]} />
        <meshStandardMaterial color={bootsColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.14, 0.08, 0.04]} castShadow>
        <boxGeometry args={[0.13, 0.16, 0.28]} />
        <meshStandardMaterial color={bootsColor} roughness={0.8} />
      </mesh>

      {/* НОГИ (БРЮКИ + НАКОЛЕННИКИ) */}
      <mesh position={[-0.14, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.075, 0.75, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      <mesh position={[0.14, 0.52, 0]} castShadow>
        <cylinderGeometry args={[0.095, 0.075, 0.75, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      {/* Наколенники */}
      <mesh position={[-0.14, 0.52, 0.085]} castShadow>
        <boxGeometry args={[0.11, 0.13, 0.05]} />
        <meshStandardMaterial color="#1e241b" roughness={0.5} />
      </mesh>
      <mesh position={[0.14, 0.52, 0.085]} castShadow>
        <boxGeometry args={[0.11, 0.13, 0.05]} />
        <meshStandardMaterial color="#1e241b" roughness={0.5} />
      </mesh>

      {/* ТАЗ И ПОЯСНОЙ РЕМЕНЬ */}
      <mesh position={[0, 0.94, 0]} castShadow>
        <boxGeometry args={[0.38, 0.18, 0.22]} />
        <meshStandardMaterial color={pantsColor} roughness={0.85} />
      </mesh>
      {/* Варбелт (тактический пояс) */}
      <mesh position={[0, 0.98, 0]} castShadow>
        <boxGeometry args={[0.41, 0.09, 0.25]} />
        <meshStandardMaterial color={gearColor} roughness={0.7} />
      </mesh>

      {/* ТОРС (БОЕВАЯ РУБАХА / КУРТКА) */}
      <mesh position={[0, 1.32, 0]} castShadow>
        <boxGeometry args={[0.42, 0.58, 0.24]} />
        <meshStandardMaterial color={uniformColor} roughness={0.85} />
      </mesh>

      {/* РУКИ */}
      <group position={[-0.29, 1.52, 0]} rotation={[0, 0, 0.12]}>
        <mesh position={[0, -0.26, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.055, 0.54, 16]} />
          <meshStandardMaterial color={uniformColor} roughness={0.85} />
        </mesh>
        {/* Перчатка */}
        <mesh position={[0, -0.56, 0]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#1f2421" roughness={0.6} />
        </mesh>
      </group>
      <group position={[0.29, 1.52, 0]} rotation={[0, 0, -0.12]}>
        <mesh position={[0, -0.26, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.055, 0.54, 16]} />
          <meshStandardMaterial color={uniformColor} roughness={0.85} />
        </mesh>
        {/* Перчатка */}
        <mesh position={[0, -0.56, 0]} castShadow>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshStandardMaterial color="#1f2421" roughness={0.6} />
        </mesh>
      </group>

      {/* ================= БРОНЕЗАЩИТА (01) ================= */}
      {/* Базовый плитник (есть во всех вариантах ar1, ar2, ar3) */}
      <group position={[0, 1.35, 0]}>
        {/* Передняя и задняя плиты */}
        <mesh castShadow>
          <boxGeometry args={[armorId === 'ar1' ? 0.38 : 0.44, 0.44, armorId === 'ar1' ? 0.28 : 0.32]} />
          <meshStandardMaterial color={gearColor} roughness={0.65} />
        </mesh>

        {/* Боковые камербанды для Бр5 (ar2 и ar3) */}
        {(armorId === 'ar2' || armorId === 'ar3') && (
          <mesh position={[0, -0.04, 0]} castShadow>
            <boxGeometry args={[0.47, 0.24, 0.29]} />
            <meshStandardMaterial color={gearColor} roughness={0.7} />
          </mesh>
        )}

        {/* Усиленный штурмовой обвес (ar3): защита шеи, напашник и наплечники */}
        {armorId === 'ar3' && (
          <>
            {/* Воротник (защита шеи) */}
            <mesh position={[0, 0.27, -0.02]} castShadow>
              <cylinderGeometry args={[0.15, 0.18, 0.12, 16]} />
              <meshStandardMaterial color={gearColor} roughness={0.7} />
            </mesh>
            {/* Напашник */}
            <mesh position={[0, -0.32, 0.15]} castShadow>
              <boxGeometry args={[0.26, 0.22, 0.05]} />
              <meshStandardMaterial color={gearColor} roughness={0.7} />
            </mesh>
            {/* Наплечники */}
            <mesh position={[-0.29, 0.18, 0]} rotation={[0, 0, 0.2]} castShadow>
              <boxGeometry args={[0.14, 0.22, 0.22]} />
              <meshStandardMaterial color={gearColor} roughness={0.7} />
            </mesh>
            <mesh position={[0.29, 0.18, 0]} rotation={[0, 0, -0.2]} castShadow>
              <boxGeometry args={[0.14, 0.22, 0.22]} />
              <meshStandardMaterial color={gearColor} roughness={0.7} />
            </mesh>
          </>
        )}
      </group>

      {/* ================= БОЕКОМПЛЕКТ И РЮКЗАК (03) ================= */}
      {/* Магазинные подсумки спереди */}
      <group position={[0, 1.24, 0.17]}>
        {(loadoutId === 'ld1' || loadoutId === 'ld2') && (
          <>
            <mesh position={[-0.11, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.16, 0.06]} />
              <meshStandardMaterial color={pouchColor} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.16, 0.06]} />
              <meshStandardMaterial color={pouchColor} roughness={0.75} />
            </mesh>
            <mesh position={[0.11, 0, 0]} castShadow>
              <boxGeometry args={[0.08, 0.16, 0.06]} />
              <meshStandardMaterial color={pouchColor} roughness={0.75} />
            </mesh>
          </>
        )}
        {/* Второй ряд магазинов для усиленного БК (ld2) */}
        {loadoutId === 'ld2' && (
          <>
            <mesh position={[-0.11, 0.02, 0.05]} castShadow>
              <boxGeometry args={[0.075, 0.14, 0.05]} />
              <meshStandardMaterial color={gearColor} roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.02, 0.05]} castShadow>
              <boxGeometry args={[0.075, 0.14, 0.05]} />
              <meshStandardMaterial color={gearColor} roughness={0.75} />
            </mesh>
            <mesh position={[0.11, 0.02, 0.05]} castShadow>
              <boxGeometry args={[0.075, 0.14, 0.05]} />
              <meshStandardMaterial color={gearColor} roughness={0.75} />
            </mesh>
          </>
        )}
      </group>

      {/* Аптечка на поясе сзади */}
      <mesh position={[0.12, 0.98, -0.15]} castShadow>
        <boxGeometry args={[0.14, 0.11, 0.08]} />
        <meshStandardMaterial color="#7f1d1d" roughness={0.7} />
      </mesh>

      {/* Рюкзак оператора БПЛА (ld3) или Медицинский рюкзак (ld4) */}
      {(loadoutId === 'ld3' || loadoutId === 'ld4') && (
        <group position={[0, 1.32, -0.24]}>
          <mesh castShadow>
            <boxGeometry args={[0.34, 0.46, 0.18]} />
            <meshStandardMaterial color={loadoutId === 'ld4' ? '#3f4730' : '#1e293b'} roughness={0.75} />
          </mesh>
          {/* Красный крест для медика или антенна для БПЛА */}
          {loadoutId === 'ld4' ? (
            <group position={[0, 0.05, -0.095]}>
              <mesh>
                <boxGeometry args={[0.12, 0.035, 0.01]} />
                <meshStandardMaterial color="#ef4444" />
              </mesh>
              <mesh>
                <boxGeometry args={[0.035, 0.12, 0.01]} />
                <meshStandardMaterial color="#ef4444" />
              </mesh>
            </group>
          ) : (
            <mesh position={[0.13, 0.34, -0.04]} castShadow>
              <cylinderGeometry args={[0.008, 0.012, 0.28, 8]} />
              <meshStandardMaterial color="#0f172a" />
            </mesh>
          )}
        </group>
      )}

      {/* Рация на левом плече (04) */}
      <group position={[-0.17, 1.48, 0.16]}>
        <mesh castShadow>
          <boxGeometry args={[0.06, 0.13, 0.04]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.005, 0.007, 0.22, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* ================= ГОЛОВА, ШЛЕМ (02) И ОПТИКА (04) ================= */}
      <group position={[0, 1.78, 0]}>
        {/* Голова / Балаклава */}
        <mesh castShadow>
          <sphereGeometry args={[0.13, 20, 20]} />
          <meshStandardMaterial color="#27272a" roughness={0.8} />
        </mesh>

        {/* Тактические очки на глазах */}
        <mesh position={[0, 0.01, 0.12]}>
          <boxGeometry args={[0.18, 0.055, 0.04]} />
          <meshStandardMaterial color="#0284c7" metalness={0.8} roughness={0.15} />
        </mesh>

        {/* Шлем */}
        <mesh position={[0, 0.045, -0.01]} castShadow>
          <sphereGeometry args={[0.152, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.58]} />
          <meshStandardMaterial
            color={helmetId === 'hl3' ? '#18181b' : gearColor}
            roughness={helmetId === 'hl3' ? 0.3 : 0.6}
          />
        </mesh>

        {/* Баллистические уши для hl2 */}
        {helmetId === 'hl2' && (
          <>
            <mesh position={[-0.145, -0.02, -0.02]} castShadow>
              <boxGeometry args={[0.03, 0.1, 0.11]} />
              <meshStandardMaterial color={gearColor} roughness={0.6} />
            </mesh>
            <mesh position={[0.145, -0.02, -0.02]} castShadow>
              <boxGeometry args={[0.03, 0.1, 0.11]} />
              <meshStandardMaterial color={gearColor} roughness={0.6} />
            </mesh>
            {/* Прозрачный баллистический визор */}
            <mesh position={[0, 0.01, 0.145]}>
              <boxGeometry args={[0.24, 0.09, 0.015]} />
              <meshStandardMaterial color="#bae6fd" transparent opacity={0.45} metalness={0.5} roughness={0.1} />
            </mesh>
          </>
        )}

        {/* Активные наушники для hl1 и hl3 */}
        {(helmetId === 'hl1' || helmetId === 'hl3') && (
          <>
            <mesh position={[-0.155, -0.01, 0]} castShadow>
              <boxGeometry args={[0.045, 0.09, 0.075]} />
              <meshStandardMaterial color="#3f3f46" roughness={0.5} />
            </mesh>
            <mesh position={[0.155, -0.01, 0]} castShadow>
              <boxGeometry args={[0.045, 0.09, 0.075]} />
              <meshStandardMaterial color="#3f3f46" roughness={0.5} />
            </mesh>
          </>
        )}

        {/* Шрауд (крепление на лоб шлема) */}
        <mesh position={[0, 0.08, 0.145]} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.025]} />
          <meshStandardMaterial color="#18181b" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* ПНВ (op2) или Тепловизор (op3) на шлеме */}
        {(opticsId === 'op2' || opticsId === 'op3') && (
          <group position={[0, 0.06, 0.19]}>
            {/* Кронштейн */}
            <mesh position={[0, 0.02, -0.03]}>
              <boxGeometry args={[0.03, 0.03, 0.06]} />
              <meshStandardMaterial color="#09090b" metalness={0.7} />
            </mesh>
            {/* Монокуляр ПНВ / Тепловизор */}
            <mesh position={[0.03, -0.02, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.026, 0.03, 0.11, 16]} />
              <meshStandardMaterial color={opticsId === 'op3' ? '#334155' : '#09090b'} metalness={0.6} roughness={0.3} />
            </mesh>
            {/* Линза со свечением */}
            <mesh position={[0.03, -0.02, 0.076]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.005, 16]} />
              <meshStandardMaterial
                color={opticsId === 'op3' ? '#f59e0b' : '#10b981'}
                emissive={opticsId === 'op3' ? '#f59e0b' : '#10b981'}
                emissiveIntensity={1.2}
              />
            </mesh>
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
        height: '580px',
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
            3D TACTICAL MANNEQUIN
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: 'rgba(17, 22, 31, 0.8)', padding: '4px 10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
          🖱 Вращение 360° • Колёсико: зум
        </span>
      </div>

      {/* 3D-сцена */}
      <Canvas shadows camera={{ position: [0, 0.25, 2.75], fov: 42 }}>
        <color attach="background" args={['#0b0e14']} />
        <fog attach="fog" args={['#0b0e14', 4, 9]} />

        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 5, 4]} intensity={1.8} castShadow />
        <directionalLight position={[-3, 3, -3]} intensity={0.8} color="#38bdf8" />
        <spotLight position={[0, 4, -2]} intensity={1.2} color="#10b981" />

        {/* Тактический подиум под ногами */}
        <mesh position={[0, -0.97, 0]} receiveShadow>
          <cylinderGeometry args={[0.72, 0.78, 0.04, 32]} />
          <meshStandardMaterial color="#161b22" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.95, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.68, 0.71, 32]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>

        <SoldierModel
          armorId={armor?.id}
          helmetId={helmet?.id}
          loadoutId={loadout?.id}
          opticsId={optics?.id}
          uniformId={uniform?.id}
        />

        <ContactShadows position={[0, -0.94, 0]} opacity={0.6} scale={3} blur={2} />
        <Environment preset="city" />
        <OrbitControls
          enablePan={false}
          minDistance={1.6}
          maxDistance={4.2}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 1.9}
        />
      </Canvas>

      {/* Нижняя панель текущих слоёв */}
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