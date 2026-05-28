/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, Trophy, Award, Lock, HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { CardDefinition, CardState } from '../types/game';
import { CARD_TEMPLATES, CHEST_DATA } from '../utils/gameData';
import { Decimal } from '../utils/decimal';
import { translations, cardNames } from '../utils/translations';

interface CardsTabProps {
  gold: Decimal;
  guildPoints: Decimal;
  playerCardState: Record<string, { level: number; silverLevel: number }>;
  buyMultiplier: '1' | '3' | '10' | '99' | 'MAX';
  onBuyMultiplierChange: (multiplier: '1' | '3' | '10' | '99' | 'MAX') => void;
  onUpgradeCard: (cardId: string, levelAmount: number, totalCost: Decimal) => void;
  onSilverUpgrade: (cardId: string) => void;
  onOpenChest: (chestTier: 'common' | 'rare' | 'legendary' | 'guild') => void;
  activeOpenedCard: { card: CardDefinition; isNew: boolean } | null;
  onDismissOpenedCard: () => void;
  language?: 'en' | 'ro';
}

export const CardsTab: React.FC<CardsTabProps> = ({
  gold,
  guildPoints,
  playerCardState,
  buyMultiplier,
  onBuyMultiplierChange,
  onUpgradeCard,
  onSilverUpgrade,
  onOpenChest,
  activeOpenedCard,
  onDismissOpenedCard,
  language = 'en',
}) => {
  const [chestOpeningInProgress, setChestOpeningInProgress] = useState(false);
  const [showDesc, setShowDesc] = useState<Record<string, boolean>>({});
  const [chestStartIndex, setChestStartIndex] = useState(0);
  const t = translations[language];

  // Helper: Calculate upgrade level costs and how many levels can be bought
  const getUpgradeCalculations = (card: CardDefinition) => {
    const cardState = playerCardState[card.id] || { level: 0, silverLevel: 0 };
    const level = cardState.level;
    const baseCost = Decimal.from(card.baseUnlockCost);
    const r = card.costMultiplier;

    // Calculate cost for X levels
    const getCostForNLevels = (startLevel: number, n: number): Decimal => {
      let sum = new Decimal(0, 0);
      for (let i = 0; i < n; i++) {
        // formula: cost = base * r^(startLevel + i)
        const singleCost = baseCost.mul(Math.pow(r, startLevel + i));
        sum = sum.add(singleCost);
      }
      return sum;
    };

    let targetLevels = 1;
    if (buyMultiplier === '3') targetLevels = 3;
    else if (buyMultiplier === '10') targetLevels = 10;
    else if (buyMultiplier === '99') targetLevels = 99;
    else if (buyMultiplier === 'MAX') {
      // Find maximum levels player can buy with current gold
      let count = 0;
      let tempSum = new Decimal(0, 0);
      while (count < 100) {
        const nextCost = baseCost.mul(Math.pow(r, level + count));
        if (tempSum.add(nextCost).lte(gold) && (level + count < 100)) {
          tempSum = tempSum.add(nextCost);
          count++;
        } else {
          break;
        }
      }
      targetLevels = Math.max(count, 1);
    }

    const price = getCostForNLevels(level, targetLevels);
    const canAfford = price.lte(gold) && (level < 100);

    return {
      targetLevels,
      price,
      canAfford,
      level,
      silverLevel: cardState.silverLevel,
    };
  };

  const handleOpenChestAction = (tier: 'common' | 'rare' | 'legendary' | 'guild') => {
    // Check if affordable
    const chest = CHEST_DATA[tier];
    const cost = Decimal.from(chest.cost);
    const affordable = tier === 'guild' ? guildPoints.gte(cost) : gold.gte(cost);

    if (!affordable) return;

    setChestOpeningInProgress(true);
    // Mimics dynamic spinner time
    setTimeout(() => {
      onOpenChest(tier);
      setChestOpeningInProgress(false);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-10" id="cards-tab-panel">
      
      {/* Selector Multipliers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-100 uppercase tracking-tight">{t.BUY_UPGRADES}</span>
          <span className="text-xs text-slate-400 mt-0.5 font-mono">{language === 'ro' ? 'Selectează multiplul pentru upgrade-uri rapide' : 'Select multiplier for manual level boosts'}</span>
        </div>

        <div className="grid grid-cols-5 bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto" id="buy-multipliers-selector">
          {(['1', '3', '10', '99', 'MAX'] as const).map((m) => (
            <button
              key={m}
              onClick={() => onBuyMultiplierChange(m)}
              className={`py-1.5 text-[11px] sm:text-xs font-black font-mono rounded-lg transition-all cursor-pointer text-center ${
                buyMultiplier === m
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10 scale-105'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {m === 'MAX' ? 'MAX' : `x${m}`}
            </button>
          ))}
        </div>
      </div>

      {/* CHESTS STORE */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          {language === 'ro' ? 'SACRISTIA CU CUFERE' : 'CHEST SACRISTY'}
        </h3>

        <div className="flex items-center gap-2 md:gap-4 w-full" id="chests-row-container">
          {/* Left Arrow Button */}
          <button
            onClick={() => setChestStartIndex(prev => Math.max(0, prev - 1))}
            disabled={chestStartIndex === 0}
            className={`p-2 rounded-2xl border border-slate-800 bg-slate-950/80 text-slate-300 active:scale-95 transition cursor-pointer flex items-center justify-center shrink-0 w-10 md:w-12 h-16 md:h-20 ${
              chestStartIndex === 0 ? 'opacity-20 cursor-not-allowed bg-transparent border-slate-900/30 text-slate-600' : 'hover:bg-slate-850 hover:text-white hover:border-slate-700'
            }`}
            title={language === 'ro' ? 'Precedentul' : 'Previous'}
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          {/* 3 Chest Carousel Section */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 flex-1" id="chests-grid">
            {(Object.keys(CHEST_DATA) as Array<keyof typeof CHEST_DATA>).slice(chestStartIndex, chestStartIndex + 3).map((tierKey) => {
              const chest = CHEST_DATA[tierKey];
              const cost = Decimal.from(chest.cost);
              const isGuild = tierKey === 'guild';
              const canAfford = isGuild ? guildPoints.gte(cost) : gold.gte(cost);
              const isDisabled = !canAfford || chestOpeningInProgress;

              return (
                <div
                  key={tierKey}
                  onClick={() => {
                    if (!isDisabled) {
                      handleOpenChestAction(tierKey);
                    }
                  }}
                  className={`bg-gradient-to-b ${chest.color} border-2 rounded-2xl p-2.5 md:p-4 flex flex-col justify-between gap-3 md:gap-4 relative transition-all duration-250 select-none ${
                    !isDisabled
                      ? 'border-amber-400/40 opacity-100 hover:border-amber-400/80 hover:scale-[1.02] active:scale-98 shadow-lg cursor-pointer'
                      : 'border-slate-800 opacity-60 cursor-not-allowed'
                  }`}
                  title={isDisabled && chestOpeningInProgress ? (language === 'ro' ? 'Deschidere în curs...' : 'Opening in progress...') : (language === 'ro' ? 'Apasă pentru a deschide cufărul' : 'Click to open chest')}
                >
                  {/* Visual Chest Design */}
                  <div className="flex flex-col">
                    {/* Chest Logo Outline */}
                    <div className="text-[8px] md:text-[10px] font-mono tracking-wider uppercase opacity-45 font-bold mb-1">
                      {tierKey === 'guild' ? (language === 'ro' ? 'cufăr breaslă' : 'guild chest') : `${tierKey} chest`}
                    </div>
                    <div className="flex items-center justify-between gap-1 md:gap-2">
                      <span className="text-[10px] sm:text-xs md:text-sm font-black text-white leading-tight break-normal truncate">
                        {tierKey === 'common' ? t.CHEST_COMMON_NAME :
                         tierKey === 'rare' ? t.CHEST_RARE_NAME :
                         tierKey === 'legendary' ? t.CHEST_LEGENDARY_NAME :
                         t.CHEST_GUILD_NAME}
                      </span>
                      
                      <div className="relative group/tooltip inline-block pointer-events-auto shrink-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDesc(prev => ({ ...prev, [tierKey]: !prev[tierKey] }));
                          }}
                          className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                          title={language === 'ro' ? 'Informații cufăr' : 'Chest information'}
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Floating hover and tap tooltip */}
                        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 sm:w-52 p-2 sm:p-2.5 bg-slate-950 border border-slate-800 text-[9px] sm:text-[10.5px] font-sans font-medium text-slate-200 rounded-xl shadow-2xl transition duration-150 z-50 leading-relaxed text-center ${
                          showDesc[tierKey] ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto'
                        }`}>
                          {tierKey === 'guild' 
                            ? (language === 'ro' ? 'Garantează cărți de expansiune exclusive de la Thalorion' : 'Guarantees exclusive Expansion Cards from Council') 
                            : (language === 'ro' ? `Conține relicve și aliați din rarități de tip ${tierKey}.` : `Contains relic cards of rarity class ${tierKey}.`)}
                          {/* Little Arrow of Tooltip */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center sm:items-start border-t border-white/10 pt-2 md:pt-3 mt-1">
                    <span className="text-[8px] md:text-[10px] uppercase font-mono text-slate-300/60 font-bold leading-none">{language === 'ro' ? 'Preț' : 'Price'}</span>
                    <span className={`text-[10px] sm:text-xs md:text-sm font-black font-mono mt-1 leading-none ${isGuild ? 'text-fuchsia-400' : 'text-amber-400'}`}>
                      {cost.format(0)} {isGuild ? 'GP' : 'Gold'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={() => setChestStartIndex(prev => Math.min(Object.keys(CHEST_DATA).length - 3, prev + 1))}
            disabled={chestStartIndex >= Object.keys(CHEST_DATA).length - 3}
            className={`p-2 rounded-2xl border border-slate-800 bg-slate-950/80 text-slate-300 active:scale-95 transition cursor-pointer flex items-center justify-center shrink-0 w-10 md:w-12 h-16 md:h-20 ${
              chestStartIndex >= Object.keys(CHEST_DATA).length - 3 ? 'opacity-20 cursor-not-allowed bg-transparent border-slate-900/30 text-slate-600' : 'hover:bg-slate-850 hover:text-white hover:border-slate-700'
            }`}
            title={language === 'ro' ? 'Următorul' : 'Next'}
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* THE CARDS GRID */}
      <div className="flex flex-col gap-3 mt-4" id="deck-section">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" />
          {language === 'ro' ? 'DECK ACTIV ȘI RELICVE' : 'ACTIVE DECK & INVENTORY'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="cards-inventory-grid">
          {CARD_TEMPLATES.map((card) => {
            const isUnlocked = !!playerCardState[card.id];
            const { targetLevels, price, canAfford, level, silverLevel } = getUpgradeCalculations(card);

            // Calculate current compounding stats bonus
            const silverMultiplier = 1 + silverLevel; // Silver adds +100% per level compounding (x2, x3, x4)
            const currentBonusPercentage = level * card.valueMultiplierPerLevel * 100;
            const absoluteBase = card.baseValue;
            
            // Format descriptive bonuses
            let bonusLabel = '';
            if (card.type === 'TAP_DAMAGE') {
              const val = (absoluteBase + level * 5) * silverMultiplier; 
              bonusLabel = `+${val} Tap Dmg`;
            } else if (card.type === 'POISON_DPS' || card.type === 'ICE_CHILL') {
              const val = absoluteBase * (1 + level * card.valueMultiplierPerLevel) * silverMultiplier;
              bonusLabel = `+${val.toFixed(1)} elemental dps`;
            } else if (card.type === 'EARTH_BURST') {
              const val = absoluteBase * (1 + level * card.valueMultiplierPerLevel) * silverMultiplier;
              bonusLabel = `+${val.toFixed(0)} burst every 4s`;
            } else if (card.type === 'GOLD_BOOST') {
              const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
              bonusLabel = `+${val}% Gold Finder`;
            } else if (card.type === 'BOSS_SHRED') {
              const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
              bonusLabel = `+${val}% vs Bosses`;
            } else if (card.type === 'GUILD_BOOST') {
              const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
              bonusLabel = `+${val}% GP Accumulation`;
            }

            return (
              <div
                key={card.id}
                className={`flex flex-col justify-between border rounded-2xl p-4 transition-all relative shadow-sm ${
                  isUnlocked
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-slate-950 border-slate-900 opacity-40 hover:opacity-100 select-none'
                }`}
              >
                {/* Unlocked Card Content */}
                {isUnlocked ? (
                  <>
                    {/* Upper details */}
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                        {/* Dot indicator representing elemental style */}
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full animate-pulse shadow-glow"
                            style={{ backgroundColor: card.colorHex }}
                          />
                          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                            {language === 'ro' 
                              ? (card.chestTier === 'legendary' ? 'Legendar' : (card.chestTier === 'rare' ? 'Rar' : 'Comun')) 
                              : card.chestTier} Tier
                          </span>
                        </div>

                        {/* Levels badges */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-black" id={`card-levels-${card.id}`}>
                          {silverLevel > 0 && (
                            <span className="bg-slate-200 text-slate-950 px-2 py-0.5 rounded border border-white flex items-center gap-0.5">
                              🥈 S.Lv {silverLevel}
                            </span>
                          )}
                          <span className="bg-slate-800 text-slate-100 px-2 py-0.5 rounded border border-slate-705">
                            Lv {level}/100
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col mt-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm sm:text-base font-black text-white break-normal">
                            {cardNames[card.id]?.[language]?.name || card.name}
                          </span>
                          
                          <div className="relative group/tooltip inline-block pointer-events-auto shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDesc(prev => ({ ...prev, [card.id]: !prev[card.id] }));
                              }}
                              className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition cursor-pointer animate-fade-in"
                              title={language === 'ro' ? 'Informații relicvă' : 'Relic information'}
                            >
                              <HelpCircle className="w-3.5 h-3.5" />
                            </button>
                            
                            {/* Hover & click compatible absolute tooltip */}
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-950 border border-slate-800 text-[11px] text-slate-250 rounded-xl shadow-2xl transition duration-150 z-50 leading-relaxed text-center font-sans ${
                              showDesc[card.id] ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto'
                            }`}>
                              {cardNames[card.id]?.[language]?.description || card.description}
                              {/* Arrow down */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Power / Bonus Value readouts */}
                      <div className="bg-slate-950/60 p-2.5 border border-slate-950 rounded-xl mt-2 flex flex-col gap-1 inline-block">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-slate-400 font-bold">{language === 'ro' ? 'Bonus Total:' : 'Total Bonus:'}</span>
                          <span className="text-emerald-400 font-black" id={`card-bonus-${card.id}`}>{bonusLabel}</span>
                        </div>
                        {silverLevel > 0 && (
                          <div className="flex justify-between text-[10px] font-mono text-slate-400 border-t border-slate-900/40 pt-1 mt-1">
                            <span>{language === 'ro' ? 'Multiplicator Argint:' : 'Silver Multiplier:'}</span>
                            <span className="text-blue-300 font-bold">x{(1 + silverLevel).toFixed(0)} {language === 'ro' ? 'Multiplicare Globală' : 'Global Multiplier'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Lower buttons and cost actions */}
                    <div className="flex flex-col gap-2 border-t border-slate-950 pt-3 mt-3">
                      {/* Cost metrics */}
                      {level < 100 ? (
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                              Cost (+{targetLevels} {language === 'ro' ? 'Niv' : 'Lv'})
                            </span>
                            <span className="text-sm font-bold text-amber-500 font-mono mt-0.5">
                              {price.format(1)} {language === 'ro' ? 'Aur' : 'Gold'}
                            </span>
                          </div>

                          <button
                            id={`card-upgrade-btn-${card.id}`}
                            disabled={!canAfford}
                            onClick={() => onUpgradeCard(card.id, targetLevels, price)}
                            className={`px-4.5 py-1.5.5 text-xs font-black rounded-xl transition cursor-pointer active:scale-95 text-center ${
                              canAfford
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                                : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                            }`}
                          >
                            + {targetLevels} {language === 'ro' ? 'Niv' : 'Lv'}
                          </button>
                        </div>
                      ) : (
                        // Level 100: Ready for Silver Upgrade!
                        <div className="flex flex-col gap-2">
                          <div className="text-xs font-mono font-semibold text-center text-blue-300 bg-blue-950/20 border border-blue-900/60 p-2 rounded-xl">
                            {language === 'ro' 
                              ? '⭐ Nivel Maxim! Efectuează upgrade de Argint pentru un multiplicator permanent de +100%.' 
                              : '⭐ Card Maxed! Perform Silver Upgrade for permanent compounding +100% boost.'}
                          </div>
                          <button
                            onClick={() => onSilverUpgrade(card.id)}
                            className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Award className="w-4 h-4 animate-bounce" />
                            {language === 'ro' ? 'Efectuează Prestigiu de Argint (🥈)' : 'Trigger Silver Prestige (🥈)'}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // LOCKED CARD PREVIEW
                  <div className="flex flex-col items-center justify-center py-10 gap-2 font-sans select-none pointer-events-none">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-500">
                      <Lock className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-black text-slate-400 mt-2">{language === 'ro' ? 'Relicvă Blocată' : 'Card Locked'}</span>
                    <span className="text-[11px] text-slate-600 font-mono">
                      {language === 'ro' ? `Deschide cufere de tip ${card.chestTier}` : `Reveal from ${card.chestTier} chests`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EPIC REVEAL MODAL ON CHEST UNPACKING */}
      {activeOpenedCard && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" id="card-unpack-overlay">
          <div className="bg-slate-900 border-2 border-slate-800 max-w-sm w-full rounded-3xl p-6 shadow-2xl animate-scale-up flex flex-col items-center text-center relative overflow-hidden font-sans">
            
            {/* Visual sparkle aura background */}
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            {/* Glowing crown decoration */}
            <div className="w-16 h-16 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 animate-pulse relative z-10 shadow-lg">
              <Sparkles className="w-7 h-7" />
            </div>

            {activeOpenedCard.isNew ? (
              <span className="mt-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-black font-mono text-emerald-400 uppercase tracking-widest leading-none">
                {language === 'ro' ? '✨ RELICVĂ COMPLET NOUĂ! ✨' : '✨ NEW CARD REVEALED! ✨'}
              </span>
            ) : (
              <span className="mt-4 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-black font-mono text-blue-400 uppercase tracking-widest leading-none">
                {language === 'ro' ? '🌟 CONVERTIT ÎN DUPLICAT EXTRA! 🌟' : '🌟 UPGRADED EXTRA DUPLICATE! 🌟'}
              </span>
            )}

            {/* Simulated coloring book vector preview card */}
            <div className="my-6 bg-white p-4.5 rounded-2xl border-4 border-black inline-block transform hover:scale-105 transition-transform">
              <span className="text-xs uppercase font-mono text-slate-950 font-black">
                {cardNames[activeOpenedCard.card.id]?.[language]?.name || activeOpenedCard.card.name}
              </span>
              <div 
                className="w-24 h-24 my-3 rounded-full border-3 border-black flex items-center justify-center mx-auto"
                style={{ backgroundColor: activeOpenedCard.card.colorHex }}
              >
                <Sparkles className="w-10 h-10 text-slate-950" />
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-950 tracking-tight uppercase leading-none block">
                {activeOpenedCard.card.type.replace('_', ' ')}
              </span>
            </div>

            <div className="flex flex-col gap-1 relative z-10">
              <h2 className="text-lg font-black text-white">{cardNames[activeOpenedCard.card.id]?.[language]?.name || activeOpenedCard.card.name}</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mt-1.5 flex flex-col items-center">
                {cardNames[activeOpenedCard.card.id]?.[language]?.description || activeOpenedCard.card.description}
              </p>
            </div>

            <button
              onClick={onDismissOpenedCard}
              className="mt-6 w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm rounded-xl cursor-pointer hover:shadow-lg active:scale-95 transition relative z-10"
              id="confirm-unpack-btn"
            >
              Collect Rewards
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
