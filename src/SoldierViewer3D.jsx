import React, { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, useGLTF, Center } from '@react-three/drei';

function MannequinModel() {
  // Загружаем твой файл из папки public/mannequin.glb
  const { scene } = useGLTF('/mannequin.glb');

  // Включаем тени для всех частей 3D-модели
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  return (
    // Center автоматически выровняет модель по центру подиума (bottom ставит ровно на пол y = 0)
    <Center bottom position={[0, 1.76, 0]}>
      <primitive object={scene} scale={1.75} />
    </Center>
  );
}

// Предзагрузка модели для быстрого старта
useGLTF.preload('/mannequin.glb');

export default function SoldierViewer3D({ armor, helmet, loadout, optics }) {
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
            3D TACTICAL SPECIMEN (TRELLIS)
          </span>
        </div>
        <span style={{ fontSize: '11px', color: '#64748b', backgroundColor: 'rgba(17, 22, 31, 0.85)', padding: '4px 10px', borderRadius: '6px', border: '1px solid #1e293b' }}>
          🖱 Вращение 360° • Зум
        </span>
      </div>

      {/* 3D-сцена */}
      <Canvas shadows camera={{ position: [0, 1.05, 2.55], fov: 42 }}>
        <color attach="background" args={['#0b0e14']} />
        <fog attach="fog" args={['#0b0e14', 4.5, 9.5]} />

        <ambientLight intensity={1.1} />
        <directionalLight position={[2.5, 4.5, 3.5]} intensity={1.8} castShadow />
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

        {/* Твой 3D-манекен */}
        <MannequinModel />

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
          Броня: <strong style={{ color: '#10b981' }}>{armor?.id?.toUpperCase() || 'AR2'}</strong>
        </span>
        <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(17, 22, 31, 0.85)', border: '1px solid #2d3748', color: '#cbd5e1' }}>
          Шлем: <strong style={{ color: '#10b981' }}>{helmet?.id?.toUpperCase() || 'HL2'}</strong>
        </span>
        <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '4px', backgroundColor: 'rgba(17, 22, 31, 0.85)', border: '1px solid #2d3748', color: '#cbd5e1' }}>
          Оптика: <strong style={{ color: '#38bdf8' }}>{optics?.id?.toUpperCase() || 'OP1'}</strong>
        </span>
      </div>
    </div>
  );
}