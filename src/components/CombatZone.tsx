/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Zap, Skull, Shield } from 'lucide-react';
import { Decimal } from '../utils/decimal';
import { translations } from '../utils/translations';

interface DamageParticle {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'click' | 'poison' | 'earth' | 'ice' | 'gold';
  angle: number;
  life: number; // 0 to 1
  vx: number;
  vy: number;
}

interface CombatZoneProps {
  currentStage: number;
  highestUnlockedStage: number;
  monsterName: string;
  monsterCurrentHP: Decimal;
  monsterMaxHP: Decimal;
  isBossMode: boolean;
  activePoisonDps: Decimal;
  activeIceDps: Decimal;
  activeEarthDps: Decimal;
  earthChargeTracker: number; // 0 to 4 seconds
  soundOn: boolean;
  language?: 'en' | 'ro';
  onMonsterTap: (clientX?: number, clientY?: number) => void;
  onStageChange: (newStage: number) => void;
  onToggleBossMode: () => void;
}

export const CombatZone: React.FC<CombatZoneProps> = ({
  currentStage,
  highestUnlockedStage,
  monsterName,
  monsterCurrentHP,
  monsterMaxHP,
  isBossMode,
  activePoisonDps,
  activeIceDps,
  activeEarthDps,
  earthChargeTracker,
  soundOn,
  language = 'en',
  onMonsterTap,
  onStageChange,
  onToggleBossMode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<DamageParticle[]>([]);
  const tapIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isTapping, setIsTapping] = useState(false);
  const [monsterStyleIndex, setMonsterStyleIndex] = useState(0);
  const t = translations[language];

  // Change monster style based on stage or level
  useEffect(() => {
    setMonsterStyleIndex((currentStage + (isBossMode ? 7 : 0)) % 6);
  }, [currentStage, isBossMode]);

  // Handle Resize of the Canvas overlaying the Monster container
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        canvas.width = width;
        canvas.height = height;
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Frame Animator for floating damage text on Canvas
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      particlesRef.current = particles.filter((p) => {
        p.life -= 0.025; // fade rate
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // subtle gravity

        if (p.life > 0) {
          ctx.save();
          ctx.globalAlpha = p.life;
          
          // Style based on element type
          let fontColor = '#ffffff';
          let strokeColor = '#000000';
          let fontSize = '20px';
          let emoji = '';

          switch (p.type) {
            case 'click':
              fontColor = '#fef08a'; // Yellow-200
              strokeColor = '#ca8a04'; // Yellow-600
              fontSize = 'bold 24px';
              emoji = '💥 ';
              break;
            case 'poison':
              fontColor = '#bfdbfe';
              fontColor = '#bbf7d0'; // Green-200
              strokeColor = '#16a34a'; // Green-600
              fontSize = 'bold 19px';
              emoji = '🧪 ';
              break;
            case 'earth':
              fontColor = '#fef3c7'; // Amber-100
              strokeColor = '#d97706'; // Amber-600
              fontSize = 'black 28px';
              emoji = '⛰️ ';
              break;
            case 'ice':
              fontColor = '#cffafe'; // Cyan-100
              strokeColor = '#0891b2'; // Cyan-600
              fontSize = 'bold 19px';
              emoji = '❄️ ';
              break;
            case 'gold':
              fontColor = '#facc15'; // Yellow-400
              strokeColor = '#78350f'; // Amber-900
              fontSize = 'bold 21px';
              emoji = '🪙 +';
              break;
          }

          ctx.font = `${fontSize} "Space Grotesk", "Inter", sans-serif`;
          ctx.textAlign = 'center';
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = 4;
          ctx.lineJoin = 'round';
          
          const textToDraw = `${emoji}${p.text}`;
          ctx.strokeText(textToDraw, p.x, p.y);
          ctx.fillStyle = fontColor;
          ctx.fillText(textToDraw, p.x, p.y);
          
          ctx.restore();
          return true;
        }
        return false;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Expose triggers to push damage numbers to Canvas
  const spawnDamageParticle = (text: string, x: number, y: number, type: 'click' | 'poison' | 'earth' | 'ice' | 'gold') => {
    const angle = (Math.random() * 40 - 20) * (Math.PI / 180);
    const speed = 2.5 + Math.random() * 2;
    particlesRef.current.push({
      id: Math.random().toString(),
      x,
      y,
      text,
      type,
      angle,
      life: 1.0,
      vx: Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
      vy: -Math.cos(angle) * speed - 1,
    });
  };

  // Register Click/Tap Attack Handler
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Trigger state damage inside App component
    onMonsterTap(e.clientX, e.clientY);

    // Audio hit effect if enabled
    if (soundOn) {
      playHitSound();
    }

    // Spawn damage standard visual
    spawnDamageParticle(
      `Tap!`, 
      x, 
      y, 
      'click'
    );
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    onMonsterTap(touch.clientX, touch.clientY);

    if (soundOn) playHitSound();
    spawnDamageParticle('Tap!', x, y, 'click');

    // Continuous tap-and-hold accelerator auto-clicks (excellent UX / PWA friendly)
    if (tapIntervalRef.current) clearInterval(tapIntervalRef.current);
    setIsTapping(true);
    tapIntervalRef.current = setInterval(() => {
      // Choose random center coordinates
      const cx = rect.width / 2 + (Math.random() * 80 - 40);
      const cy = rect.height / 2 + (Math.random() * 80 - 40);
      onMonsterTap();
      if (soundOn && Math.random() > 0.5) playHitSound();
      spawnDamageParticle('Tap!', cx, cy, 'click');
    }, 200); // 5 clicks per second automatic on held trigger
  };

  const handleTouchEnd = () => {
    if (tapIntervalRef.current) {
      clearInterval(tapIntervalRef.current);
      tapIntervalRef.current = null;
    }
    setIsTapping(false);
  };

  // Listen external ticks from parent to spawn passive elemental dps indicators
  useEffect(() => {
    const emitPassiveEffects = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 + (Math.random() * 120 - 60);
      const y = rect.height * 0.4 + (Math.random() * 80 - 40);

      // Emit indicators for active ticks
      if (activePoisonDps.gt(0) && Math.random() < 0.25) {
        spawnDamageParticle(`${activePoisonDps.format(0)}`, x, y, 'poison');
      }
      if (activeIceDps.gt(0) && Math.random() < 0.25) {
        spawnDamageParticle(`${activeIceDps.format(0)}`, x, y, 'ice');
      }
      if (activeEarthDps.gt(0) && earthChargeTracker >= 3.8) {
        // Earthquake burst! Spawns massive centered explosionparticle
        spawnDamageParticle(`${activeEarthDps.format(0)} EARTHQUAKE`, rect.width / 2, rect.height * 0.3, 'earth');
      }
    };

    // Listen with small intervals
    const interval = setInterval(emitPassiveEffects, 800);
    return () => clearInterval(interval);
  }, [activePoisonDps, activeIceDps, activeEarthDps, earthChargeTracker]);

  // Quick sound generator synthesizers (so we have actual real high quality sound without assets!)
  const playHitSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = 'triangle';
      // Retro retro-grade sound
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // Audio permission or contexts issues ignored
    }
  };

  // SVGs designed as perfectly line-art "Bold & Easy" vectors (cute, high-contrast, zero shading)
  const renderLineArtMonsterSVG = () => {
    // 6 unique cute coloring book templates
    switch (monsterStyleIndex) {
      case 0: // Blobby happy jelly
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.05)]">
            {/* White paintable background, very thick chunky black borders */}
            <path
              d="M 50 15 C 20 15, 12 40, 12 70 C 12 85, 25 90, 50 90 C 75 90, 88 85, 88 70 C 88 40, 80 15, 50 15"
              fill="white"
              stroke="black"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Happy blushing cheeks indicator (just outlined circles!) */}
            <circle cx="28" cy="62" r="4" fill="none" stroke="black" strokeWidth="2" />
            <circle cx="72" cy="62" r="4" fill="none" stroke="black" strokeWidth="2" />
            
            {/* Very cute chunky happy eyes */}
            <circle cx="35" cy="50" r="7" fill="black" stroke="black" strokeWidth="1" />
            <circle cx="33" cy="48" r="2.5" fill="white" /> {/* eye shine */}
            <circle cx="65" cy="50" r="7" fill="black" stroke="black" strokeWidth="1" />
            <circle cx="63" cy="48" r="2.5" fill="white" /> {/* eye shine */}
            
            {/* Cute continuous curve happy smile */}
            <path
              d="M 42 62 Q 50 72, 58 62"
              fill="white"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Tiny cute head horn */}
            <path d="M 50 15 L 47 6 L 50 2 L 53 6 Z" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" />
          </svg>
        );
      case 1: // Cute Horned Cyclops or Monster-Egg
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.05)]">
            <rect
              x="18"
              y="20"
              width="64"
              height="66"
              rx="25"
              fill="white"
              stroke="black"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Cute horns */}
            <path d="M 25 22 Q 13 8, 14 2" fill="white" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 75 22 Q 87 8, 86 2" fill="white" stroke="black" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Big single cute friendly cyclops eye */}
            <circle cx="50" cy="45" r="14" fill="white" stroke="black" strokeWidth="5" />
            <circle cx="50" cy="45" r="7" fill="black" />
            <circle cx="47" cy="42" r="2.5" fill="white" />
            
            {/* Massive joyful happy teeth smile */}
            <path
              d="M 36 68 Q 50 82, 64 68 Z"
              fill="white"
              stroke="black"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 2: // The Starry Sprite
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.05)]">
            {/* Cute star outline */}
            <path
              d="M 50 8 L 62 36 L 92 36 L 68 54 L 78 84 L 50 66 L 22 84 L 32 54 L 8 36 L 38 36 Z"
              fill="white"
              stroke="black"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Super happy eyes */}
            <path d="M 33 44 Q 40 38, 43 45" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <path d="M 57 44 Q 60 38, 67 45" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            
            {/* Wide happy blushing smile */}
            <path
              d="M 44 54 Q 50 62, 56 54"
              fill="none"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        );
      case 3: // Sprout Plant-Cap Mascot
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.05)]">
            {/* Body */}
            <path
              d="M 50 22 C 30 22, 18 35, 18 64 C 18 80, 28 85, 50 85 C 72 85, 82 80, 82 64 C 82 35, 70 22, 50 22"
              fill="white"
              stroke="black"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Leaves growing on top */}
            <path d="M 50 22 Q 35 12, 36 3" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 50 22 Q 65 12, 64 3" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" />
            
            {/* Happy round eyes with cute eyelashes */}
            <circle cx="36" cy="50" r="5" fill="black" />
            <circle cx="64" cy="50" r="5" fill="black" />
            {/* Cute smiley open mouth with sticking tongue line */}
            <path
              d="M 43 62 C 43 74, 57 74, 57 62"
              fill="white"
              stroke="black"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="43" y1="62" x2="57" y2="62" stroke="black" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );
      case 4: // Floating Ghost Sprite
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.05)]">
            {/* Ghost body with wave tentacles on bottom */}
            <path
              d="M 50 15 C 24 15, 20 32, 20 60 Q 20 85, 30 80 Q 40 75, 50 81 Q 60 75, 70 80 Q 80 85, 80 60 C 80 32, 76 15, 50 15 Z"
              fill="white"
              stroke="black"
              strokeWidth="5"
              strokeLinejoin="round"
            />
            {/* Wink and smile */}
            <path d="M 30 46 Q 36 40, 42 46" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <circle cx="64" cy="46" r="5" fill="black" />
            
            {/* Round open gasping mouth of pure joy */}
            <circle cx="49" cy="58" r="6" fill="white" stroke="black" strokeWidth="4" />
          </svg>
        );
      default: // Cute winged kitty blob
        return (
          <svg viewBox="0 0 100 100" className="w-24 h-24 sm:w-28 sm:h-28 filter drop-shadow-[0_8px_16px_rgba(255,255,255,0.05)]">
            <path d="M 12 50 C 4 36, 12 28, 20 42" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" /> {/* Left wing */}
            <path d="M 88 50 C 96 36, 88 28, 80 42" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" /> {/* Right wing */}
            <circle cx="50" cy="52" r="32" fill="white" stroke="black" strokeWidth="5" />
            {/* Cute cat ears */}
            <path d="M 23 34 L 14 12 L 36 24" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" />
            <path d="M 77 34 L 86 12 L 64 24" fill="white" stroke="black" strokeWidth="4" strokeLinejoin="round" />
            
            {/* Smiling closed eye arcs */}
            <path d="M 32 46 Q 38 52, 42 46" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            <path d="M 58 46 Q 62 52, 68 46" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            
            {/* Tiny happy cat nose mouth :3 */}
            <path d="M 46 56 Q 50 59, 54 56" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
    }
  };

  // Convert HP to readable format
  const hpPercent = parseFloat(monsterCurrentHP.div(monsterMaxHP).mul(100).format(2));
  const hpString = `${monsterCurrentHP.format(2)} / ${monsterMaxHP.format(2)}`;

  // Earth charge visual indicator
  const earthSpikePercent = Math.min((earthChargeTracker / 4) * 100, 100);

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 select-none" id="combat-viewport-panel">
      {/* Stage Select Buttons */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
        <button
          id="stage-prev-btn"
          onClick={() => currentStage > 1 && onStageChange(currentStage - 1)}
          disabled={currentStage <= 1}
          className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4.5 h-4.5" />
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold leading-none flex items-center gap-1">
            {isBossMode ? <Skull className="w-3.5 h-3.5 text-red-500 animate-pulse" /> : <Zap className="w-3.5 h-3.5 text-emerald-400" />}
            {isBossMode ? t.CONFRUNTAREA_UMBREI : t.CREATURE_DUNGEON}
          </span>
          <span className="text-sm font-black text-slate-100 font-sans mt-0.5">
            {language === 'ro' ? `Stagiul ${currentStage}` : `Stage ${currentStage}`}
          </span>
        </div>

        <button
          id="stage-next-btn"
          onClick={() => currentStage < highestUnlockedStage && onStageChange(currentStage + 1)}
          disabled={currentStage >= highestUnlockedStage}
          className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Main Vector Card Viewport with HTML5 Canvas overlaid */}
      <div 
        ref={containerRef}
        className="relative w-full h-[180px] sm:h-[220px] bg-slate-950/80 border border-cyan-500/20 rounded-xl flex items-center justify-center overflow-hidden cursor-crosshair group flex-col"
        id="combat-target-container"
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22d3ee 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        {/* HTML5 Canvas overlays the card to capture coordinates and float labels */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 z-30 pointer-events-none" 
        />

        {/* Outer colouring book frame - looks premium and themed */}
        <div className="absolute top-2.5 left-2.5 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-[9px] font-mono font-bold text-slate-400 pointer-events-none uppercase z-20">
          {language === 'ro' ? `Schiță Ilustrată #0` : `Bold & Easy Art #0`}{monsterStyleIndex + 1}
        </div>

        {/* Elegant coloring book prompt */}
        <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-slate-650 uppercase pointer-events-none animate-pulse">
          {isTapping 
            ? (language === 'ro' ? '🔒 Auto-Clicking...' : '🔒 Auto-Clicking...') 
            : (language === 'ro' ? '👆 ATINGE PENTRU COLORARE!' : '👆 TAP TO COLOR / SHRED')}
        </div>

        {/* Dynamic Vector Creature - Pure white box with clean lines */}
        <div className="transform group-active:scale-95 group-hover:scale-102 transition-transform duration-100 ease-out z-10 select-none pointer-events-none flex items-center justify-center bg-white p-2 rounded-xl border-2 border-black border-dashed">
          {renderLineArtMonsterSVG()}
        </div>
      </div>

      {/* Monster HP bar & Elements debuffs log */}
      <div className="w-full flex flex-col gap-1.5" id="hp-indicator-box">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-350 font-bold truncate max-w-[160px]" id="creature-name">{monsterName}</span>
          <span className="text-red-400 font-bold">{hpString}</span>
        </div>

        {/* Custom HP Bar with glow transitions */}
        <div className="w-full h-2.5 bg-slate-950 rounded border border-slate-800 p-0.5 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r transition-all duration-100 rounded-sm ${
              isBossMode 
                ? 'from-red-600 via-orange-500 to-amber-400 shadow-[0_0_10px_rgba(239,68,68,0.4)]' 
                : 'from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${Math.max(hpPercent, 0)}%` }}
          />
        </div>

        {/* Elements active timing status */}
        <div className="grid grid-cols-3 gap-1.5 mt-1 pt-1 border-t border-slate-800/60 text-[9px] font-mono leading-tight">
          {/* Poison */}
          <div className="flex flex-col bg-slate-850 p-1 sm:p-1.5 rounded border border-slate-800/80 text-center">
            <span className="text-emerald-400 font-bold uppercase tracking-tighter">🧪 {language === 'ro' ? 'OTRAVĂ' : 'POISON'}</span>
            <span className="text-slate-300 font-black mt-0.5">{activePoisonDps.gt(0) ? `${activePoisonDps.format(0)}/s` : '—'}</span>
          </div>

          {/* Ice */}
          <div className="flex flex-col bg-slate-850 p-1 sm:p-1.5 rounded border border-slate-800/80 text-center">
            <span className="text-cyan-400 font-bold uppercase tracking-tighter">❄️ {language === 'ro' ? 'ÎNGHEȚ' : 'CHILL'}</span>
            <span className="text-slate-300 font-black mt-0.5">{activeIceDps.gt(0) ? `${activeIceDps.format(0)}/s` : '—'}</span>
          </div>

          {/* Earth Grid */}
          <div className="flex flex-col bg-slate-850 p-1 sm:p-1.5 rounded border border-slate-800/80 text-center relative overflow-hidden">
            <span className="text-amber-500 font-bold uppercase tracking-tighter">⛰️ {language === 'ro' ? 'SEISMIC' : 'SEISMIC'}</span>
            <div className="w-full h-1 bg-slate-900 rounded mt-1 overflow-hidden" title="Seismic Spike timing indicator">
              <div 
                className="h-full bg-amber-500 shadow-glow" 
                style={{ width: `${earthSpikePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
