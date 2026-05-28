/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardDefinition } from '../types/game';

export const CARD_TEMPLATES: CardDefinition[] = [
  // --- COMMON CHEST CARDS ---
  {
    id: 'tap_novice',
    name: 'Pumnalul Solarian (Solarian training blade)',
    type: 'TAP_DAMAGE',
    description: "Solmour's simple training iron blade from Aurenor's sparring yards. Increases Click Damage by +5 flat and +10% per level.",
    chestTier: 'common',
    baseUnlockCost: '100',
    costMultiplier: 1.12,
    baseValue: 5,
    valueMultiplierPerLevel: 0.1,
    colorHex: '#94a3b8' // Slate-400
  },
  {
    id: 'poison_cloud',
    name: 'Mările de Otravă din Duskari (Duskari Poison Mist)',
    type: 'POISON_DPS',
    description: 'Summons toxic mist from Draenos\'s dark realm of Duskari. Deals 2 Poison damage/sec, increases by +12% per level.',
    chestTier: 'common',
    baseUnlockCost: '150',
    costMultiplier: 1.14,
    baseValue: 2,
    valueMultiplierPerLevel: 0.12,
    colorHex: '#22c55e' // Green-500 (Poison)
  },
  {
    id: 'earth_pebble',
    name: 'Sling de Minã din Roakk (Roakk Pebble Sling)',
    type: 'EARTH_BURST',
    description: 'Crafted by the twin smith Brundar. Triggers earth spikes dealing 12 damage every 4s, +15% per level.',
    chestTier: 'common',
    baseUnlockCost: '220',
    costMultiplier: 1.15,
    baseValue: 12,
    valueMultiplierPerLevel: 0.15,
    colorHex: '#f59e0b' // Amber-500 (Earth)
  },
  {
    id: 'ice_frost',
    name: 'Gheața Sacră din Silvarel (Silvarel Forest Ice Spark)',
    type: 'ICE_CHILL',
    description: 'Chilled essence from the elven forests of Silvarel. Deals 1.5 Ice damage/sec, slows enemy HP regeneration by +5% per level.',
    chestTier: 'common',
    baseUnlockCost: '300',
    costMultiplier: 1.15,
    baseValue: 1.5,
    valueMultiplierPerLevel: 0.14,
    colorHex: '#06b6d4' // Cyan-500 (Ice)
  },
  {
    id: 'gold_magnet',
    name: 'Eșarfa Mătăsoasă a lui Maelis (Maelis Scarf)',
    type: 'GOLD_BOOST',
    description: 'The golden silk scarf left by sister Maelis. Solmour\'s warm link to his home. Increases all Gold drops by +15% per level.',
    chestTier: 'common',
    baseUnlockCost: '400',
    costMultiplier: 1.16,
    baseValue: 0.15,
    valueMultiplierPerLevel: 0.15,
    colorHex: '#fbbf24' // Yellow-400
  },

  // --- RARE CHEST CARDS ---
  {
    id: 'tap_warrior',
    name: 'Mănușile Combatante (Kael\'s Combat Gauntlets)',
    type: 'TAP_DAMAGE',
    description: 'Sledge-forged bronze knuckles approved by Kael, Guardian of Fight. Increases Click Damage by +60 flat and +22% per level.',
    chestTier: 'rare',
    baseUnlockCost: '4500',
    costMultiplier: 1.15,
    baseValue: 60,
    valueMultiplierPerLevel: 0.22,
    colorHex: '#64748b' // Slate-500
  },
  {
    id: 'poison_bite',
    name: "Ghearele Akeshei (Akesha's Feline Claws)",
    type: 'POISON_DPS',
    description: 'Lethal retractables honed in the dueling trees of Aeraris. Deals 35 Poison damage/sec, increases by +25% per level.',
    chestTier: 'rare',
    baseUnlockCost: '6000',
    costMultiplier: 1.16,
    baseValue: 35,
    valueMultiplierPerLevel: 0.25,
    colorHex: '#15803d' // Green-700
  },
  {
    id: 'earth_boulder',
    name: "Buzduganul lui Orm (Orm's Rock Mace)",
    type: 'EARTH_BURST',
    description: 'Swung by Orm, the steadfast bear champion of Beastkin. Triggers Pebble Smash dealing 240 damage every 4s, +30% per level.',
    chestTier: 'rare',
    baseUnlockCost: '8000',
    costMultiplier: 1.17,
    baseValue: 240,
    valueMultiplierPerLevel: 0.3,
    colorHex: '#b45309' // Amber-700
  },
  {
    id: 'ice_blizzard',
    name: "Cronicile Ghidate ale lui Iven (Iven's Archivist Journal)",
    type: 'ICE_CHILL',
    description: 'Written by the quiet savant of Tharnor. Deals 40 Ice dps, reduces healing and slows by +28% per level.',
    chestTier: 'rare',
    baseUnlockCost: '11000',
    costMultiplier: 1.17,
    baseValue: 40,
    valueMultiplierPerLevel: 0.28,
    colorHex: '#0891b2' // Cyan-600
  },
  {
    id: 'boss_buster',
    name: 'Ura și Orgoliul lui Kaelan (Kaelan\'s Royal Rivalry)',
    type: 'BOSS_SHRED',
    description: 'Solmour\'s older brother whose hateful challenge drives Solmour to conquer all bosses. Deals +40% extra damage against Bosses per level.',
    chestTier: 'rare',
    baseUnlockCost: '15000',
    costMultiplier: 1.18,
    baseValue: 0.4,
    valueMultiplierPerLevel: 0.4,
    colorHex: '#ef4444' // Red-500
  },

  // --- LEGENDARY CHEST CARDS ---
  {
    id: 'tap_hero',
    name: 'Arcana Lunii (Luna Moonbow)',
    type: 'TAP_DAMAGE',
    description: 'The Sylvanar Tree of Life bow given to elf archer Thalion. Increases Click Damage by +1000 flat and +55% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '250000',
    costMultiplier: 1.20,
    baseValue: 1000,
    valueMultiplierPerLevel: 0.55,
    colorHex: '#475569' // Slate-600
  },
  {
    id: 'poison_apocalypse',
    name: 'Panglica Vântului (Aeliana\'s Sky Ribbon)',
    type: 'POISON_DPS',
    description: 'Woven from raw thunder clouds by Aeliana of Aeraris. Deals 850 Poison damage/sec, increases by +60% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '350000',
    costMultiplier: 1.21,
    baseValue: 850,
    valueMultiplierPerLevel: 0.60,
    colorHex: '#166534' // Green-800
  },
  {
    id: 'earth_quaker',
    name: 'Ciocanul Adâncului (Borin\'s Deep Hammer)',
    type: 'EARTH_BURST',
    description: 'Borin\'s legendary hammer made of the red iron of Roakk. Deals 6800 Earth damage every 4s, +70% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '500000',
    costMultiplier: 1.22,
    baseValue: 6800,
    valueMultiplierPerLevel: 0.70,
    colorHex: '#78350f' // Amber-900
  },
  {
    id: 'ice_absolute_zero',
    name: 'Piatra Tunetului a lui Kaelor (Kaelor\'s Thunder Stone)',
    type: 'ICE_CHILL',
    description: 'A frozen lightning strike carried by giant Kaelor of Tharnor. Deals 1200 Ice damage/sec, increases click vulnerability by +65% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '750000',
    costMultiplier: 1.22,
    baseValue: 1200,
    valueMultiplierPerLevel: 0.65,
    colorHex: '#0e7490' // Cyan-700
  },
  {
    id: 'gold_vault',
    name: 'Cristalul Lioraei (Liora\'s Healing Crystal)',
    type: 'GOLD_BOOST',
    description: 'The legendary warm crystal held by Isolde, reflecting Queen Liora\'s kindness. Increases all Gold dropped by +200% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '1200000',
    costMultiplier: 1.24,
    baseValue: 2.0,
    valueMultiplierPerLevel: 2.0,
    colorHex: '#f59e0b' // Yellow-500
  },

  // --- GUILD EXCLUSIVE CARDS ---
  {
    id: 'guild_synergy',
    name: 'Jurământul din Aurenor (Aurenor Return Oath)',
    type: 'GUILD_BOOST',
    description: 'Solmour\'s silent promise to return and restore Solarei\'s light. Increases Guild Points gained on reset by +50% per level.',
    chestTier: 'guild',
    baseUnlockCost: '25', // 25 GP
    costMultiplier: 1.25,
    baseValue: 0.5,
    valueMultiplierPerLevel: 0.5,
    colorHex: '#d946ef' // Fuchsia-500
  },
  {
    id: 'guild_gold',
    name: 'Tratatul celor Cinci Regate (The Five Realms Treaty)',
    type: 'GOLD_BOOST',
    description: 'The golden treaty signed under Malenar\'s vision. Adds +300% Gold Find multiplier per level.',
    chestTier: 'guild',
    baseUnlockCost: '30', // 30 GP
    costMultiplier: 1.25,
    baseValue: 3.0,
    valueMultiplierPerLevel: 3.0,
    colorHex: '#e11d48' // Rose-600
  }
];

