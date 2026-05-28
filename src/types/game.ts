/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Decimal } from '../utils/decimal';

export type CardType = 
  | 'TAP_DAMAGE' 
  | 'POISON_DPS' 
  | 'EARTH_BURST' 
  | 'ICE_CHILL' 
  | 'GOLD_BOOST' 
  | 'BOSS_SHRED' 
  | 'GUILD_BOOST';

export interface CardDefinition {
  id: string;
  name: string;
  type: CardType;
  description: string;
  chestTier: 'common' | 'rare' | 'legendary' | 'guild';
  baseUnlockCost: string; // Decimal representation
  costMultiplier: number; // e.g., 1.15
  baseValue: number;
  valueMultiplierPerLevel: number; // multiplier per normal level
  colorHex: string;
}

export interface CardState {
  id: string;
  level: number;
  silverLevel: number;
}

export type GuildType = 'WARRIOR' | 'MERCHANT' | 'MAGIC' | 'NONE';

export interface GuildPerk {
  id: string;
  name: string;
  description: string;
  baseCost: number; // in Guild Points
  costMultiplier: number;
  maxLevel: number;
  level: number;
}

export interface GameStats {
  tapCount: number;
  monsterKills: number;
  bossKills: number;
  totalGoldEarned: string; // Decimal serialized
  timesPrestiged: number;
  playtime: number; // in seconds
  highestStageReached: number;
}

export interface SaveState {
  gold: string; // Decimal serialized
  guildPoints: string; // Decimal serialized
  highestStageReached: number;
  currentStage: number;
  stageProgress: number;
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
  cards: CardState[];
  stats: GameStats;
  settings: {
    soundOn: boolean;
    autoAdvance: boolean;
    buyMultiplier: '1' | '3' | '10' | '99' | 'MAX';
    language?: 'en' | 'ro';
  };
  lastSavedAt: number; // timestamp
}
