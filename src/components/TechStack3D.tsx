import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const skills = [
  { name: 'React', color: '#61DAFB' },
  { name: 'Node.js', color: '#339933' },
  { name: 'MongoDB', color: '#47A248' },
  { name: 'Express', color: '#aaaaaa' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'Python', color: '#3776AB' },
  { name: 'HTML5', color: '#E34F26' },
  { name: 'CSS3', color: '#1572B6' }
];

const OrbitingNodes = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, index) => {
        const radius = 3.5;
        const angle = (index / skills.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = Math.sin(angle * 3) * 1; // Wavy pattern

        return (
          <Float key={skill.name} speed={2} rotationIntensity={1.5} floatIntensity={1.5} position={[x, y, z]}>
            <mesh>
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshStandardMaterial color={skill.color} emissive={skill.color} emissiveIntensity={0.5} roughness={0.2} metalness={0.8} />
            </mesh>
            <Text position={[0, -0.6, 0]} fontSize={0.3} color="#ffffff" anchorX="center" anchorY="middle" outlineWidth={0.03} outlineColor="#000000" fontWeight="bold">
              {skill.name}
            </Text>
          </Float>
        );
      })}
    </group>
  );
};

const CenterPiece = () => {
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (innerRef.current && outerRef.current) {
      innerRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      innerRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      outerRef.current.rotation.x = -state.clock.elapsedTime * 0.1;
      outerRef.current.rotation.y = -state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color="#fdbf5c" wireframe={true} emissive="#fdbf5c" emissiveIntensity={0.5} transparent opacity={0.5} />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshStandardMaterial color="#222222" roughness={0.1} metalness={0.9} />
      </mesh>
    </Float>
  );
};

const TechStack3D: React.FC = () => {
  return (
    <div style={{ height: '400px', width: '100%', marginBottom: '30px', background: 'var(--eerie-black-1)', borderRadius: '16px', border: '1px solid var(--jet)', overflow: 'hidden', position: 'relative', boxShadow: 'var(--shadow-2)' }}>
      <div style={{ position: 'absolute', top: '20px', left: '25px', zIndex: 1, pointerEvents: 'none' }}>
        <h3 className="h3" style={{ color: 'var(--orange-yellow-crayola)', marginBottom: '5px' }}>Tech Universe</h3>
        <p style={{ color: 'var(--light-gray)', fontSize: '13px' }}>Interactive 3D orbit (Drag & Zoom)</p>
      </div>
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#fdbf5c" />
        
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <CenterPiece />
        <OrbitingNodes />
        <OrbitControls enableZoom={true} enablePan={false} autoRotate={true} autoRotateSpeed={0.5} maxDistance={12} minDistance={4} />
      </Canvas>
    </div>
  );
};

export default TechStack3D;