export const CHEST_DATA = {
  common: {
    id: 'common',
    name: 'Rucsac Modest de Exil (Exile Satchel)',
    cost: '100', // Gold Formula: e.g. base * 1.5 ^ stage check or flat?
    costNum: 100, // Static multiplier or scaling cost
    color: 'from-slate-700 to-slate-800',
    accent: 'border-slate-500 text-slate-300',
  },
  rare: {
    id: 'rare',
    name: 'Cufărul Elfilor din Silvarel (Elven Chest)',
    cost: '5000',
    costNum: 5000,
    color: 'from-blue-800 to-indigo-950',
    accent: 'border-blue-500 text-blue-300',
  },
  legendary: {
    id: 'legendary',
    name: 'Cripta celor Cinci Vestigii (Vault of Vestiges)',
    cost: '250000',
    costNum: 250000,
    color: 'from-amber-600 to-amber-950',
    accent: 'border-amber-400 text-amber-300',
  },
  guild: {
    id: 'guild',
    name: 'Cufărul de la Thalorion (Thalorion Strongbox)',
    cost: '10', // Costs 10 Guild Points (GP)
    costNum: 10,
    color: 'from-fuchsia-800 to-fuchsia-950',
    accent: 'border-fuchsia-500 text-fuchsia-300',
  }
};

export const MONSTER_PREFIXES = [
  'Noctarian', 'Duskari Twilight', 'Vartai Mindbent', 'Grotharian Plague', 'Umbrelorii Secret',
  'Shadow', 'Corrupted', 'Obsidian', 'Lethal', 'Venomous', 'Enraged', 'Ancient'
];

export const MONSTER_TYPES = [
  'Gargoyle', 'Specter', 'Golem', 'Wraith', 'Wyvern', 'Worg',
  'Infiltrator', 'Sentinel', 'Imp', 'Behemoth', 'Banshee', 'Abomination'
];

export const MONSTER_BOSSES = [
  'Draenos, the Fallen Brother',
  'Grotharian Steel Destroyer',
  'Noctarian Wraith Summoner',
  'Vartai Soul Melting Oracle',
  'Duskari Perpetual Twilight Keep',
  'Umbrelorian Shadow Lurker',
  'Thandor\'s Trial Specter',
  'Archbandit of Aurenor\'s Path'
];
