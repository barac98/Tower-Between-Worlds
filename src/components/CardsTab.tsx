/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trophy, Award, Lock, HelpCircle, ChevronLeft, ChevronRight, Layers, X, ChevronDown, ChevronUp } from 'lucide-react';
import { CardDefinition, CardState } from '../types/game';
import { CARD_TEMPLATES, CHEST_DATA } from '../utils/gameData';
import { Decimal } from '../utils/decimal';
import { translations, cardNames } from '../utils/translations';
import { calculateSynergies } from '../utils/synergy';

// Import beautiful bold & easy illustration backgrounds
import tapCardImg from '../assets/images/tap_card_1780059089622.png';
import poisonCardImg from '../assets/images/poison_card_1780059110798.png';
import earthCardImg from '../assets/images/earth_card_1780059128011.png';
import iceCardImg from '../assets/images/ice_card_1780059142710.png';
import goldCardImg from '../assets/images/gold_card_1780059158821.png';
import guildCardImg from '../assets/images/guild_card_1780059181955.png';

// Import beautiful chest illustration backgrounds
import commonChestImg from '../assets/images/common_chest_1780060888962.png';
import rareChestImg from '../assets/images/fantasy_rare_chest_1780263663339.png';
import legendaryChestImg from '../assets/images/fantasy_legendary_chest_1780263680589.png';
import guildChestImg from '../assets/images/fantasy_guild_chest_1780263696608.png';

export const getCardBgImage = (type: string) => {
  switch (type) {
    case 'TAP_DAMAGE':
      return tapCardImg;
    case 'POISON_DPS':
      return poisonCardImg;
    case 'EARTH_BURST':
      return earthCardImg;
    case 'ICE_CHILL':
      return iceCardImg;
    case 'GOLD_BOOST':
    case 'BOSS_SHRED':
      return goldCardImg;
    case 'GUILD_BOOST':
    default:
      return guildCardImg;
  }
};

