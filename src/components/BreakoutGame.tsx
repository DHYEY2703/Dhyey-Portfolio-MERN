import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/SoundManager';

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string; 
  originalElement: HTMLElement;
  active: boolean;
  color: string;
}

const BreakoutGame: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    // 1. Map existing actual UI elements to bricks
    const uiElements = Array.from(document.querySelectorAll(
      '.project-item, .service-item, .timeline-item, .blog-post-item, .testimonials-item, .clients-item, .sidebar, .navbar, .content-card, .contact-item, .social-item, .about-text p, .input-wrapper, .form-btn, header .article-title, .title-wrapper'
    ));
    
    let activeBricks: Brick[] = [];
    
    // Cyberpunk color palette array
    const palette = ['#00ffcc', '#ff0055', '#ffb300', '#00f0ff', '#bd00ff', '#fdbf5c', '#e2ddd4'];

    uiElements.forEach((el, index) => {
      const element = el as HTMLElement;
      const rect = element.getBoundingClientRect();
      // Skip invisible elements AND elements offscreen (below the fold)
      if (
        rect.width === 0 || 
        rect.height === 0 || 
        rect.top < 0 || 
        rect.top > window.innerHeight
      ) return;

      activeBricks.push({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        id: `brick-${index}`,
        originalElement: element,
        active: true,
        // Assign massive randomized Cyberpunk colors to all structural elements
        color: palette[Math.floor(Math.random() * palette.length)]
      });
      // Hide real elements
      element.style.opacity = '0'; 
      element.style.transition = '0s'; 
    });

    try { soundManager.playHover(); } catch(e){}

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    // Twin-Stick Shooter State
    const player = { x: w / 2, y: h / 2, vx: 0, vy: 0, radius: 15, angle: 0 };
    const keys: { [key: string]: boolean } = { w: false, a: false, s: false, d: false };
    
    interface Laser { x: number, y: number, vx: number, vy: number, life: number }
    let lasers: Laser[] = [];
    
    interface EnemyLaser { x: number, y: number, vx: number, vy: number }
    let enemyLasers: EnemyLaser[] = [];
    
    interface Particle { x: number, y: number, vx: number, vy: number, alpha: number, color: string }
    let particles: Particle[] = [];
    
    let isRunning = true;
    let currentScore = 0;
    let canShoot = true; // Cooldown limit
    let invincibilityTimer = 120; // 2 seconds of spawn protection at 60fps

    // Input Events
    const handleKeyDown = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { keys[e.key.toLowerCase()] = false; };
    
    const handleMouseMove = (e: MouseEvent) => {
      player.angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    };

    const handleMouseDown = (_e: MouseEvent) => {
      // Rate-limited laser firing to prevent infinite spamming
      if(!canShoot) return;
      canShoot = false;
      setTimeout(() => canShoot = true, 150); // 150ms cooldown
      
      const laserSpeed = 20;
      lasers.push({
        x: player.x + Math.cos(player.angle) * player.radius,
        y: player.y + Math.sin(player.angle) * player.radius,
        vx: Math.cos(player.angle) * laserSpeed,
        vy: Math.sin(player.angle) * laserSpeed,
        life: 80 
      });
      try { soundManager.playClick(); } catch(err){}
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);

    // Main Engine
    const update = () => {
      if (!isRunning) return;

      if (invincibilityTimer > 0) invincibilityTimer--;

      // WASD Movement Physics (Friction and Acceleration)
      const accel = 1.2;
      const friction = 0.92;
      
      if (keys.w) player.vy -= accel;
      if (keys.s) player.vy += accel;
      if (keys.a) player.vx -= accel;
      if (keys.d) player.vx += accel;

      player.vx *= friction;
      player.vy *= friction;
      player.x += player.vx;
      player.y += player.vy;

      // Screen Wrapping Matrix
      if (player.x < 0) player.x = w;
      if (player.x > w) player.x = 0;
      if (player.y < 0) player.y = h;
      if (player.y > h) player.y = 0;
      
      const aliveBricks = activeBricks.filter(b => b.active);

      // AI ENEMY LOGIC: The Website Shoots Back!
      if (Math.random() < 0.04 && aliveBricks.length > 0) { // 4% chance per frame to fire
        const shooter = aliveBricks[Math.floor(Math.random() * aliveBricks.length)];
        const targetX = shooter.x + shooter.width / 2;
        const targetY = shooter.y + shooter.height / 2;
        
        // Ensure enemy doesn't shoot from completely off-screen or totally invisible area
        if (targetY > 0 && targetY < h) {
          const angle = Math.atan2(player.y - targetY, player.x - targetX);
          enemyLasers.push({
            x: targetX,
            y: targetY,
            vx: Math.cos(angle) * 7.5,
            vy: Math.sin(angle) * 7.5
          });
        }
      }

      // Update Player Lasers
      lasers.forEach(laser => {
        laser.x += laser.vx;
        laser.y += laser.vy;
        laser.life--;
      });
      lasers = lasers.filter(l => l.life > 0);
      
      // Update Enemy Lasers & Check Player Death
      enemyLasers.forEach((laser, index) => {
        laser.x += laser.vx;
        laser.y += laser.vy;
        
        // Circular hitbox collision with player ship (Only if NOT invincible)
        if (invincibilityTimer <= 0) {
          const dist = Math.hypot(laser.x - player.x, laser.y - player.y);
          if (dist < player.radius * 1.2) {
              // Player Assassinated
              isRunning = false;
              setGameOver(true);
          }
        }
        
        // Remove laser if offscreen
        if(laser.x < 0 || laser.x > w || laser.y < 0 || laser.y > h) {
             enemyLasers.splice(index, 1);
        }
      });

      // Laser -> DOM Brick Collision
      lasers.forEach(laser => {
        aliveBricks.forEach(brick => {
          if (laser.life <= 0) return;
          
          if (
            laser.x > brick.x && laser.x < brick.x + brick.width &&
            laser.y > brick.y && laser.y < brick.y + brick.height
          ) {
            laser.life = 0; // Destroy laser
            brick.active = false; // Destroy DOM element
            currentScore += 100;
            setScore(currentScore);
            
            // Spawn Massive Fireworks
            for (let i = 0; i < 30; i++) {
              particles.push({
                x: laser.x, 
                y: laser.y,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                alpha: 1,
                color: brick.color
              });
            }
            try { soundManager.playHover(); } catch(err){}
          }
        });
      });

      // Particle Decay
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
      });
      particles = particles.filter(p => p.alpha > 0);

      // Check Win Condition
      if (activeBricks.length > 0 && activeBricks.every(b => !b.active)) {
        isRunning = false;
        setWon(true);
      } else if (activeBricks.length === 0) {
        isRunning = false;
        setWon(true);
      }
    };

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, w, h);

      // Draw DOM UI Blocks securely
      activeBricks.forEach(brick => {
        if (!brick.active) return;
        ctx.fillStyle = brick.color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        
        ctx.strokeStyle = brick.color;
        ctx.globalAlpha = 0.8;
        ctx.lineWidth = 1;
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
        ctx.globalAlpha = 1.0;
      });

      // Draw Lasers
      lasers.forEach(laser => {
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x - laser.vx, laser.y - laser.vy); // draw tail based on velocity
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ffcc';
        ctx.stroke();
        ctx.closePath();
      });
      ctx.shadowBlur = 0;

      // Draw Enemy Lasers
      enemyLasers.forEach(laser => {
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x - laser.vx, laser.y - laser.vy); 
        ctx.strokeStyle = '#ff0055';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0055';
        ctx.stroke();
        ctx.closePath();
      });
      ctx.shadowBlur = 0;

      // Draw Particle Explosions
      particles.forEach(p => {
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.random() * 5 + 1, 0, Math.PI * 2); 
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // Draw Player Ship (Geometric Triangle)
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);

      if (invincibilityTimer > 0) {
        ctx.globalAlpha = Math.abs(Math.sin(invincibilityTimer * 0.2));
      }
      
      ctx.beginPath();
      // Spaceship pointing right (0 degrees)
      ctx.moveTo(player.radius, 0); // Nose
      ctx.lineTo(-player.radius, player.radius * 0.8); // Bottom wing
      ctx.lineTo(-player.radius * 0.5, 0); // Engine indent
      ctx.lineTo(-player.radius, -player.radius * 0.8); // Top wing
      ctx.closePath();
      
      ctx.fillStyle = '#00ffcc';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
      
      // Draw engine thrust glow
      if (keys.w || keys.a || keys.s || keys.d) {
        ctx.beginPath();
        ctx.moveTo(-player.radius * 0.5, 0);
        ctx.lineTo(-player.radius * 1.5 - Math.random() * 10, 0); // Flickering flame
        ctx.strokeStyle = '#ff0055';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffb300';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.closePath();
      }
      ctx.restore();
    };

    const loop = () => {
      if (!isRunning) return;
      update();
      draw();
      requestAnimationFrame(loop);
    };
    loop();

    return () => {
      isRunning = false;
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      
      // Restore the beautiful UI
      uiElements.forEach(el => {
        const element = el as HTMLElement;
        element.style.opacity = '1';
        element.style.transition = 'opacity 0.6s ease';
      });
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: 'fixed', inset: 0, zIndex: 999998, background: 'rgba(5, 5, 8, 0.85)', backdropFilter: 'blur(5px)' }}
      >
        <canvas ref={canvasRef} style={{ display: 'block', cursor: 'crosshair' }} />
        
        {/* HUD UI overlay */}
        <div style={{ position: 'absolute', top: '20px', left: '30px', color: '#00ffcc', fontFamily: 'monospace', fontSize: '28px', fontWeight: 'bold', textShadow: '0 0 15px #00ffcc' }}>
          SCORE: {score}
        </div>
        
        <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: '#fff', fontFamily: 'monospace', fontSize: '14px', opacity: 0.7 }}>
          <p>CONTROLS:</p>
          <p>[W A S D] Move Ship</p>
          <p>[MOUSE] Aim Weapons</p>
          <p>[CLICK] Fire Plasma Lasers</p>
        </div>

        <div style={{ position: 'absolute', top: '20px', right: '30px', color: '#ff0055', fontFamily: 'monospace', fontSize: '16px', border: '1px solid #ff0055', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', transition: '0.3s' }} 
             onMouseEnter={(e)=>e.currentTarget.style.background='#ff005533'}
             onMouseLeave={(e)=>e.currentTarget.style.background='transparent'}
             onClick={onClose}>
          [ EXIT PROTOCOL ]
        </div>

        {(won || gameOver) && (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0, 20, 10, 0.95)', border: `1px solid ${won ? '#00ffcc' : '#ff0055'}`, padding: '50px', borderRadius: '12px', textAlign: 'center', boxShadow: `0 0 80px ${won ? 'rgba(0, 255, 204, 0.3)' : 'rgba(255, 0, 85, 0.3)'}` }}
          >
            <h2 style={{ fontSize: '3.5rem', color: won ? '#00ffcc' : '#ff0055', marginBottom: '15px', textShadow: `0 0 20px ${won ? '#00ffcc' : '#ff0055'}` }}>
              {won ? 'SYSTEM ANNIHILATED' : 'CRITICAL FAILURE'}
            </h2>
            <p style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '40px', fontFamily: 'monospace' }}>Final Score: {score}</p>
            <button 
              onClick={onClose}
              style={{ background: won ? '#00ffcc22' : '#ff005522', border: `2px solid ${won ? '#00ffcc' : '#ff0055'}`, color: won ? '#00ffcc' : '#ff0055', padding: '15px 40px', fontSize: '1.2rem', borderRadius: '6px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold' }}
            >
              RESTORE UI MAINFRAME
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default BreakoutGame;
