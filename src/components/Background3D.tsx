import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

function Stars({ theme, ...props }: any) {
  // Creating 3 independent 3D mathematical clustered layers!
  const ref1 = useRef<any>(null); // Layer 1: Background Infinite Deep Space (Tiny, faint)
  const ref2 = useRef<any>(null); // Layer 2: Milky Way Dust Mist (Larger, glowing blue/purple tint)
  const ref3 = useRef<any>(null); // Layer 3: Foreground Brilliant Stars (Sharp, bright white)
  
  const [sphere1] = useState(() => random.inSphere(new Float32Array(5001), { radius: 3.5 })); 
  const [sphere2] = useState(() => random.inSphere(new Float32Array(8001), { radius: 2.5 })); 
  const [sphere3] = useState(() => random.inSphere(new Float32Array(2001), { radius: 1.5 })); 

  useFrame((state, delta) => {
    // Ultra-calm, divergent rotational speeds simulating real planetary motion
    if (ref1.current) ref1.current.rotation.x -= delta / 150;
    if (ref2.current) ref2.current.rotation.y -= delta / 100;
    if (ref3.current) ref3.current.rotation.x -= delta / 50;
    
    // Mapped subtle parallax engine
    const targetX = state.pointer.x * 0.1;
    const targetY = state.pointer.y * 0.1;
    
    if (ref1.current) ref1.current.position.x += (targetX - ref1.current.position.x) * 0.05;
    if (ref2.current) ref2.current.position.y += (targetY - ref2.current.position.y) * 0.05;
  });

  const baseTheme = theme === 'light' ? '#ff9966' : '#ffffff';
  const twilightMist = theme === 'light' ? '#ffcc99' : '#88ccff'; // Gives the night sky that rich photographic ice-blue nebulous tint

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      {/* Math Layer 1: Massive spread of faintly visible deep-space background dots */}
      <Points ref={ref1} positions={sphere1 as Float32Array} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color={baseTheme} size={0.002} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
      </Points>
      
      {/* Math Layer 2: Thick, soft, ice-blue glowing dust forming the Milky Way clouds */}
      <Points ref={ref2} positions={sphere2 as Float32Array} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color={twilightMist} size={0.008} sizeAttenuation={true} depthWrite={false} opacity={0.15} />
      </Points>

      {/* Math Layer 3: Intensely bright, extremely sharp foreground constellation stars */}
      <Points ref={ref3} positions={sphere3 as Float32Array} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color={baseTheme} size={0.006} sizeAttenuation={true} depthWrite={false} opacity={0.9} />
      </Points>
    </group>
  );
}

const Background3D: React.FC<{ theme: string }> = ({ theme }) => {
  return (
    <div className={`perfect-sky-bg theme-${theme}`} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', overflow: 'hidden' }}>
      
      {/* 🌌 THREE.JS Volumetric Layered Starfield */}
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars theme={theme} />
      </Canvas>

      {/* Pure CSS Photographic Gradient Compositions */}
      <style>{`
        /* 🌲 Dark Mode & Cyberpunk: Mathematically Constructed Galactic Clouds */
        .perfect-sky-bg.theme-dark,
        .perfect-sky-bg.theme-cyberpunk {
          background-color: #020306;
          /* Generating the exact nebula gas cloud photography from the PNG purely in code! */
          background-image: 
            radial-gradient(ellipse at 50% 120%, rgba(20, 50, 120, 0.4) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(60, 20, 100, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at -20% 50%, rgba(10, 60, 80, 0.2) 0%, transparent 40%);
        }

        /* 🌅 Light Mode: Beautiful Golden Dawn Sunrise Transition */
        .perfect-sky-bg.theme-light {
          background: radial-gradient(ellipse at top, #ffe4d6 0%, #ffecd2 100%);
        }
      `}</style>
    </div>
  );
};

export default Background3D;