export const getChestBgImage = (tierKey: string) => {
  switch (tierKey) {
    case 'common':
      return commonChestImg;
    case 'rare':
      return rareChestImg;
    case 'legendary':
      return legendaryChestImg;
    case 'guild':
    default:
      return guildChestImg;
  }
};

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
  const [selectedDetailCard, setSelectedDetailCard] = useState<CardDefinition | null>(null);
  const [chestsCollapsed, setChestsCollapsed] = useState(false);
  const [selectedRarityTab, setSelectedRarityTab] = useState<'common' | 'rare' | 'legendary' | 'guild'>('common');
  const t = translations[language];

  // Auto-switch rarity tab when opening cards
  useEffect(() => {
    if (activeOpenedCard) {
      setSelectedRarityTab(activeOpenedCard.card.chestTier);
    }
  }, [activeOpenedCard]);

  // Track newly unlocked cards in this session to trigger visual "pop-in" and outer golden "glow" animations
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState<Record<string, boolean>>({});
  const previousCardStateRef = useRef<Record<string, { level: number; silverLevel: number }>>(playerCardState);

  useEffect(() => {
    const newlyUnlockedThisTick: Record<string, boolean> = {};
    let changed = false;

    for (const cardId of Object.keys(playerCardState)) {
      const isNowUnlocked = !!playerCardState[cardId];
      const isPrevUnlocked = !!previousCardStateRef.current[cardId];
      if (isNowUnlocked && !isPrevUnlocked) {
        newlyUnlockedThisTick[cardId] = true;
        changed = true;
      }
    }

    if (changed) {
      setNewlyUnlockedIds(prev => ({ ...prev, ...newlyUnlockedThisTick }));

      // Gradually clear the glowing visual state after 5 seconds
      const timer = setTimeout(() => {
        setNewlyUnlockedIds(prev => {
          const next = { ...prev };
          for (const cardId of Object.keys(newlyUnlockedThisTick)) {
            delete next[cardId];
          }
          return next;
        });
      }, 5000);

      return () => clearTimeout(timer);
    }

    previousCardStateRef.current = playerCardState;
  }, [playerCardState]);

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
    <div className="flex flex-col gap-2.5 w-full pb-6" id="cards-tab-panel">
      
      {/* CHESTS STORE (Collapsible) */}
      <div className="flex flex-col gap-1.5 bg-slate-900/40 p-2 sm:p-2.5 rounded-xl border border-slate-800/50">
        <div 
          onClick={() => setChestsCollapsed(!chestsCollapsed)}
          className="flex items-center justify-between cursor-pointer group select-none py-1"
        >
          <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 group-hover:text-amber-400 transition-colors">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {language === 'ro' ? 'SACRISTIA CU CUFERE' : 'CHEST SACRISTY'}
          </h3>
          <div className="flex items-center gap-1.5 text-[9px] sm:text-xs text-slate-500 font-mono">
            <span className="font-bold">{chestsCollapsed ? (language === 'ro' ? 'EXTINDE' : 'EXPAND') : (language === 'ro' ? 'RESTRÂNGE' : 'COLLAPSE')}</span>
            {chestsCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </div>

        {!chestsCollapsed && (
          <div className="flex items-center gap-1.5 w-full mt-1 animate-fade-in" id="chests-row-container">
            {/* Left Arrow Button */}
            <button
              onClick={() => setChestStartIndex(prev => Math.max(0, prev - 1))}
              disabled={chestStartIndex === 0}
              className={`p-1.5 rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300 active:scale-95 transition cursor-pointer flex items-center justify-center shrink-0 w-8 sm:w-10 h-14 sm:h-16 ${
                chestStartIndex === 0 ? 'opacity-20 cursor-not-allowed bg-transparent border-slate-900/30 text-slate-600' : 'hover:bg-slate-850 hover:text-white hover:border-slate-700'
              }`}
              title={language === 'ro' ? 'Precedentul' : 'Previous'}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* 3 Chest Carousel Section */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5 flex-1" id="chests-grid">
              {(Object.keys(CHEST_DATA) as Array<keyof typeof CHEST_DATA>).slice(chestStartIndex, chestStartIndex + 3).map((tierKey) => {
                const chest = CHEST_DATA[tierKey];
                const cost = Decimal.from(chest.cost);
                const isGuild = tierKey === 'guild';
                const canAfford = isGuild ? guildPoints.gte(cost) : gold.gte(cost);
                const isDisabled = !canAfford || chestOpeningInProgress;
                const chestBg = getChestBgImage(tierKey);

                return (
                  <div
                    key={tierKey}
                    onClick={() => {
                      if (!isDisabled) {
                        handleOpenChestAction(tierKey);
                      }
                    }}
                    className={`bg-gradient-to-b ${chest.color} border border-slate-705 rounded-xl p-1.5 sm:p-2.5 flex flex-col justify-between gap-1.5 sm:gap-2 relative transition-all duration-200 select-none overflow-hidden group ${
                      !isDisabled
                        ? 'border-amber-400/30 opacity-100 hover:border-amber-400 hover:scale-[1.01] active:scale-99 shadow cursor-pointer'
                        : 'border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                    title={isDisabled && chestOpeningInProgress ? (language === 'ro' ? 'Deschidere în curs...' : 'Opening in progress...') : (language === 'ro' ? 'Apasă pentru a deschide cufărul' : 'Click to open chest')}
                  >
                    {/* Background Illustration */}
                    <img
                      src={chestBg}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none select-none transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Visual Chest Design */}
                    <div className="flex flex-col z-10">
                      {/* Chest Logo Outline */}
                      <div className="text-[7.5px] sm:text-[9px] font-mono tracking-wider uppercase opacity-40 font-bold mb-0.5">
                        {tierKey === 'guild' ? (language === 'ro' ? 'breaslă' : 'guild') : tierKey}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] sm:text-xs font-black text-white leading-tight break-normal truncate">
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
                            className="p-0.5 hover:bg-white/10 rounded text-slate-300 hover:text-white transition cursor-pointer"
                            title={language === 'ro' ? 'Informații cufăr' : 'Chest information'}
                          >
                            <HelpCircle className="w-3 h-3" />
                          </button>
                          
                          {/* Floating hover and tap tooltip */}
                          <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 sm:w-48 p-1.5 bg-slate-950 border border-slate-800 text-[8.5px] sm:text-[10px] font-sans font-medium text-slate-200 rounded-lg shadow-xl transition duration-150 z-50 leading-normal text-center ${
                            showDesc[tierKey] ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
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

                    <div className="flex justify-between items-center border-t border-white/5 pt-1 mt-0.5 z-10">
                      <span className="text-[8px] sm:text-[9px] uppercase font-mono text-slate-350/60 font-bold leading-none">{language === 'ro' ? 'Preț' : 'Price'}</span>
                      <span className={`text-[9px] sm:text-xs font-black font-mono leading-none ${isGuild ? 'text-fuchsia-400' : 'text-amber-400'}`}>
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
              className={`p-1.5 rounded-xl border border-slate-800 bg-slate-950/80 text-slate-300 active:scale-95 transition cursor-pointer flex items-center justify-center shrink-0 w-8 sm:w-10 h-14 sm:h-16 ${
                chestStartIndex >= Object.keys(CHEST_DATA).length - 3 ? 'opacity-20 cursor-not-allowed bg-transparent border-slate-900/30 text-slate-600' : 'hover:bg-slate-850 hover:text-white hover:border-slate-700'
              }`}
              title={language === 'ro' ? 'Următorul' : 'Next'}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        )}
      </div>

      {/* THE CARDS GRID */}
      <div className="flex flex-col gap-2 mt-1" id="deck-section">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-1.5 mt-1">
          <h3 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 animate-fade-in">
            <Trophy className="w-4 h-4 text-amber-500" />
            {language === 'ro' ? 'DECK ACTIV ȘI RELICVE' : 'ACTIVE DECK & INVENTORY'}
          </h3>
          
          {/* Extremely compact inline buy multiplier selector! */}
          <div className="flex items-center gap-1.5 bg-slate-950 py-0.5 px-2 rounded-lg border border-slate-800 self-end sm:self-auto" id="buy-multipliers-selector">
            <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">{language === 'ro' ? 'MULTIPLICATOR' : 'MULT'}</span>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {(['1', '3', '10', '99', 'MAX'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onBuyMultiplierChange(m)}
                  className={`px-1.5 py-0.5 text-[8.5px] sm:text-[10px] font-bold font-mono rounded transition-all cursor-pointer text-center ${
                    buyMultiplier === m
                      ? 'bg-amber-500 text-slate-950 font-black scale-102 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {m === 'MAX' ? 'MAX' : `x${m}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rarities Area Sub-Tabs */}
        <div className="flex flex-nowrap items-center gap-1 mb-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 shadow-inner overflow-x-auto whitespace-nowrap scrollbar-none" id="rarity-tabs-container">
          {(['common', 'rare', 'legendary', 'guild'] as const).map((rKey) => {
            const isActive = selectedRarityTab === rKey;
            
            // Calculate progress for each rarity group of cards
            const cardsOfRarity = CARD_TEMPLATES.filter(c => c.chestTier === rKey);
            const unlockedOfRarity = cardsOfRarity.filter(c => !!playerCardState[c.id]).length;
            const totalOfRarity = cardsOfRarity.length;
            const percentage = Math.round((unlockedOfRarity / (totalOfRarity || 1)) * 100);

            // Matching gorgeous UI themes for each cabinet/rarity category
            const themeMap = {
              common: {
                active: 'bg-slate-300 text-slate-950 border-white',
                inactive: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent',
                badge: 'bg-slate-400/20 border-slate-500/20 text-slate-300',
                dot: 'bg-slate-400'
              },
              rare: {
                active: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-md shadow-blue-500/10',
                inactive: 'text-blue-400 hover:text-blue-200 hover:bg-blue-950/20 border-transparent',
                badge: 'bg-blue-500/20 border-blue-500/20 text-blue-300',
                dot: 'bg-blue-400'
              },
              legendary: {
                active: 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-md shadow-amber-500/10 font-bold',
                inactive: 'text-amber-500 hover:text-amber-300 hover:bg-amber-955/20 border-transparent',
                badge: 'bg-amber-500/20 border-amber-500/20 text-amber-300',
                dot: 'bg-amber-450'
              },
              guild: {
                active: 'bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 text-white border-fuchsia-400 shadow-md shadow-fuchsia-500/10 font-bold',
                inactive: 'text-fuchsia-400 hover:text-fuchsia-200 hover:bg-fuchsia-955/20 border-transparent',
                badge: 'bg-fuchsia-500/20 border-fuchsia-500/20 text-fuchsia-300',
                dot: 'bg-fuchsia-400'
              }
            };
            
            const theme = themeMap[rKey];

            return (
              <button
                key={rKey}
                onClick={() => setSelectedRarityTab(rKey)}
                className={`flex-1 min-w-[72px] sm:min-w-[110px] px-2 py-1 sm:py-1.5 text-[9px] sm:text-xs font-black uppercase tracking-wider rounded-lg border transition-all duration-150 cursor-pointer text-center relative ${
                  isActive ? `${theme.active} scale-102 font-black` : `${theme.inactive}`
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-0.5 pointer-events-none">
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${theme.dot} shrink-0 animate-pulse`} />
                    <span>
                      {rKey === 'common' ? (language === 'ro' ? 'Comune' : 'Common') :
                       rKey === 'rare' ? (language === 'ro' ? 'Rare' : 'Rare') :
                       rKey === 'legendary' ? (language === 'ro' ? 'Legendare' : 'Legendary') :
                       (language === 'ro' ? 'Breaslă' : 'Guild')}
                    </span>
                  </div>
                  <span className={`text-[6.5px] sm:text-[8px] font-mono font-bold border rounded px-1 leading-none ${isActive ? 'bg-black/10 border-black/15 text-inherit' : theme.badge}`}>
                    {unlockedOfRarity}/{totalOfRarity}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Scaled and optimized Grid Area focused on single Rarity list */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 pb-4 animate-fade-in" id="cards-inventory-grid">
          {CARD_TEMPLATES.filter((card) => card.chestTier === selectedRarityTab).map((card) => {
            const isUnlocked = !!playerCardState[card.id];
            const { targetLevels, price, canAfford, level, silverLevel } = getUpgradeCalculations(card);

            // Calculate current compounding stats bonus
            const silverMultiplier = 1 + silverLevel;
            const absoluteBase = card.baseValue;
            
            // Format descriptive bonuses
            let bonusLabel = '';
            if (card.type === 'TAP_DAMAGE') {
              const val = (absoluteBase + level * 5) * silverMultiplier; 
              bonusLabel = `+${val} Tap`;
            } else if (card.type === 'POISON_DPS' || card.type === 'ICE_CHILL') {
              const val = absoluteBase * (1 + level * card.valueMultiplierPerLevel) * silverMultiplier;
              bonusLabel = `+${val.toFixed(0)} dps`;
            } else if (card.type === 'EARTH_BURST') {
              const val = absoluteBase * (1 + level * card.valueMultiplierPerLevel) * silverMultiplier;
              bonusLabel = `+${val.toFixed(0)} burst`;
            } else if (card.type === 'GOLD_BOOST') {
              const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
              bonusLabel = `+${val}% Gold`;
            } else if (card.type === 'BOSS_SHRED') {
              const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
              bonusLabel = `+${val}% Boss`;
            } else if (card.type === 'GUILD_BOOST') {
              const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
              bonusLabel = `+${val}% GP`;
            }

            const cardBg = getCardBgImage(card.type);
            const isNewlyUnlocked = !!newlyUnlockedIds[card.id];

            return (
              <div
                key={card.id}
                onClick={() => setSelectedDetailCard(card)}
                className={`flex flex-col justify-between border rounded-xl p-2 sm:p-2.5 pb-2 sm:pb-2.5 transition-all duration-150 relative shadow-md overflow-hidden min-h-[96px] sm:min-h-[114px] md:min-h-[122px] cursor-pointer hover:scale-[1.03] hover:border-slate-400 hover:shadow-lg active:scale-[0.97] ${
                  isNewlyUnlocked
                    ? 'bg-slate-900 border-amber-500 animate-card-pop animate-card-glow z-20'
                    : isUnlocked
                      ? 'bg-slate-900/90 border-slate-800/80 hover:bg-slate-850/90'
                      : 'bg-slate-955/60 border-slate-900/50 opacity-40 hover:opacity-100'
                }`}
              >
                {/* Unlocked Card Content */}
                {isUnlocked ? (
                  <>
                    {/* Background Illustration */}
                    <img
                      src={cardBg}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity pointer-events-none select-none transition-transform duration-500 hover:scale-110"
                    />

                    {/* Upper details */}
                    <div className="flex flex-col gap-1 z-10">
                       <div className="flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
                        {/* Dot indicator representing elemental style + Tooltip */}
                        <div className="flex items-center gap-1 truncate">
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse shadow-glow shrink-0"
                            style={{ backgroundColor: card.colorHex }}
                          />
                          <span className="text-[7.5px] sm:text-[9px] font-mono uppercase tracking-wider text-slate-450 font-black truncate">
                            {language === 'ro' 
                              ? (card.chestTier === 'legendary' ? 'Leg' : (card.chestTier === 'rare' ? 'Rar' : (card.chestTier === 'guild' ? 'Brs' : 'Com'))) 
                              : card.chestTier.substring(0, 3)}
                          </span>

                          <div className="relative group/tooltip inline-block pointer-events-auto shrink-0">
                            <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setShowDesc(prev => ({ ...prev, [card.id]: !prev[card.id] }));
                               }}
                              className="p-1 hover:bg-slate-800 rounded-full text-slate-500 hover:text-white transition cursor-pointer"
                              title={language === 'ro' ? 'Informații relicvă' : 'Relic information'}
                            >
                              <HelpCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                            </button>
                            
                            {/* Hover & click compatible absolute tooltip */}
                            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2.5 bg-slate-950 border border-slate-800 text-[9.5px] text-slate-200 rounded-xl shadow-2xl transition duration-150 z-50 leading-relaxed text-center font-sans ${
                              showDesc[card.id] ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/tooltip:opacity-100 group-hover/tooltip:pointer-events-auto'
                            }`}>
                              <p className="font-bold text-amber-400 mb-0.5">
                                {getCleanCardName(card.id, card.name, language)}
                              </p>
                              {cardNames[card.id]?.[language]?.description || card.description}
                              {/* Arrow down */}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-950" />
                            </div>
                          </div>
                        </div>

                        {/* Levels badges */}
                        <div className="flex items-center gap-1 text-[7.5px] sm:text-[9px] font-mono font-black shrink-0" id={`card-levels-${card.id}`}>
                          {silverLevel > 0 && (
                            <span className="bg-slate-200 text-slate-950 px-1 py-0.2 rounded border border-white leading-none scale-[0.8] origin-right">
                              🥈{silverLevel}
                            </span>
                          )}
                          <span className="bg-slate-800 text-slate-100 px-1 py-0.2 rounded border border-slate-705 leading-none">
                            L{level}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Centered Bonus text overlaid on top of image */}
                    <div className="flex-1 flex flex-col justify-center items-center py-1.5 text-center select-none z-10">
                      <span className="text-[8px] sm:text-[9.5px] font-black font-mono tracking-wide text-emerald-400 bg-slate-950/90 px-1 py-0.5 rounded-lg border border-emerald-500/20 shadow-md text-center leading-none" id={`card-bonus-${card.id}`}>
                        {bonusLabel}
                      </span>
                    </div>

                    {/* Lower buttons and cost actions */}
                    <div className="flex flex-col gap-1 border-t border-slate-950/60 pt-1 mt-1 z-10" onClick={(e) => e.stopPropagation()}>
                       {/* Cost metrics */}
                      {level < 100 ? (
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex flex-col truncate">
                            <span className="text-[7.5px] sm:text-[9px] font-bold text-amber-500 font-mono leading-none truncate col-span-1">
                              {price.format(0)}G
                            </span>
                          </div>

                          <button
                            id={`card-upgrade-btn-${card.id}`}
                            disabled={!canAfford}
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpgradeCard(card.id, targetLevels, price);
                            }}
                            className={`px-1.5 py-0.5 text-[7.5px] sm:text-[9px] font-mono font-black rounded transition cursor-pointer active:scale-95 text-center shrink-0 leading-none ${
                              canAfford
                                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm'
                                : 'bg-slate-955 text-slate-650 border border-slate-905/40 cursor-not-allowed'
                            }`}
                          >
                            +{targetLevels}
                          </button>
                        </div>
                      ) : (
                        // Level 100: Ready for Silver Upgrade!
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSilverUpgrade(card.id);
                            }}
                            className="w-full py-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-[7.5px] sm:text-[9px] rounded-lg shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-1 leading-none animate-pulse"
                          >
                            <Award className="w-2.5 h-2.5" />
                            🥈{language === 'ro' ? 'Argint' : 'Silver'}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  // LOCKED CARD PREVIEW
                  <div className="flex flex-col items-center justify-center py-2 sm:py-3.5 gap-1 font-sans select-none pointer-events-none">
                    <div className="p-1 bg-slate-900/60 border border-slate-800 rounded-full text-slate-500">
                      <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                    <span className="text-[7.5px] sm:text-[9px] font-black text-slate-400 mt-1 uppercase tracking-wider">{language === 'ro' ? 'Blocat' : 'Locked'}</span>
                    <span className="text-[6.5px] sm:text-[8px] text-slate-600 font-mono text-center truncate w-full font-bold">
                      {language === 'ro' ? `${card.chestTier}` : `${card.chestTier}`}
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
            <div className="my-6 bg-white p-4.5 rounded-2xl border-4 border-black inline-block transform hover:scale-105 transition-transform w-[140px]">
              <span className="text-[9px] uppercase font-mono text-slate-950 font-black tracking-tight leading-tight block mb-2 truncate">
                {getCleanCardName(activeOpenedCard.card.id, activeOpenedCard.card.name, language)}
              </span>
              <div 
                className="w-24 h-24 my-2 rounded-2xl border-2 border-slate-950 flex items-center justify-center mx-auto overflow-hidden bg-slate-950/90"
              >
                <img
                  src={getCardBgImage(activeOpenedCard.card.type)}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-950 tracking-tight uppercase leading-none block mt-1">
                {activeOpenedCard.card.type.replace('_', ' ')}
              </span>
            </div>

            <div className="flex flex-col gap-1 relative z-10">
              <h2 className="text-lg font-black text-white">{getCleanCardName(activeOpenedCard.card.id, activeOpenedCard.card.name, language)}</h2>
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

      {/* CARD DETAILS POPUP */}
      {selectedDetailCard && (() => {
        const card = selectedDetailCard;
        const isUnlocked = !!playerCardState[card.id];
        const { targetLevels, price, canAfford, level, silverLevel } = getUpgradeCalculations(card);
        const silverMultiplier = 1 + silverLevel;
        const absoluteBase = card.baseValue;
        
        let detailedBonusText = '';
        if (card.type === 'TAP_DAMAGE') {
          const val = (absoluteBase + level * 5) * silverMultiplier; 
          const nextVal = (absoluteBase + (level + targetLevels) * 5) * silverMultiplier;
          detailedBonusText = language === 'ro' 
            ? `+${val} Forță Click Activ (Crește la +${nextVal} la upgrade)`
            : `+${val} Active Click Damage (Increases to +${nextVal} on upgrade)`;
        } else if (card.type === 'POISON_DPS') {
          const val = absoluteBase * (1 + level * card.valueMultiplierPerLevel) * silverMultiplier;
          const nextVal = absoluteBase * (1 + (level + targetLevels) * card.valueMultiplierPerLevel) * silverMultiplier;
          detailedBonusText = language === 'ro'
            ? `+${val.toFixed(1)} DPS Pasiv Otravă (Crește la +${nextVal.toFixed(1)} dps)`
            : `+${val.toFixed(1)} Passive Poison DPS (Increases to +${nextVal.toFixed(1)} dps)`;
        } else if (card.type === 'ICE_CHILL') {
          const val = absoluteBase * (1 + level * card.valueMultiplierPerLevel) * silverMultiplier;
          const nextVal = absoluteBase * (1 + (level + targetLevels) * card.valueMultiplierPerLevel) * silverMultiplier;
          detailedBonusText = language === 'ro'
            ? `+${val.toFixed(1)} DPS Pasiv Gheață și Încetinire (Crește la +${nextVal.toFixed(1)} dps)`
            : `+${val.toFixed(1)} Passive Ice DPS and Slow (Increases to +${nextVal.toFixed(1)} dps)`;
        } else if (card.type === 'EARTH_BURST') {
          const val = absoluteBase * (1 + level * card.valueMultiplierPerLevel) * silverMultiplier;
          const nextVal = absoluteBase * (1 + (level + targetLevels) * card.valueMultiplierPerLevel) * silverMultiplier;
          detailedBonusText = language === 'ro'
            ? `+${val.toFixed(0)} Lovitură Explozivă la fiecare 4 secunde (Crește la +${nextVal.toFixed(0)})`
            : `+${val.toFixed(0)} Geo-Burst Spike Damage every 4 seconds (Increases to +${nextVal.toFixed(0)})`;
        } else if (card.type === 'GOLD_BOOST') {
          const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
          const nextVal = ((level + targetLevels) * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
          detailedBonusText = language === 'ro'
            ? `+${val}% Multiplicator de Aur (Crește la +${nextVal}%)`
            : `+${val}% Gold Finder Multiplier (Increases to +${nextVal}%)`;
        } else if (card.type === 'BOSS_SHRED') {
          const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
          const nextVal = ((level + targetLevels) * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
          detailedBonusText = language === 'ro'
            ? `+${val}% Daune contra Boșilor de Stagiu (Crește la +${nextVal}%)`
            : `+${val}% Extra Damage against Stage Bosses (Increases to +${nextVal}%)`;
        } else if (card.type === 'GUILD_BOOST') {
          const val = (level * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
          const nextVal = ((level + targetLevels) * card.valueMultiplierPerLevel * 100 * silverMultiplier).toFixed(0);
          detailedBonusText = language === 'ro'
            ? `+${val}% Bonus GP la Soft-Reset (Crește la +${nextVal}%)`
            : `+${val}% GP Gain on Reset (Increases to +${nextVal}%)`;
        }

        const cardBg = getCardBgImage(card.type);
        const name = getCleanCardName(card.id, card.name, language);
        const description = cardNames[card.id]?.[language]?.description || card.description;

        return (
          <div className="fixed inset-0 bg-slate-955/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in" id="card-detail-overlay" onClick={() => setSelectedDetailCard(null)}>
            <div className="bg-slate-900 border-2 border-slate-800 max-w-md w-full rounded-3xl p-6 shadow-2xl animate-scale-up flex flex-col relative overflow-hidden font-sans text-left" onClick={(e) => e.stopPropagation()}>
              
              {/* Radial gradient glow behind the card */}
              <div 
                className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none rounded-full blur-3xl"
                style={{ backgroundColor: card.colorHex }}
              />

              {/* Close Button */}
              <button 
                onClick={() => setSelectedDetailCard(null)}
                className="absolute top-4 right-4 p-1.5 bg-slate-950/80 hover:bg-slate-800 rounded-full border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex gap-4 items-start pb-4 border-b border-slate-800 z-10">
                {/* Big detailed Vector Card Drawing Mockup */}
                <div className="bg-white p-3 rounded-2xl border-4 border-black shrink-0 relative overflow-hidden shadow-md w-24">
                  <div className="w-16 h-16 rounded-xl border-2 border-slate-950 flex items-center justify-center mx-auto overflow-hidden bg-slate-950 relative">
                    <img
                      src={cardBg}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  <div className="text-center mt-2.5">
                    <div className="w-2.5 h-2.5 rounded-full mx-auto shadow-glow anim-pulse" style={{ backgroundColor: card.colorHex }} />
                  </div>
                </div>

                {/* Card Title & Elemental Details */}
                <div className="flex-1 flex flex-col gap-1 pt-1">
                  <span className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider">
                    {language === 'ro' 
                      ? `${card.chestTier === 'legendary' ? 'Legendară' : (card.chestTier === 'rare' ? 'Rară' : 'Comună')} • Relicvă` 
                      : `${card.chestTier} • Relic`}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span 
                      className="px-2 py-0.5 rounded-md text-[9px] font-mono uppercase font-black"
                      style={{ backgroundColor: `${card.colorHex}22`, color: card.colorHex, border: `1px solid ${card.colorHex}44` }}
                    >
                      {card.type.replace('_', ' ')}
                    </span>
                    {isUnlocked ? (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md text-[9px] font-mono uppercase font-black animate-pulse">
                        {language === 'ro' ? 'Deblocat' : 'Unlocked'}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-950 text-slate-500 rounded-md text-[9px] font-mono uppercase font-black flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        {language === 'ro' ? 'Blocat' : 'Locked'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description / Lore */}
              <div className="py-4 flex flex-col gap-1.5 z-10 border-b border-slate-800">
                <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">
                  {language === 'ro' ? 'Istoric și Legende:' : 'History & Lore:'}
                </span>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-semibold">
                  {description}
                </p>
              </div>

              {/* Stats Block */}
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col gap-2.5 mt-4 z-10">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-500 uppercase font-black">{language === 'ro' ? 'Nivel Curent:' : 'Current Level'}</span>
                  {isUnlocked ? (
                    <div className="flex items-center gap-1.5">
                      {silverLevel > 0 && (
                        <span className="bg-slate-200 text-slate-950 px-1.5 py-0.5 rounded border border-white font-black text-[10px] sm:text-xs">
                          🥈 Rank {silverLevel}
                        </span>
                      )}
                      <span className="bg-slate-800 px-2 py-0.5 text-white font-extrabold rounded">
                        L.{level} / 100
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-600 font-extrabold">L.0 ({language === 'ro' ? 'Blocat' : 'Locked'})</span>
                  )}
                </div>

                <div className="flex flex-col gap-1 border-t border-slate-800 pt-2.5">
                  <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
                    {language === 'ro' ? 'Efectul binecuvântat mistic:' : 'Mystic Blessed Effect:'}
                  </span>
                  <span className={`text-xs font-mono font-bold leading-relaxed ${isUnlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {isUnlocked ? detailedBonusText : (language === 'ro' ? 'Relicva este blocată. Deschide saci elementari pentru a o debloca.' : 'Relic is currently locked. Complete battles and open elemental satchels to unlock.')}
                  </span>
                </div>
              </div>

              {/* Action buttons inside interactive popup */}
              <div className="mt-5 pt-1.5 z-10">
                {isUnlocked ? (
                  level < 100 ? (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        onUpgradeCard(card.id, targetLevels, price);
                      }}
                      className={`w-full py-3 rounded-xl font-mono font-black text-xs sm:text-sm active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer ${
                        canAfford
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-bold'
                          : 'bg-slate-955 text-slate-650 border border-slate-905/40 cursor-not-allowed'
                      }`}
                    >
                      <span>
                        {language === 'ro' ? `Îmbunătățește +${targetLevels} Niveluri` : `Upgrade +${targetLevels} Levels`}
                      </span>
                      <span className="bg-slate-950/40 px-2 py-0.5 rounded font-black border border-white/5">
                        {price.format(0)} Gold
                      </span>
                    </button>
                  ) : (
                    /* Ready for silver upgrade! */
                    <button
                      onClick={() => {
                        onSilverUpgrade(card.id);
                      }}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm rounded-xl shadow active:scale-98 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-5 h-5 animate-pulse" />
                      <span>
                        {language === 'ro' ? 'Fuzionează în Upgrade de ARGINT 🥈' : 'Evolve to SILVER Tier 🥈'}
                      </span>
                    </button>
                  )
                ) : (
                  /* Locked state details */
                  <div className="text-center py-2.5 text-xs font-mono text-slate-500 font-bold border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                    {language === 'ro' 
                      ? `Disponibil în: Sac de Cufăr de nivel ${card.chestTier.toUpperCase()}`
                      : `Available randomly from: ${card.chestTier.toUpperCase()} Chest Satchels`
                    }
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
