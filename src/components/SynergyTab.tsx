/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, Lock, HelpCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateSynergies } from '../utils/synergy';
import { CARD_TEMPLATES } from '../utils/gameData';
import { cardNames } from '../utils/translations';

interface SynergyTabProps {
  playerCardState: Record<string, { level: number; silverLevel: number }>;
  language?: 'en' | 'ro';
}

export const SynergyTab: React.FC<SynergyTabProps> = ({
  playerCardState,
  language = 'en',
}) => {
  const activeSynergies = calculateSynergies(playerCardState || {});

  // By default, active synergies start expanded, and locked ones start collapsed to minimize mobile vertical scrolling
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    activeSynergies.forEach(syn => {
      initial[syn.id] = syn.isActive;
    });
    return initial;
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Clean fallback helper to extract current language name if global list lacks a key for whatever reason
  const getCleanCardName = (cardId: string, fallbackName: string, lang: string) => {
    const activeLang = (lang === 'ro' ? 'ro' : 'en') as 'en' | 'ro';
    if (cardNames[cardId]?.[activeLang]?.name) {
      return cardNames[cardId][activeLang].name;
    }
    const parts = fallbackName.split('(');
    if (parts.length > 1) {
      if (activeLang === 'ro') {
        return parts[0].trim();
      } else {
        return parts[1].replace(')', '').trim();
      }
    }
    return fallbackName;
  };

  const getNextMilestone = (combinedLevel: number) => {
    const milestones = [10, 25, 50, 100, 150, 200];
    let prevMilestone = 0;
    let nextMilestone = milestones[0];

    for (let i = 0; i < milestones.length; i++) {
      if (combinedLevel < milestones[i]) {
        nextMilestone = milestones[i];
        prevMilestone = i > 0 ? milestones[i - 1] : 0;
        break;
      }
    }

    if (combinedLevel >= 200) {
      return {
        prev: 150,
        next: 200,
        percentage: 100,
        maxed: true
      };
    }

    const range = nextMilestone - prevMilestone;
    const progress = combinedLevel - prevMilestone;
    const percentage = Math.min(100, Math.max(0, (progress / range) * 100));

    return {
      prev: prevMilestone,
      next: nextMilestone,
      percentage,
      maxed: false
    };
  };

  return (
    <div className="flex flex-col gap-4 p-1 pb-24" id="synergy-tab-container">
      {/* Intro Header banner */}
      <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-5 relative overflow-hidden" id="synergies-heading-panel">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Layers className="w-48 h-48 rotate-12 text-emerald-500" />
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-extrabold uppercase text-xs tracking-wider">
          <Sparkles className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '4s' }} />
          <span>{language === 'ro' ? 'ALIANȚE MULTI-ELEMENTALE' : 'MULTI-ELEMENTAL ALLIANCES'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1 leading-tight tracking-tight">
          {language === 'ro' ? 'Sinergiile Relicvelor' : 'Passive Synergy Combinations'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed max-w-2xl font-medium font-sans">
          {language === 'ro'
            ? 'Când aduni și actualizezi relicve complementare din cufere, acestea fuzionează rezonanța lor mistică. Acest lucru deblochează sporuri masive pentru DPS Pasiv, Daune de Click, Aur sau Puncte de Ghildă, care devin mai puternice cu cât este mai mare nivelul combinat al relicvelor din set!'
            : 'When you claim and step up level thresholds of corresponding relics, they sync their magical frequencies. This triggers massive stacking boosts to Passive DPS, Active Click Force, Gold Drops, or reset GP gains, scaling forever based on combined levels!'}
        </p>
      </div>

      {/* Single Column Layout with Collapsible Accordion sections */}
      <div className="flex flex-col gap-4 w-full max-w-3xl mx-auto" id="synergy-tab-accordion-list">
        {activeSynergies.map((syn) => {
          const { template, isActive, combinedLevel, multiplier } = syn;
          const isExpanded = !!expandedIds[syn.id];
          const title = language === 'ro' ? template.nameRo : template.nameEn;
          const description = language === 'ro' ? template.descriptionRo : template.descriptionEn;
          
          // Get matching card objects from CARD_TEMPLATES that correspond to this synergy requirements
          const matchingCards = CARD_TEMPLATES.filter(card => 
            template.requiredTypes.includes(card.type)
          );

          return (
            <div
              key={syn.id}
              className={`flex flex-col border-2 rounded-2xl transition-all relative overflow-hidden ${
                isActive
                  ? 'bg-slate-900/95 border-slate-850 shadow-lg'
                  : 'bg-slate-950/40 border-slate-900/60 opacity-75'
              }`}
              style={
                isActive
                  ? {
                      borderImage: `linear-gradient(135deg, ${template.colorHexStart}, ${template.colorHexEnd}) 1`,
                      borderWidth: '2px',
                      borderStyle: 'solid'
                    }
                  : undefined
              }
              id={`synergy-card-${syn.id}`}
            >
              {/* Dynamic subtle gradient background for active cards */}
              {isActive && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.03] animate-pulse"
                  style={{
                    background: `linear-gradient(135deg, ${template.colorHexStart}, ${template.colorHexEnd})`
                  }}
                />
              )}

              {/* CARD HEADER (Toggle Expand/Collapse) */}
              <button
                type="button"
                onClick={() => toggleExpand(syn.id)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 select-none hover:bg-slate-800/20 active:bg-slate-800/40 transition-colors z-10 font-sans"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm sm:text-base font-black tracking-tight uppercase"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${template.colorHexStart}, ${template.colorHexEnd})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {title}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 shrink-0">
                  {isActive ? (
                    <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-black animate-pulse tracking-wider">
                      {language === 'ro' ? 'Activ' : 'Active'}
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono uppercase bg-slate-950/60 text-slate-500 border border-slate-900 px-2.5 py-0.5 rounded-full font-black flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> {language === 'ro' ? 'Blocat' : 'Locked'}
                    </span>
                  )}
                  <div className="text-slate-400 bg-slate-950/40 p-1 rounded-lg border border-slate-900/60">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </button>

              {/* ALWAYS VISIBLE BOOST PROGRESS BAR */}
              <div className="px-4 sm:px-5 pb-4 z-10 border-t border-slate-950/20 pt-3">
                {(() => {
                  const { prev, next, percentage, maxed } = getNextMilestone(isActive ? combinedLevel : 0);
                  return (
                    <div className="flex flex-col gap-1.5 bg-slate-955/50 p-2.5 sm:p-3 rounded-xl border border-slate-900/30">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400 font-bold flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {language === 'ro' ? 'Prag Boost Sinergie:' : 'Next Level Boost:'}
                        </span>
                        <span className="font-black text-slate-200">
                          {isActive ? (
                            maxed ? (
                              language === 'ro' ? 'MAX (L.200)' : 'MAX (L.200)'
                            ) : (
                              `L.${combinedLevel} ➔ L.${next}`
                            )
                          ) : (
                            language === 'ro' ? 'Inactiv' : 'Inactive'
                          )}
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-950/80 rounded-full h-2.5 overflow-hidden border border-slate-950 p-0.5">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.15)]"
                          style={{
                            width: `${isActive ? percentage : 0}%`,
                            background: isActive 
                              ? `linear-gradient(to right, ${template.colorHexStart}, ${template.colorHexEnd})` 
                              : '#334155'
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                        <span>L.{prev}</span>
                        <span className="font-semibold text-center truncate px-2 text-slate-400">
                          {isActive ? (
                            maxed ? (
                              language === 'ro' 
                                ? 'Rezonanță maximă atinsă!' 
                                : 'Ultimate resonance achieved!'
                            ) : (
                              language === 'ro'
                                ? `Nevoie de încă +${next - combinedLevel} niv. pentru următorul bonus`
                                : `Need +${next - combinedLevel} more levels for next boost`
                            )
                          ) : (
                            language === 'ro' 
                              ? 'Deblochează ambele relicve pentru rezonanță' 
                              : 'Unlock both relics to start resonance'
                          )}
                        </span>
                        <span>L.{next}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* COLLAPSIBLE ACCORDION BODY */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 z-10 border-t border-slate-950/30 pt-4 flex flex-col gap-3.5 animate-fade-in">
                  {/* Description Body */}
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {description}
                  </p>

                  {/* Required Artifacts Grid / Elements list */}
                  <div className="flex flex-col gap-2 bg-slate-950/50 p-3 rounded-xl border border-slate-900/40">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-black tracking-wider block">
                      {language === 'ro' ? 'Piese de Rezonanță Necesare:' : 'Required Resonation Artifacts:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {matchingCards.map((card) => {
                        const cState = playerCardState[card.id];
                        const owns = !!cState;
                        const cName = getCleanCardName(card.id, card.name, language);

                        return (
                          <div
                            key={card.id}
                            className={`flex items-center justify-between p-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                              owns
                                ? 'bg-slate-900 border-slate-800 text-slate-200'
                                : 'bg-slate-950/30 border-transparent text-slate-650 line-through'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 truncate">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${owns ? 'animate-pulse' : ''}`}
                                style={{ backgroundColor: owns ? card.colorHex : '#475569' }}
                              />
                              <span className="truncate">{cName}</span>
                            </div>
                            {owns ? (
                              <span className="text-[10px] text-amber-400 font-extrabold shrink-0 bg-slate-950/80 px-1.5 py-0.5 rounded leading-none border border-slate-800">
                                L.{cState.level}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-600 scale-90 shrink-0 select-none font-sans">
                                ❌ {language === 'ro' ? 'Lipsă' : 'Missing'}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Multipliers and stats */}
                  <div className="border-t border-slate-950/30 pt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex flex-col leading-tight">
                      <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">
                        {language === 'ro' ? 'Sinergie Multiplicator' : 'Synergy Multiplier'}
                      </span>
                      <span className={`text-sm sm:text-base font-black font-mono tracking-tight mt-0.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {isActive 
                          ? `x${multiplier.toFixed(3)} (+${((multiplier - 1) * 100).toFixed(1)}%)`
                          : `x1.000 (0.0% Bonus)`
                        }
                      </span>
                    </div>

                    {isActive && (
                      <div className="bg-slate-950/85 px-3 py-1.5 rounded-xl border border-slate-900 flex items-center justify-between gap-4 text-xs font-mono">
                        <div className="flex flex-col text-right">
                          <span className="text-[8px] text-slate-500 uppercase">{language === 'ro' ? 'Nivel Set:' : 'Set Level:'}</span>
                          <span className="font-extrabold font-mono text-slate-300">L.{combinedLevel}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
