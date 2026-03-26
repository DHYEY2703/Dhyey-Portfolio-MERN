import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

function Stars({ theme, ...props }: any) {
  const ref = useRef<any>(null);
  
  // Increased particle count and radius for a much deeper, fuller universe
  const [sphere] = useState(() => random.inSphere(new Float32Array(8000), { radius: 3 }));

  useFrame((state, delta) => {
    if (ref.current) {
      // Base continuous slow rotation
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
      
      // Interactive Parallax - The universe subtly shifts when you move your mouse!
      const targetX = state.pointer.x * 0.2;
      const targetY = state.pointer.y * 0.2;
      
      ref.current.position.x += (targetX - ref.current.position.x) * 0.1;
      ref.current.position.y += (targetY - ref.current.position.y) * 0.1;
    }
  });

  // Perfectly matches the warm terracotta in light mode, and golden yellow in dark mode
  const particleColor = theme === 'light' ? '#d96c4e' : '#fdbf5c';

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled={false} {...props}>
        <PointMaterial 
          transparent 
          color={particleColor} 
          size={0.006} 
          sizeAttenuation={true} 
          depthWrite={false} 
          opacity={theme === 'light' ? 0.4 : 0.8}
        />
      </Points>
    </group>
  );
}

const Background3D: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars theme={theme} />
      </Canvas>
    </div>
  );
};

export default Background3D;
