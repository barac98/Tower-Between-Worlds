/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Shield, Swords, Coins, Sparkles, AlertTriangle, Key, HelpCircle } from 'lucide-react';
import { GuildType, GuildPerk } from '../types/game';
import { Decimal } from '../utils/decimal';
import { translations, perkNames } from '../utils/translations';

interface GuildTabProps {
  currentStage: number;
  highestStageReached: number;
  guildPoints: Decimal;
  activeGuild: GuildType;
  guildLevels: {
    WARRIOR: number;
    MERCHANT: number;
    MAGIC: number;
  };
  perks: {
    ironGrip: number;
    midasTouch: number;
    portalScroll: number;
    masterBuilder: number;
  };
  onBuyPerk: (perkId: string, costGP: number) => void;
  onPrestige: (selectedGuild: GuildType, pointsEarned: number) => void;
  language?: 'en' | 'ro';
}

export const GuildTab: React.FC<GuildTabProps> = ({
  currentStage,
  highestStageReached,
  guildPoints,
  activeGuild,
  guildLevels,
  perks,
  onBuyPerk,
  onPrestige,
  language = 'en',
}) => {
  const [selectedPrestigeGuild, setSelectedPrestigeGuild] = useState<GuildType>('WARRIOR');
  const [showDesc, setShowDesc] = useState<Record<string, boolean>>({});
  const t = translations[language];

  const IS_PRESTIGE_LOCKED = highestStageReached < 50;

  // Formula: GP = floor((HighestStageReach - 45) / 5)
  const potentialGuildPoints = Math.max(0, Math.floor((highestStageReached - 45) / 5));

  // Perks configurations & pricing
  const perkList = [
    {
      id: 'ironGrip',
      name: language === 'ro' ? "Amuleta lui Maelis" : "Amuleta lui Maelis (Maelis's Amulet)",
      description: language === 'ro' ? "Prețiosul medalion cu cristal verde lăsat de Maelis. Canalizează rezoluția interioară a lui Solmour. Crește puterea de click cu +15 per nivel plat." : "The golden medallion with a green crystal left by Maelis. Channels Solmour's inner warm resolve. Increases Click Power by +15 flat per level.",
      level: perks.ironGrip,
      maxLevel: 25,
      getCost: (lv: number) => Math.floor(2 * Math.pow(1.35, lv)),
    },
    {
      id: 'midasTouch',
      name: language === 'ro' ? "Elixirul lui Thandor" : "Elixirul lui Thandor (Thandor's Elixir)",
      description: language === 'ro' ? "Elixirul alchimic străvechi din perioada exilului Regelui Thandor. Începe fiecare resetare cu rezerve de aur substanțiale: de la +500 la +50K aur." : "The ancient dark elixir that sustains King Thandor's 1000-year reign. Start runs with post-exile gold reserves: +500 to +50K gold per level.",
      level: perks.midasTouch,
      maxLevel: 5,
      getCost: (lv: number) => Math.floor(5 * Math.pow(2.2, lv)),
    },
    {
      id: 'portalScroll',
      name: language === 'ro' ? "Ușa lui Thalorion" : "Ușa lui Malenar (Gate of Thalorion)",
      description: language === 'ro' ? "Portalul dimensional creat de academicianul Malenar din Thalorion. Îți permite începerea aventurii la +10% din nivelul maxim atins în istorie." : "The ancient dimensional portal crafted by Malenar to split worlds. Allows you to start runs at +10% of your highest historical stage level.",
      level: perks.portalScroll,
      maxLevel: 5,
      getCost: (lv: number) => Math.floor(4 * Math.pow(1.6, lv)),
    },
    {
      id: 'masterBuilder',
      name: language === 'ro' ? "Măiestria Forjei Pitice" : "Măiestria Forjei (Dwarf Forge Mastery)",
      description: language === 'ro' ? "Măiestria piticilor Signy și Brundar în turnarea metalelor. Reduce permanent costurile de aur/GP ale relicvelor și cuferelor cu -6% per nivel." : "Signy and Brundar's master level ironworking from the Roakk Mines. Streamlines cards and chests upgrades, decreasing all GP/Gold costs by -6% per level.",
      level: perks.masterBuilder,
      maxLevel: 10,
      getCost: (lv: number) => Math.floor(3 * Math.pow(1.5, lv)),
    }
  ];

  const handlePrestigeTrigger = () => {
    if (potentialGuildPoints <= 0) {
      alert(language === 'ro' ? 'Nu ai puncte de breaslă în așteptare! Avansează dincolo de Stagiul 50 pentru a câștiga.' : 'You have no Guild Points pending! Advance further past Stage 50 to earn points.');
      return;
    }

    const confirmationMsg = language === 'ro' 
      ? `INIȚIEZI SOFT RESETUL (PRESTIGIU):\n\nAcest lucru va reseta stagiul curent la 1 și nivelurile normale ale relicvelor la 0.\nVei colecta +${potentialGuildPoints} GP și vei debloca +1 Rang în ghilda ${selectedPrestigeGuild}!\n\nVrei să continui?`
      : `INITIATING SOFT RESET (PRESTIGE):\n\nThis will soft-reset your current stage to 1 (or portal start level) and card normal levels to 0.\nYou will claim +${potentialGuildPoints} GP and join/gain +1 Rank in the ${selectedPrestigeGuild} Guild!\n\nDo you want to proceed?`;
    
    if (confirm(confirmationMsg)) {
      onPrestige(selectedPrestigeGuild, potentialGuildPoints);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10" id="guild-tab-panel">
      {/* SECTION 1: THE HIGH COUNCIL RESETS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-5 relative overflow-hidden" id="prestige-section">
        <div className="flex flex-col">
          <h2 className="text-base font-black text-slate-100 uppercase tracking-tight flex items-center gap-1.5">
            <Award className="w-5 h-5 text-fuchsia-400" />
            {language === 'ro' ? 'Consiliul de la Thalorion (Prestigiu)' : 'Consiliul de la Thalorion (High Academic Resets)'}
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5 leading-snug font-sans">
            {language === 'ro' ? 'Aliază-te cu academicienii din Thalorion și primește puncte de prestigiu în schimbul unui soft-reset.' : 'Embrace a soft reset to align Solmour with the legendary masters of the Five Great Arts'}
          </p>
        </div>

        {IS_PRESTIGE_LOCKED ? (
          /* MILESTONE LOCK DISPLAY */
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-6 flex flex-col items-center text-center gap-3 relative z-10" id="prestige-locked-alert">
            <div className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-500 bg-slate-950">
              <Key className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-black text-white uppercase tracking-wider">{language === 'ro' ? 'Prestigiu Blocat' : 'Prestige Locked'}</span>
              <span className="text-[11px] font-mono text-slate-500 max-w-xs mt-1">
                {language === 'ro' 
                  ? 'Trebuie să atingi cel puțin **Stagiul 50** în stagiul curent pentru a putea fi primit la Consiliu.' 
                  : 'You must reach at least **Stage 50** in your current run to gain an audience with the Guild Council. Keep pushing!'}
              </span>
            </div>

            {/* Stage tracking bar */}
            <div className="w-full max-w-xs flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{language === 'ro' ? 'Progresul Stagiilor' : 'Stage Progress'}</span>
                <span>{highestStageReached} / 50</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-500" 
                  style={{ width: `${Math.min((highestStageReached / 50) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* PRESTIGE PORTAL SYSTEM ACTIVE */
          <div className="flex flex-col gap-5 bg-slate-950/40 p-4 border border-slate-800/60 rounded-2xl relative z-10" id="prestige-unlocked-panel">
            {/* Status updates */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-900/40 pb-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-mono">{language === 'ro' ? 'RECORDUL RECORDAT AL RUNNELOR:' : 'YOUR HIGHEST STAGE POINT:'}</span>
                <span className="text-xl font-black text-white font-sans mt-0.5">{language === 'ro' ? `Stagiul ${highestStageReached}` : `Stage ${highestStageReached}`}</span>
              </div>

              <div className="bg-fuchsia-950/20 border border-fuchsia-900/40 px-4 py-2 rounded-xl flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-fuchsia-400 animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono font-bold text-slate-350 leading-none">{language === 'ro' ? 'RECOMPENSE PRESTIGIU' : 'PRESTIGE REWARDS'}</span>
                  <span className="text-base font-black text-fuchsia-400 font-mono mt-1 leading-none">
                    +{potentialGuildPoints} {language === 'ro' ? 'Puncte de Ghildă (GP)' : 'Guild Points'}
                  </span>
                </div>
              </div>
            </div>

            {/* Choosing Alliance Alignments */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">{language === 'ro' ? 'Selectează calea de specializare a lui Solmour:' : "Select Solmour's Academic Focus at Thalorion:"}</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Warrior Guild Option */}
                <button
                  type="button"
                  onClick={() => setSelectedPrestigeGuild('WARRIOR')}
                  className={`border-2 rounded-xl p-3 flex flex-col text-left transition duration-200 cursor-pointer ${
                    selectedPrestigeGuild === 'WARRIOR'
                      ? 'bg-red-950/20 border-red-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-705'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-2 truncate">
                      <Swords className="w-4 h-4 text-red-400 shrink-0" />
                      <span className="text-xs sm:text-xs font-black truncate">{t.GUILD_WARRIOR_NAME}</span>
                    </div>
                    
                    <div className="relative group/tooltip inline-block pointer-events-auto shrink-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDesc(prev => ({ ...prev, WARRIOR: !prev.WARRIOR }));
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                        title={language === 'ro' ? 'Detalii ghildă' : 'Guild details'}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      
                      {/* Floating hover and tap compatible tooltip */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-950 border border-slate-800 text-[10.5px] font-sans text-slate-200 rounded-xl shadow-2xl transition duration-150 z-50 leading-relaxed text-center ${
                        showDesc.WARRIOR ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto'
                      }`}>
                        <div className="font-bold text-slate-100 mb-1">{language === 'ro' ? `Rang curent: ${guildLevels.WARRIOR}` : `Current Rank: ${guildLevels.WARRIOR}`}</div>
                        {t.GUILD_WARRIOR_DESC}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Merchant Guild Option */}
                <button
                  type="button"
                  onClick={() => setSelectedPrestigeGuild('MERCHANT')}
                  className={`border-2 rounded-xl p-3 flex flex-col text-left transition duration-200 cursor-pointer ${
                    selectedPrestigeGuild === 'MERCHANT'
                      ? 'bg-amber-950/20 border-amber-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-705'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-2 truncate">
                      <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="text-xs sm:text-xs font-black truncate">{t.GUILD_MERCHANT_NAME}</span>
                    </div>
                    
                    <div className="relative group/tooltip inline-block pointer-events-auto shrink-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDesc(prev => ({ ...prev, MERCHANT: !prev.MERCHANT }));
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                        title={language === 'ro' ? 'Detalii ghildă' : 'Guild details'}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      
                      {/* Floating hover and tap compatible tooltip */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-950 border border-slate-800 text-[10.5px] font-sans text-slate-200 rounded-xl shadow-2xl transition duration-150 z-50 leading-relaxed text-center ${
                        showDesc.MERCHANT ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto'
                      }`}>
                        <div className="font-bold text-slate-100 mb-1">{language === 'ro' ? `Rang curent: ${guildLevels.MERCHANT}` : `Current Rank: ${guildLevels.MERCHANT}`}</div>
                        {t.GUILD_MERCHANT_DESC}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Magic Guild Option */}
                <button
                  type="button"
                  onClick={() => setSelectedPrestigeGuild('MAGIC')}
                  className={`border-2 rounded-xl p-3 flex flex-col text-left transition duration-200 cursor-pointer ${
                    selectedPrestigeGuild === 'MAGIC'
                      ? 'bg-cyan-950/20 border-cyan-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-705'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex items-center gap-2 truncate">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-xs sm:text-xs font-black truncate">{t.GUILD_MAGIC_NAME}</span>
                    </div>
                    
                    <div className="relative group/tooltip inline-block pointer-events-auto shrink-0">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDesc(prev => ({ ...prev, MAGIC: !prev.MAGIC }));
                        }}
                        className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition cursor-pointer"
                        title={language === 'ro' ? 'Detalii ghildă' : 'Guild details'}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      
                      {/* Floating hover and tap compatible tooltip */}
                      <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 bg-slate-950 border border-slate-800 text-[10.5px] font-sans text-slate-200 rounded-xl shadow-2xl transition duration-150 z-50 leading-relaxed text-center ${
                        showDesc.MAGIC ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto'
                      }`}>
                        <div className="font-bold text-slate-100 mb-1">{language === 'ro' ? `Rang curent: ${guildLevels.MAGIC}` : `Current Rank: ${guildLevels.MAGIC}`}</div>
                        {t.GUILD_MAGIC_DESC}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Core reset buttons with warnings */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                id="prestige-reset-btn"
                disabled={potentialGuildPoints <= 0}
                onClick={handlePrestigeTrigger}
                className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl cursor-pointer shadow-lg active:scale-98 transition text-center flex items-center justify-center gap-2 leading-snug"
              >
                <Award className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate max-w-[90%] sm:max-w-none">
                  {language === 'ro' 
                    ? `Prestigiu Soft Reset (+${potentialGuildPoints} GP)` 
                    : `Prestige Soft Reset (+${potentialGuildPoints} GP)`}
                </span>
              </button>
              <div className="flex items-start sm:items-center gap-1.5 text-[10px] font-mono text-slate-500 justify-center leading-tight">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                <span>
                  {language === 'ro' 
                    ? 'Păstrezi GP și upgrade-urile de argint. Aurul și nivelul relicvelor revin la zero.' 
                    : 'Resets normal gold and card levels. Silver upgrades survived!'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: THE PERMANENT GP PERK BOOTY SHOP */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-fuchsia-400" />
          {language === 'ro' ? 'ARHIVA AMULETELOR PERMANENTE GP' : 'PERMANENT GUILD PERK ARCHIVES'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="gp-perks-grid">
          {perkList.map((perk) => {
            const cost = perk.getCost(perk.level);
            const isMaxed = perk.level >= perk.maxLevel;
            const canAfford = !isMaxed && guildPoints.gte(cost);

            let effectLabel = '';
            if (perk.id === 'ironGrip') {
              effectLabel = language === 'ro' ? `+${perk.level * 15} Putere de click la atac` : `+${perk.level * 15} Base Tap Click Power`;
            } else if (perk.id === 'midasTouch') {
              effectLabel = perk.level > 0 
                ? (language === 'ro' ? `Pornești cu ${new Decimal(500 * Math.pow(10, perk.level - 1), 0).format(0)} aur` : `Starts with ${new Decimal(500 * Math.pow(10, perk.level - 1), 0).format(0)} gold`) 
                : (language === 'ro' ? 'Nicio asistență inițială' : 'No post-reset boost');
            } else if (perk.id === 'portalScroll') {
              effectLabel = language === 'ro' ? `Sari peste stagiile mici: +${perk.level * 10}% din record` : `Portal Offset Stage level: +${perk.level * 10}% of highest record`;
            } else if (perk.id === 'masterBuilder') {
              effectLabel = language === 'ro' ? `Economisești -${perk.level * 6}% la upgrades și cufere` : `Saves -${perk.level * 6}% on All Card & Chest transactions`;
            }

            return (
              <div
                key={perk.id}
                className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4 transition duration-150 ${
                  isMaxed ? 'border-fuchsia-500/20' : ''
                }`}
              >
                <div className="flex flex-col gap-1.5 w-full relative">
                  <div className="flex items-center justify-between gap-2 w-full">
                    <span className="text-sm font-black text-white break-normal max-w-[70%]">
                      {perkNames[perk.id]?.[language]?.name || perk.name}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="relative group/tooltip inline-block pointer-events-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => setShowDesc(prev => ({ ...prev, [perk.id]: !prev[perk.id] }))}
                          className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-slate-350 transition cursor-pointer"
                          title={language === 'ro' ? 'Informații amuletă' : 'Perk information'}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Floating hover and tap compatible tooltip */}
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 p-2.5 bg-slate-950 border border-slate-800 text-[11px] text-slate-200 rounded-xl shadow-2xl transition duration-150 z-50 leading-relaxed text-center font-sans ${
                          showDesc[perk.id] ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto'
                        }`}>
                          {perkNames[perk.id]?.[language]?.description || perk.description}
                          {/* Down arrow marker */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-800 animate-fade-in">
                        Lv {perk.level} / {perk.maxLevel}
                      </span>
                    </div>
                  </div>
                  
                  {/* Current Active Strength indicators */}
                  {perk.level > 0 && (
                    <div className="text-[11px] font-mono text-fuchsia-300 bg-fuchsia-950/10 border border-fuchsia-950/30 px-2.5 py-1 rounded-lg w-fit mt-1">
                      {language === 'ro' ? 'Activ: ' : 'Active: '} {effectLabel}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-slate-950 pt-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold leading-none">{language === 'ro' ? 'COST AMULETĂ' : 'PERK COST'}</span>
                    <span className="text-sm font-black font-mono text-fuchsia-400 mt-1 leading-none">
                      {isMaxed ? (language === 'ro' ? 'MAXIMIZAT' : 'MAXED OUT') : `${cost} GP`}
                    </span>
                  </div>

                  <button
                    id={`perk-buy-btn-${perk.id}`}
                    disabled={!canAfford || isMaxed}
                    onClick={() => onBuyPerk(perk.id, cost)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl active:scale-95 transition cursor-pointer ${
                      canAfford
                        ? 'bg-fuchsia-500 hover:bg-fuchsia-400 text-white shadow-md shadow-fuchsia-500/10'
                        : 'bg-slate-950 border border-slate-900 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {isMaxed ? (language === 'ro' ? 'Maxim' : 'Maxed') : (language === 'ro' ? 'Cumpără' : 'Acquire Perk')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
