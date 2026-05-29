/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Coins, Award, HelpCircle, X, ShieldAlert, Sparkles, Trophy, Swords } from 'lucide-react';
import { Decimal } from './utils/decimal';
import { CardDefinition, CardState, GuildType, GameStats, SaveState } from './types/game';
import { CARD_TEMPLATES, CHEST_DATA, MONSTER_PREFIXES, MONSTER_TYPES, MONSTER_BOSSES } from './utils/gameData';
import { Header } from './components/Header';
import { translations } from './utils/translations';
import { CombatZone } from './components/CombatZone';
import { CardsTab } from './components/CardsTab';
import { GuildTab } from './components/GuildTab';
import { StatsTab } from './components/StatsTab';

export default function App() {
  // --- CORE GAME STATE ---
  const [gold, setGold] = useState<Decimal>(new Decimal(10, 0)); // Starts with 10 Gold
  const [guildPoints, setGuildPoints] = useState<Decimal>(new Decimal(0, 0));
  
  // Stages & Progress tracking
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [highestStageReached, setHighestStageReached] = useState<number>(1);
  const [stageProgress, setStageProgress] = useState<number>(0); // 0 to 10 generic kills
  const [isBossUnlocked, setIsBossUnlocked] = useState<boolean>(false);
  const [isBossMode, setIsBossMode] = useState<boolean>(false);

  // Foe properties
  const [monsterName, setMonsterName] = useState<string>('Spawny Slime');
  const [monsterMaxHP, setMonsterMaxHP] = useState<Decimal>(new Decimal(30, 0));
  const [monsterCurrentHP, setMonsterCurrentHP] = useState<Decimal>(new Decimal(30, 0));

  // Guild Ranks (Prestige stats)
  const [activeGuild, setActiveGuild] = useState<GuildType>('NONE');
  const [guildLevels, setGuildLevels] = useState({
    WARRIOR: 0,
    MERCHANT: 0,
    MAGIC: 0,
  });

  // Guild Perks purchases
  const [perks, setPerks] = useState({
    ironGrip: 0,     // Base Click damage plus flat
    midasTouch: 0,   // Cash start boost
    portalScroll: 0, // Portal starting Stage
    masterBuilder: 0 // Card & Chest discount
  });

  // Cards state tracking
  const [playerCardState, setPlayerCardState] = useState<Record<string, { level: number; silverLevel: number }>>({});

  // Achievements / Metrics log
  const [stats, setStats] = useState<GameStats>({
    tapCount: 0,
    monsterKills: 0,
    bossKills: 0,
    totalGoldEarned: '10',
    timesPrestiged: 0,
    playtime: 0,
    highestStageReached: 1
  });

  // Settings & Navigation Options
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);
  const [buyMultiplier, setBuyMultiplier] = useState<'1' | '3' | '10' | '99' | 'MAX'>('1');
  const [activeTab, setActiveTab] = useState<'battle' | 'cards' | 'guild' | 'stats'>('battle');
  const [language, setLanguage] = useState<'en' | 'ro'>('en');
  const t = translations[language];

  const handleToggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'ro' : 'en';
      // Save instantly upon toggling
      setTimeout(() => {
        try {
          const rawSave = localStorage.getItem('dps_idle_save_game_pwa');
          if (rawSave) {
            const decrypted = JSON.parse(atob(rawSave));
            if (decrypted.settings) {
              decrypted.settings.language = next;
              localStorage.setItem('dps_idle_save_game_pwa', btoa(JSON.stringify(decrypted)));
            }
          }
        } catch (e) {}
      }, 50);
      return next;
    });
  };

  // Interactive unpack helpers
  const [activeOpenedCard, setActiveOpenedCard] = useState<{ card: CardDefinition; isNew: boolean } | null>(null);

  // Offline rewards pop-ups
  const [offlineOverlay, setOfflineOverlay] = useState<{ hours: number; mins: number; goldClaimed: Decimal } | null>(null);

  // --- DERIVED POWER CALCULATIONS ---
  // Calculates Discount multiplier from Master Builder perk
  const builderDiscountRate = 1 - (perks.masterBuilder * 0.06); // level 10: -60% cost discount

  // Base Tap power = +1 base + Perks + Card levels
  const getBaseClickPower = (): Decimal => {
    let power = new Decimal(1, 0);
    // Iron Grip perk additions
    power = power.add(perks.ironGrip * 15);

    // Sum levels of Tap Damage Card multipliers
    let cardMultiplier = 1;
    CARD_TEMPLATES.forEach((card) => {
      if (card.type === 'TAP_DAMAGE') {
        const cState = playerCardState[card.id];
        if (cState) {
          const silverLevelCompound = 1 + cState.silverLevel;
          power = power.add(card.baseValue + cState.level * 5).mul(silverLevelCompound);
        }
      }
    });

    // Magic Guild Alignment click boosts
    if (activeGuild === 'MAGIC') {
      const rank = guildLevels.MAGIC;
      // Adds +20% click power per rank
      power = power.mul(1 + rank * 0.20);
    }

    // Warrior Guild general damage multiplier
    if (activeGuild === 'WARRIOR') {
      const rank = guildLevels.WARRIOR;
      power = power.mul(1 + rank * 1.0); // +100% per Rank
    }

    return power;
  };

  // Base passive dps
  const getDpsBreakdown = () => {
    let base = new Decimal(0, 0);
    let poison = new Decimal(0, 0);
    let ice = new Decimal(0, 0);
    let earth = new Decimal(0, 0);

    CARD_TEMPLATES.forEach((card) => {
      const cState = playerCardState[card.id];
      if (!cState) return;

      const silverLevelCompound = 1 + cState.silverLevel;
      const effectiveCardMultiplier = (1 + cState.level * card.valueMultiplierPerLevel) * silverLevelCompound;

      if (card.type === 'POISON_DPS') {
        poison = poison.add(Decimal.from(card.baseValue).mul(effectiveCardMultiplier));
      } else if (card.type === 'ICE_CHILL') {
        ice = ice.add(Decimal.from(card.baseValue).mul(effectiveCardMultiplier));
      } else if (card.type === 'EARTH_BURST') {
        // Earthquake burst damage (fires spikes on timer check every 4s)
        earth = earth.add(Decimal.from(card.baseValue).mul(effectiveCardMultiplier));
      }
    });

    // Apply permanent Guild multipliers
    if (activeGuild === 'WARRIOR') {
      const rank = guildLevels.WARRIOR;
      const warriorMultiplier = 1 + rank * 1.0; // +100% per rank
      base = base.mul(warriorMultiplier);
      poison = poison.mul(warriorMultiplier);
      ice = ice.mul(warriorMultiplier);
      earth = earth.mul(warriorMultiplier);
    }

    if (activeGuild === 'MAGIC') {
      // Magic guild links click frequency loop. Reduces tick rates or enhances element scaling
      const rank = guildLevels.MAGIC;
      const boost = 1 + rank * 0.15; // +15% stronger ticks/scourge
      poison = poison.mul(boost);
      ice = ice.mul(boost);
      earth = earth.mul(boost);
    }

    return { base, poison, ice, earth };
  };

  // Timing multipliers for elements ticking
  const getElementsRates = () => {
    let rateFactor = 1.0;
    if (activeGuild === 'WARRIOR') {
      // Warrior speed boosts passive loop timers by 15%
      rateFactor = 1.15;
    }
    return rateFactor;
  };

  const { base: activeBaseDps, poison: activePoisonDps, ice: activeIceDps, earth: activeEarthDps } = getDpsBreakdown();

  // --- FOE GENERATOR FORMULAS ---
  // Generates randomized name
  const generateRandomMonsterName = (isBoss: boolean) => {
    if (isBoss) {
      return MONSTER_BOSSES[Math.floor(Math.random() * MONSTER_BOSSES.length)];
    }
    const prefix = MONSTER_PREFIXES[Math.floor(Math.random() * MONSTER_PREFIXES.length)];
    const type = MONSTER_TYPES[Math.floor(Math.random() * MONSTER_TYPES.length)];
    return `${prefix} ${type}`;
  };

  // Monster maximum HP calculates: Base HP * HP_multiplier ^ stage
  const getMonsterHPForStage = (stage: number, isBoss: boolean): Decimal => {
    // Stage HP base: 30hp, scaling by 1.5 per Stage
    let baseHP = new Decimal(30, 0);
    const multiplier = Math.pow(1.5, stage - 1);
    let finalHP = baseHP.mul(multiplier);

    // Boss has x5 health
    if (isBoss) {
      finalHP = finalHP.mul(5);
    }

    return finalHP;
  };

  // Spawns a fresh monster
  const spawnMonster = (stage: number, isBossFlag: boolean) => {
    const name = generateRandomMonsterName(isBossFlag);
    const maxHP = getMonsterHPForStage(stage, isBossFlag);
    setMonsterName(name);
    setMonsterMaxHP(maxHP);
    setMonsterCurrentHP(maxHP);
  };

  // When stage is manually or automatically changed
  const handleStageChange = (newStage: number) => {
    if (newStage < 1 || newStage > highestStageReached) return;
    setCurrentStage(newStage);
    setIsBossMode(false);
    setStageProgress(0);
    setIsBossUnlocked(false);
    spawnMonster(newStage, false);
  };

  // Handles manual boss prompt trigger
  const handleTriggerBoss = () => {
    if (!isBossUnlocked) return;
    setIsBossMode(true);
    spawnMonster(currentStage, true);
  };

  // --- GAME TICK LOOPS ---
  const lastTickRef = useRef<number>(Date.now());
  const saveTimerRef = useRef<number>(0);
  const playtimeTimerRef = useRef<number>(0);
  const earthquakeTimerRef = useRef<number>(0);

  // Core Game Ticker effect (Runs every 100ms with delta-time adjustment!)
  useEffect(() => {
    const gameTicker = setInterval(() => {
      const now = Date.now();
      const delta = (now - lastTickRef.current) / 1000; // in seconds
      lastTickRef.current = now;

      // Ensure delta is sane (prevents massive loops if background timers pause)
      const clampedDelta = Math.min(delta, 2.0);

      // Increment timers
      playtimeTimerRef.current += clampedDelta;
      saveTimerRef.current += clampedDelta;
      earthquakeTimerRef.current += clampedDelta;

      // Update Playtime statistic periodically
      if (playtimeTimerRef.current >= 1.0) {
        setStats((prev) => ({
          ...prev,
          playtime: prev.playtime + 1
        }));
        playtimeTimerRef.current = 0;
      }

      // Auto-save every 10 seconds
      if (saveTimerRef.current >= 10.0) {
        saveGameProgress();
        saveTimerRef.current = 0;
      }

      // 1. Calculate Passive element damage
      const rateFactor = getElementsRates();
      const baseTickDamage = activeBaseDps.mul(clampedDelta * rateFactor);
      const poisonTickDamage = activePoisonDps.mul(clampedDelta * rateFactor);
      const iceTickDamage = activeIceDps.mul(clampedDelta * rateFactor);

      let totalTickDamage = baseTickDamage.add(poisonTickDamage).add(iceTickDamage);

      // 2. Earth Seismic Earthquake checks (fire burst spikes every 4.0s)
      if (earthquakeTimerRef.current >= 4.0) {
        if (activeEarthDps.gt(0)) {
          totalTickDamage = totalTickDamage.add(activeEarthDps);
        }
        earthquakeTimerRef.current = 0;
      }

      // 3. Subtract HP from current monster
      if (monsterCurrentHP.gt(0) && totalTickDamage.gt(0)) {
        setMonsterCurrentHP((prevHP) => {
          const nextHP = prevHP.sub(totalTickDamage);
          if (nextHP.lte(0)) {
            // Defeated! Run death trigger sequentially outside state updater
            setTimeout(() => handleMonsterDefeat(), 0);
            return new Decimal(0, 0);
          }
          return nextHP;
        });
      }
    }, 100);

    return () => clearInterval(gameTicker);
  }, [monsterCurrentHP, activeBaseDps, activePoisonDps, activeIceDps, activeEarthDps, currentStage, isBossMode]);

  // Handles active Click damage
  const handleMonsterTap = (clientX?: number, clientY?: number) => {
    if (monsterCurrentHP.lte(0)) return;

    // Increments metrics
    setStats((prev) => ({ ...prev, tapCount: prev.tapCount + 1 }));

    let tapPower = getBaseClickPower();

    // Ice Element synergize: Absolute Zero card increases Click Damage based on active ranks etc.
    // Boss Buster card damage boosts onClick
    if (isBossMode) {
      let bossBonus = 1;
      CARD_TEMPLATES.forEach((card) => {
        if (card.type === 'BOSS_SHRED') {
          const cState = playerCardState[card.id];
          if (cState) {
            bossBonus += cState.level * card.valueMultiplierPerLevel;
          }
        }
      });
      tapPower = tapPower.mul(bossBonus);
    }

    setMonsterCurrentHP((prev) => {
      const next = prev.sub(tapPower);
      if (next.lte(0)) {
        setTimeout(() => handleMonsterDefeat(), 0);
        return new Decimal(0, 0);
      }
      return next;
    });
  };

  // --- MONSTER DEFEAT & REWARD DISPATCHER ---
  const handleMonsterDefeat = () => {
    // 1. Dispatch Gold Drop rewards: Gold = 10 * 1.35 ^ Stage
    let baseDrop = Decimal.from(10).mul(Math.pow(1.35, currentStage - 1));
    
    // Apply Gold Cards Finder modifiers
    let goldMultiplier = 1;
    CARD_TEMPLATES.forEach((card) => {
      if (card.type === 'GOLD_BOOST') {
        const cState = playerCardState[card.id];
        if (cState) {
          const silverLevelCompound = 1 + cState.silverLevel;
          goldMultiplier += cState.level * card.valueMultiplierPerLevel * silverLevelCompound;
        }
      }
    });

    // Apply Merchant Prestige Guild Alignment multiplier (+150% per Merchant Level)
    if (activeGuild === 'MERCHANT') {
      const rank = guildLevels.MERCHANT;
      goldMultiplier += rank * 1.5;
    }

    // Boss drops x4 Gold
    if (isBossMode) {
      baseDrop = baseDrop.mul(4);
    }

    const finalGoldEarned = baseDrop.mul(goldMultiplier);

    // Award gold
    setGold((prev) => prev.add(finalGoldEarned));

    // Log metrics
    setStats((prev) => {
      const addedGold = Decimal.from(prev.totalGoldEarned).add(finalGoldEarned);
      return {
        ...prev,
        monsterKills: isBossMode ? prev.monsterKills : prev.monsterKills + 1,
        bossKills: isBossMode ? prev.bossKills + 1 : prev.bossKills,
        totalGoldEarned: addedGold.toString()
      };
    });

    // AUDIO EFFECT OR DEFEAT SEQUENCE
    // 2. Stage progression check:
    if (isBossMode) {
      // BOSS DEFEATED! UNLOCK NEXT STAGE
      const unlockedNext = currentStage + 1;
      setHighestStageReached((prev) => Math.max(prev, unlockedNext));
      
      setIsBossUnlocked(false);
      setIsBossMode(false);
      setStageProgress(0);

      if (autoAdvance) {
        setCurrentStage(unlockedNext);
        spawnMonster(unlockedNext, false);
      } else {
        spawnMonster(currentStage, false);
      }
    } else {
      // GENERIC MONSTER DEFEATED
      const nextProgress = stageProgress + 1;
      if (nextProgress >= 10) {
        setIsBossUnlocked(true);
        setStageProgress(10);
        if (autoAdvance) {
          // Immediately tackle Boss Mode automatically!
          setIsBossMode(true);
          spawnMonster(currentStage, true);
        } else {
          // Stay on stage, spawn next generic monster
          spawnMonster(currentStage, false);
        }
      } else {
        setStageProgress(nextProgress);
        spawnMonster(currentStage, false);
      }
    }
  };

  // --- CARD & DECK UPGRADING SYSTEMS ---
  // Boost normal levels spending Gold
  const handleUpgradeCard = (cardId: string, levelAmount: number, totalCost: Decimal) => {
    if (gold.lt(totalCost)) return;

    // Deduct gold
    setGold((prev) => prev.sub(totalCost));

    setPlayerCardState((prev) => {
      const current = prev[cardId] || { level: 0, silverLevel: 0 };
      return {
        ...prev,
        [cardId]: {
          ...current,
          level: Math.min(current.level + levelAmount, 100) // cap at 100 for prestige normal limit
        }
      };
    });
  };

  // Triggers Silver Card Level increments
  const handleSilverUpgrade = (cardId: string) => {
    const currentCard = playerCardState[cardId];
    if (!currentCard || currentCard.level < 100) return;

    setPlayerCardState((prev) => ({
      ...prev,
      [cardId]: {
        level: 0, // Reset normal level back to 0
        silverLevel: currentCard.silverLevel + 1 // Increment premium Silver multiplier
      }
    }));
  };

  // Unwraps Card Chests randomly
  const handleOpenChest = (chestTier: 'common' | 'rare' | 'legendary' | 'guild') => {
    const chest = CHEST_DATA[chestTier];
    const cost = Decimal.from(chest.cost);

    // Deduct cost
    if (chestTier === 'guild') {
      if (guildPoints.lt(cost)) return;
      setGuildPoints((prev) => prev.sub(cost));
    } else {
      if (gold.lt(cost)) return;
      setGold((prev) => prev.sub(cost));
    }

    // Pull random card templates of matching Tier
    const eligibleCards = CARD_TEMPLATES.filter((card) => card.chestTier === chestTier);
    if (eligibleCards.length === 0) return;

    const chosenCard = eligibleCards[Math.floor(Math.random() * eligibleCards.length)];
    const isNew = !playerCardState[chosenCard.id];

    // Award Card levels
    setPlayerCardState((prev) => {
      const current = prev[chosenCard.id] || { level: 0, silverLevel: 0 };
      return {
        ...prev,
        [chosenCard.id]: {
          ...current,
          level: Math.min(current.level + 4, 100) // Unwrapping adds +4 levels to speed up normal grinds
        }
      };
    });

    // Displays the modal overlay
    setActiveOpenedCard({ card: chosenCard, isNew });
  };

  // --- PRESTIGE RESETS & GUILD SELECTION ENGINE ---
  const handlePrestige = (selectedGuild: GuildType, pointsEarned: number) => {
    // 1. Calculate Starting Stage using Chronos Portal Scroll (Prereq Perk)
    // Starting stage = 1 + floor(highestStage * 10% * level)
    const portalRatio = perks.portalScroll * 0.10; // level 5: 50% start
    const startingStage = Math.max(1, Math.floor(highestStageReached * portalRatio));

    // 2. Base resetting
    setCurrentStage(startingStage);
    setStageProgress(0);
    setIsBossUnlocked(false);
    setIsBossMode(false);

    // Calculate starting gold using Midas Legacy perk
    // Base is 0; Level 1 starts with 500 gold, Level 2 with 5000 gold etc.
    let startGold = new Decimal(0, 0);
    if (perks.midasTouch > 0) {
      startGold = new Decimal(500 * Math.pow(10, perks.midasTouch - 1), 0);
    } else {
      startGold = new Decimal(10, 0); // defaults
    }

    setGold(startGold);
    
    // Sum points
    const actualPointsEarned = pointsEarned;
    setGuildPoints((prev) => prev.add(actualPointsEarned));

    // Add Guild alignment rank experiences
    setActiveGuild(selectedGuild);
    setGuildLevels((prev) => ({
      ...prev,
      [selectedGuild]: prev[selectedGuild as keyof typeof prev] + 1
    }));

    // Reset TEMPORARY attributes (Normal card levels sets to 0, retaining unlocked status/Silver)
    setPlayerCardState((prev) => {
      const cleared: Record<string, { level: number; silverLevel: number }> = {};
      Object.keys(prev).forEach((cardId) => {
        // Keeps unlocks and silver compound milestones, reset current levels!
        cleared[cardId] = {
          level: 0,
          silverLevel: prev[cardId].silverLevel
        };
      });
      return cleared;
    });

    // Update statistics resets
    setStats((prev) => ({
      ...prev,
      timesPrestiged: prev.timesPrestiged + 1,
    }));

    // Spawn starting monster
    spawnMonster(startingStage, false);

    // Save state instantly
    setTimeout(() => saveGameProgress(), 300);
  };

  // Acquisition of permanent high cost Perks
  const handleBuyPerk = (perkId: string, costGP: number) => {
    if (guildPoints.lt(costGP)) return;

    // Deduct Guild Points
    setGuildPoints((prev) => prev.sub(costGP));

    setPerks((prev) => ({
      ...prev,
      [perkId]: prev[perkId as keyof typeof prev] + 1
    }));
  };

  // --- SAVE ENCODING & EXPORT MIGRATIONS ---
  const saveGameProgress = () => {
    try {
      const saveObj: SaveState = {
        gold: gold.toString(),
        guildPoints: guildPoints.toString(),
        highestStageReached,
        currentStage,
        stageProgress,
        activeGuild,
        guildLevels,
        perks,
        cards: Object.keys(playerCardState).map((id) => ({
          id,
          level: playerCardState[id].level,
          silverLevel: playerCardState[id].silverLevel
        })),
        stats,
        settings: {
          soundOn,
          autoAdvance,
          buyMultiplier,
          language
        },
        lastSavedAt: Date.now()
      };

      const encrypted = btoa(JSON.stringify(saveObj));
      localStorage.setItem('dps_idle_save_game_pwa', encrypted);
    } catch (e) {
      // Localstorage full / blocked by sandbox ignored
    }
  };

  const loadGameProgress = () => {
    try {
      const raw = localStorage.getItem('dps_idle_save_game_pwa');
      if (!raw) {
        // First boot initialization
        spawnMonster(1, false);
        return;
      }

      const decrypted: SaveState = JSON.parse(atob(raw));

      // Parse gold and GP values using Decimal deserializes
      setGold(Decimal.from(decrypted.gold));
      setGuildPoints(Decimal.from(decrypted.guildPoints));
      setHighestStageReached(decrypted.highestStageReached || 1);
      setCurrentStage(decrypted.currentStage || 1);
      setStageProgress(decrypted.stageProgress || 0);
      setActiveGuild(decrypted.activeGuild || 'NONE');
      
      if (decrypted.guildLevels) setGuildLevels(decrypted.guildLevels);
      if (decrypted.perks) setPerks(decrypted.perks);
      
      // Parse card matrices back to map format
      if (decrypted.cards) {
        const cMap: Record<string, { level: number; silverLevel: number }> = {};
        decrypted.cards.forEach((cs) => {
          cMap[cs.id] = { level: cs.level, silverLevel: cs.silverLevel };
        });
        setPlayerCardState(cMap);
      }

      if (decrypted.stats) setStats(decrypted.stats);
      if (decrypted.settings) {
        setSoundOn(decrypted.settings.soundOn ?? true);
        setAutoAdvance(decrypted.settings.autoAdvance ?? true);
        setBuyMultiplier(decrypted.settings.buyMultiplier ?? '1');
        if (decrypted.settings.language) setLanguage(decrypted.settings.language);
      }

      // Offline Time calculations: If away > 15s, award offline passive DPS
      const elapsedMs = Date.now() - decrypted.lastSavedAt;
      if (elapsedMs > 15000) {
        const totalSeconds = Math.min(Math.floor(elapsedMs / 1000), 24 * 3600); // capped at 24 hours
        
        // Calculate passive elements damage sum
        const { base: b, poison: po, ice: ic } = getDpsBreakdownWithInputs(
          decrypted.activeGuild, 
          decrypted.guildLevels, 
          decrypted.cards
        );

        const offlinePassiveDps = b.add(po).add(ic);
        if (offlinePassiveDps.gt(0)) {
          // Calculate baseline earned: gold multipliers
          let goldMult = 1;
          decrypted.cards.forEach((cs) => {
            const template = CARD_TEMPLATES.find((c) => c.id === cs.id);
            if (template && template.type === 'GOLD_BOOST') {
              goldMult += cs.level * template.valueMultiplierPerLevel * (1 + cs.silverLevel);
            }
          });

          if (decrypted.activeGuild === 'MERCHANT') {
            goldMult += (decrypted.guildLevels.MERCHANT || 0) * 1.5;
          }

          // Calculate gold formula equivalent based on time
          // Approximate generic speed rate: 1 kill every 3 seconds standard
          const killsAway = totalSeconds / 3.0;
          const averageStageGold = Decimal.from(10).mul(Math.pow(1.35, (decrypted.currentStage || 1) - 1));
          const goldEarnedSecs = averageStageGold.mul(killsAway).mul(goldMult).mul(0.40); // 40% efficiency for offline progress

          if (goldEarnedSecs.gt(0)) {
            setGold((prev) => prev.add(goldEarnedSecs));
            // Queue beautiful visual greeting dashboard
            const hrs = Math.floor(totalSeconds / 3600);
            const mins = Math.floor((totalSeconds % 3605) / 60);
            setOfflineOverlay({ hours: hrs, mins, goldClaimed: goldEarnedSecs });
          }
        }
      }

      // Re-spawn combatant targets safely
      spawnMonster(decrypted.currentStage || 1, false);

    } catch (e) {
      // Clear corrupt state automatically
      localStorage.removeItem('dps_idle_save_game_pwa');
      spawnMonster(1, false);
    }
  };

  // Dry-helper to compute properties directly from parsed static arrays without React state dependencies
  const getDpsBreakdownWithInputs = (guild: GuildType, levels: any, cards: CardState[]) => {
    let base = new Decimal(0, 0);
    let poison = new Decimal(0, 0);
    let ice = new Decimal(0, 0);

    const levelsMap: Record<string, { level: number; silverLevel: number }> = {};
    cards.forEach((c) => {
      levelsMap[c.id] = { level: c.level, silverLevel: c.silverLevel };
    });

    CARD_TEMPLATES.forEach((card) => {
      const cState = levelsMap[card.id];
      if (!cState) return;

      const silverLevelCompound = 1 + cState.silverLevel;
      const cardMultiplier = (1 + cState.level * card.valueMultiplierPerLevel) * silverLevelCompound;

      if (card.type === 'POISON_DPS') {
        poison = poison.add(Decimal.from(card.baseValue).mul(cardMultiplier));
      } else if (card.type === 'ICE_CHILL') {
        ice = ice.add(Decimal.from(card.baseValue).mul(cardMultiplier));
      }
    });

    if (guild === 'WARRIOR') {
      const warriorMultiplier = 1 + (levels.WARRIOR || 0) * 1.0;
      base = base.mul(warriorMultiplier);
      poison = poison.mul(warriorMultiplier);
      ice = ice.mul(warriorMultiplier);
    }

    if (guild === 'MAGIC') {
      const boost = 1 + (levels.MAGIC || 0) * 0.15;
      poison = poison.mul(boost);
      ice = ice.mul(boost);
    }

    return { base, poison, ice };
  };

  // Manual export / import hooks
  const handleExportStateString = (): string => {
    try {
      const saveObj: SaveState = {
        gold: gold.toString(),
        guildPoints: guildPoints.toString(),
        highestStageReached,
        currentStage,
        stageProgress,
        activeGuild,
        guildLevels,
        perks,
        cards: Object.keys(playerCardState).map((id) => ({
          id,
          level: playerCardState[id].level,
          silverLevel: playerCardState[id].silverLevel
        })),
        stats,
        settings: {
          soundOn,
          autoAdvance,
          buyMultiplier,
          language
        },
        lastSavedAt: Date.now()
      };
      return btoa(JSON.stringify(saveObj));
    } catch (e) {
      return '';
    }
  };

  const handleImportString = (saveString: string): boolean => {
    try {
      const decrypted: SaveState = JSON.parse(atob(saveString));
      
      // Enforce model validation check
      if (!decrypted.gold || !decrypted.highestStageReached) return false;

      // Import state variables
      setGold(Decimal.from(decrypted.gold));
      setGuildPoints(Decimal.from(decrypted.guildPoints || '0'));
      setHighestStageReached(decrypted.highestStageReached);
      setCurrentStage(decrypted.currentStage || 1);
      setStageProgress(decrypted.stageProgress || 0);
      setActiveGuild(decrypted.activeGuild || 'NONE');
      if (decrypted.guildLevels) setGuildLevels(decrypted.guildLevels);
      if (decrypted.perks) setPerks(decrypted.perks);

      if (decrypted.cards) {
        const cMap: Record<string, { level: number; silverLevel: number }> = {};
        decrypted.cards.forEach((cs) => {
          cMap[cs.id] = { level: cs.level, silverLevel: cs.silverLevel };
        });
        setPlayerCardState(cMap);
      }

      if (decrypted.stats) setStats(decrypted.stats);
      if (decrypted.settings) {
        setSoundOn(decrypted.settings.soundOn ?? true);
        setAutoAdvance(decrypted.settings.autoAdvance ?? true);
        setBuyMultiplier(decrypted.settings.buyMultiplier ?? '1');
        if (decrypted.settings.language) setLanguage(decrypted.settings.language);
      }
      
      // Save instantly
      localStorage.setItem('dps_idle_save_game_pwa', saveString);
      spawnMonster(decrypted.currentStage || 1, false);
      return true;

    } catch (e) {
      return false;
    }
  };

  const handleHardReset = () => {
    localStorage.removeItem('dps_idle_save_game_pwa');
    // Reload components physically
    window.location.reload();
  };

  // Perform load on initial mounting
  useEffect(() => {
    loadGameProgress();
  }, []);

  const rightTab = activeTab === 'battle' ? 'cards' : activeTab;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased md:relative pb-16 lg:pb-0" id="pwa-game-root">
      
      {/* Sticky top metrics information */}
      <Header
        gold={gold}
        guildPoints={guildPoints}
        currentStage={currentStage}
        stageProgress={stageProgress}
        isBossUnlocked={isBossUnlocked}
        isBossMode={isBossMode}
        activeGuild={activeGuild}
        soundOn={soundOn}
        autoAdvance={autoAdvance}
        language={language}
        onToggleSound={() => setSoundOn(!soundOn)}
        onToggleAutoAdvance={() => setAutoAdvance(!autoAdvance)}
        onSave={saveGameProgress}
        onHardReset={handleHardReset}
        onExport={handleExportStateString}
        onImport={() => setActiveTab('stats')}
        onTriggerBoss={handleTriggerBoss}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* COMPONENT DIVISION GRID (Desktop Adaptive vs Mobile tabs layout) */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-4 md:py-6 flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:overflow-hidden">
        
        {/* LEFT COMPONENT (Always persistent: Combat zone viewport) */}
        <section className={`col-span-1 lg:col-span-5 flex flex-col gap-4 self-start w-full ${activeTab === 'battle' ? 'flex' : 'hidden lg:flex'}`} id="arena-column">
          <CombatZone
            currentStage={currentStage}
            highestUnlockedStage={highestStageReached}
            monsterName={monsterName}
            monsterCurrentHP={monsterCurrentHP}
            monsterMaxHP={monsterMaxHP}
            isBossMode={isBossMode}
            activePoisonDps={activePoisonDps}
            activeIceDps={activeIceDps}
            activeEarthDps={activeEarthDps}
            earthChargeTracker={earthquakeTimerRef.current}
            soundOn={soundOn}
            onMonsterTap={handleMonsterTap}
            onStageChange={handleStageChange}
            onToggleBossMode={handleTriggerBoss}
          />
          
          {/* Quick specs helper desktop only */}
          <div className="hidden lg:flex bg-slate-900/40 border border-slate-800/80 p-4 rounded-3xl flex-col gap-2 font-sans">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> {t.QUICK_HINT}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal mt-0.5">
              {t.QUICK_HINT_DESC}
            </p>
          </div>
        </section>

        {/* RIGHT COMPONENT (Scrollable Upgrade Lists tabs) */}
        <section className={`col-span-1 lg:col-span-7 flex flex-col gap-4 w-full ${activeTab !== 'battle' ? 'flex' : 'hidden lg:flex'}`} id="controls-tab-column">
          {/* Sticky horizontal Tab selectors bar */}
          <nav className="hidden lg:flex bg-slate-900 border border-slate-800 p-1 rounded-2xl w-full sm:w-fit justify-between sm:justify-start gap-1 sm:gap-1.5" id="nav-tabs-bar">
            <button
              id="tab-cards-btn"
              onClick={() => setActiveTab('cards')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-5 py-2 text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                rightTab === 'cards' 
                  ? 'bg-amber-500 text-slate-950 shadow font-black scale-102' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden sm:inline-block" /> <span className="truncate">{t.TAB_CARDS}</span>
            </button>
            <button
              id="tab-guilds-btn"
              onClick={() => setActiveTab('guild')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-5 py-2 text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                rightTab === 'guild' 
                  ? 'bg-fuchsia-500 text-white shadow font-black scale-102' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden sm:inline-block" /> <span className="truncate">{t.TAB_GUILD}</span>
            </button>
            <button
              id="tab-stats-btn"
              onClick={() => setActiveTab('stats')}
              className={`flex-1 sm:flex-initial px-2.5 sm:px-5 py-2 text-[11px] sm:text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                rightTab === 'stats' 
                  ? 'bg-cyan-500 text-slate-950 shadow font-black scale-102' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 hidden sm:inline-block" /> <span className="truncate">{t.TAB_STATS}</span>
            </button>
          </nav>

          {/* ACTIVE CONTENT RENDERING PANEL */}
          <div className="flex-1 overflow-y-auto">
            {rightTab === 'cards' && (
              <CardsTab
                gold={gold}
                guildPoints={guildPoints}
                playerCardState={playerCardState}
                buyMultiplier={buyMultiplier}
                onBuyMultiplierChange={setBuyMultiplier}
                onUpgradeCard={handleUpgradeCard}
                onSilverUpgrade={handleSilverUpgrade}
                onOpenChest={handleOpenChest}
                activeOpenedCard={activeOpenedCard}
                onDismissOpenedCard={() => setActiveOpenedCard(null)}
                language={language}
              />
            )}

            {rightTab === 'guild' && (
              <GuildTab
                currentStage={currentStage}
                highestStageReached={highestStageReached}
                guildPoints={guildPoints}
                activeGuild={activeGuild}
                guildLevels={guildLevels}
                perks={perks}
                onBuyPerk={handleBuyPerk}
                onPrestige={handlePrestige}
                language={language}
              />
            )}

            {rightTab === 'stats' && (
              <StatsTab
                stats={stats}
                currentStage={currentStage}
                highestStageReached={highestStageReached}
                baseClickPower={getBaseClickPower()}
                activeBaseDps={activeBaseDps}
                activePoisonDps={activePoisonDps}
                activeIceDps={activeIceDps}
                activeEarthDps={activeEarthDps}
                soundOn={soundOn}
                onImportString={handleImportString}
                onExportStateString={handleExportStateString}
                language={language}
              />
            )}
          </div>
        </section>
      </div>

      {/* OFFLINE REWARDS WELCOME BACK MODAL */}
      {offlineOverlay && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-fade-in" id="offline-welcome-modal">
          <div className="bg-slate-900 border-2 border-slate-800 hover:border-amber-400/40 max-w-sm w-full rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center font-sans">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 animate-bounce">
              <Coins className="w-8 h-8" />
            </div>

            <h2 className="text-lg font-black text-white mt-4 uppercase tracking-tight">{t.OFFLINE_TITLE}</h2>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'ro' 
                ? `Războinicii breslei au apărat cu succes ținuturile în absența ta de ` 
                : `Your guild warriors successfully defended your territories during your absence of `}
              **{offlineOverlay.hours}h {offlineOverlay.mins}m**!
            </p>

            <div className="my-5 bg-slate-950 border border-slate-805 px-6 py-3.5 rounded-xl w-full">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block leading-none">
                {language === 'ro' ? 'RESURSE COLECTATE PASIV' : 'RESOURCES RECEIVED'}
              </span>
              <span className="text-lg font-black text-amber-400 font-mono block mt-1">
                + {offlineOverlay.goldClaimed.format(2)} {language === 'ro' ? 'Aur' : 'Gold'}
              </span>
            </div>

            <button
              onClick={() => setOfflineOverlay(null)}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl cursor-pointer active:scale-95 transition"
              id="dismiss-offline-btn"
            >
              {t.CLAIM}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Tab Bar */}
      <nav className="lg:hidden flex bg-slate-900 border-t border-slate-850 p-1.5 fixed bottom-0 left-0 right-0 z-50 justify-around gap-1 shadow-[0_-8px_24px_rgba(0,0,0,0.6)]" id="mobile-tabs-bar">
        <button
          onClick={() => setActiveTab('battle')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 text-[10px] font-bold rounded-xl transition cursor-pointer gap-1 ${
            activeTab === 'battle'
              ? 'bg-emerald-500 text-slate-950 shadow font-black scale-102'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4 shrink-0" />
          <span>{t.TAB_BATTLE}</span>
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 text-[10px] font-bold rounded-xl transition cursor-pointer gap-1 ${
            activeTab === 'cards'
              ? 'bg-amber-500 text-slate-950 shadow font-black scale-102'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4 shrink-0" />
          <span>{t.TAB_CARDS}</span>
        </button>
        <button
          onClick={() => setActiveTab('guild')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 text-[10px] font-bold rounded-xl transition cursor-pointer gap-1 ${
            activeTab === 'guild'
              ? 'bg-fuchsia-500 text-white shadow font-black scale-102'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4 shrink-0" />
          <span>{t.TAB_GUILD}</span>
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 text-[10px] font-bold rounded-xl transition cursor-pointer gap-1 ${
            activeTab === 'stats'
              ? 'bg-cyan-500 text-slate-950 shadow font-black scale-102'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Coins className="w-4 h-4 shrink-0" />
          <span>{t.TAB_STATS}</span>
        </button>
      </nav>
    </main>
  );
}
