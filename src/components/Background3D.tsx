import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

function Stars({ theme, ...props }: any) {
  const ref = useRef<any>(null);
  
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere as Float32Array} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color={theme === 'light' ? '#333333' : '#fdbf5c'} size={0.005} sizeAttenuation={true} depthWrite={false} />
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
