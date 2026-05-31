/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardDefinition } from '../types/game';

export const CARD_TEMPLATES: CardDefinition[] = [
  // ==========================================
  // --- COMMON CHEST CARDS (15 CARDS) ---
  // ==========================================
  {
    id: 'tap_novice',
    name: 'Pumnalul Solarian (Solarian Training Blade)',
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
    description: "Summons toxic mist from Draenos's dark realm of Duskari. Deals 2 Poison damage/sec, increases by +12% per level.",
    chestTier: 'common',
    baseUnlockCost: '150',
    costMultiplier: 1.14,
    baseValue: 2,
    valueMultiplierPerLevel: 0.12,
    colorHex: '#22c55e' // Green-500
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
    colorHex: '#f59e0b' // Amber-500
  },
  {
    id: 'ice_frost',
    name: 'Gheața Sacră din Silvarel (Silvarel Ice Spark)',
    type: 'ICE_CHILL',
    description: 'Chilled essence from the elven forests of Silvarel. Deals 1.5 Ice damage/sec, slows enemy HP regeneration by +5% per level.',
    chestTier: 'common',
    baseUnlockCost: '300',
    costMultiplier: 1.15,
    baseValue: 1.5,
    valueMultiplierPerLevel: 0.14,
    colorHex: '#06b6d4' // Cyan-500
  },
  {
    id: 'gold_magnet',
    name: 'Eșarfa Mătăsoasă a lui Maelis (Maelis Scarf)',
    type: 'GOLD_BOOST',
    description: "The golden silk scarf left by sister Maelis. Solmour's warm link to his home. Increases all Gold drops by +15% per level.",
    chestTier: 'common',
    baseUnlockCost: '400',
    costMultiplier: 1.16,
    baseValue: 0.15,
    valueMultiplierPerLevel: 0.15,
    colorHex: '#fbbf24' // Yellow-400
  },
  {
    id: 'tap_novice_wooden',
    name: 'Spada de Lemn Aureliană (Aurelian Wooden Sword)',
    type: 'TAP_DAMAGE',
    description: 'A modest training sword used by young recruits. Increases Click Damage by +3 flat and +8% per level.',
    chestTier: 'common',
    baseUnlockCost: '120',
    costMultiplier: 1.11,
    baseValue: 3,
    valueMultiplierPerLevel: 0.08,
    colorHex: '#b45309' // Brown-700
  },
  {
    id: 'poison_cloud_spore',
    name: 'Ciuperca Intoxicantă (Sporewood Shroom)',
    type: 'POISON_DPS',
    description: 'Spores collected from the humid Undergrove. Deals 1.8 Poison damage/sec, increases by +11% per level.',
    chestTier: 'common',
    baseUnlockCost: '180',
    costMultiplier: 1.13,
    baseValue: 1.8,
    valueMultiplierPerLevel: 0.11,
    colorHex: '#10b981' // Emerald-500
  },
  {
    id: 'earth_pebble_sand',
    name: 'Urmă de Nisip din Roakk (Roakk Sandstorm)',
    type: 'EARTH_BURST',
    description: 'A swirling localized storm of sharp sand grains. Deals 9 Earth damage every 4s, +13% per level.',
    chestTier: 'common',
    baseUnlockCost: '260',
    costMultiplier: 1.14,
    baseValue: 9,
    valueMultiplierPerLevel: 0.13,
    colorHex: '#d97706' // Yellow-600
  },
  {
    id: 'ice_frost_snowball',
    name: 'Bulgărele Înghețat (Frost Peak Snowball)',
    type: 'ICE_CHILL',
    description: 'Packed snow enchanted with high-altitude frost. Deals 1.2 Ice damage/sec, slows by +12% per level.',
    chestTier: 'common',
    baseUnlockCost: '350',
    costMultiplier: 1.14,
    baseValue: 1.2,
    valueMultiplierPerLevel: 0.12,
    colorHex: '#38bdf8' // Sky-400
  },
  {
    id: 'gold_magnet_purse',
    name: 'Punga cu Firfirici (Exile Coin Purse)',
    type: 'GOLD_BOOST',
    description: 'An old leather coin purse that always has room for a copper more. Increases Gold drops by +10% per level.',
    chestTier: 'common',
    baseUnlockCost: '480',
    costMultiplier: 1.15,
    baseValue: 0.1,
    valueMultiplierPerLevel: 0.1,
    colorHex: '#fbbf24' // Yellow-400
  },
  {
    id: 'tap_novice_ring',
    name: 'Inelul de Cupru Simplu (Common Copper Ring)',
    type: 'TAP_DAMAGE',
    description: 'A cheap plated band with a tiny, warm ember alloy. Increases Click Damage by +4 flat and +7% per level.',
    chestTier: 'common',
    baseUnlockCost: '550',
    costMultiplier: 1.12,
    baseValue: 4,
    valueMultiplierPerLevel: 0.07,
    colorHex: '#f97316' // Orange-500
  },
  {
    id: 'poison_cloud_swamp',
    name: 'Otrăvitorul din Mlaștină (Bog Poison Dart)',
    type: 'POISON_DPS',
    description: 'Needles soaked in stagnant fen water. Deals 2.2 Poison damage/sec, increases by +10% per level.',
    chestTier: 'common',
    baseUnlockCost: '620',
    costMultiplier: 1.13,
    baseValue: 2.2,
    valueMultiplierPerLevel: 0.1,
    colorHex: '#4ade80' // Green-400
  },
  {
    id: 'earth_pebble_golem',
    name: 'Praștia Golemului (Tiny Golem Pebble Slings)',
    type: 'EARTH_BURST',
    description: 'Weighted clay fragments blessed by earthen sprites. Deals 15 Earth damage every 4s, +14% per level.',
    chestTier: 'common',
    baseUnlockCost: '700',
    costMultiplier: 1.15,
    baseValue: 15,
    valueMultiplierPerLevel: 0.14,
    colorHex: '#ca8a04' // Yellow-700
  },
  {
    id: 'ice_frost_breeze',
    name: 'Suflarea Nordică (Northwind Breeze)',
    type: 'ICE_CHILL',
    description: 'A chilling gust captured in an ambient flask. Deals 1.6 Ice damage/sec, slows HP regeneration by +11% per level.',
    chestTier: 'common',
    baseUnlockCost: '850',
    costMultiplier: 1.14,
    baseValue: 1.6,
    valueMultiplierPerLevel: 0.11,
    colorHex: '#22d3ee' // Cyan-400
  },
  {
    id: 'boss_buster_lite',
    name: 'Tactici de Hărțuială (Skirmish Tactics)',
    type: 'BOSS_SHRED',
    description: 'Basic tactical insight on standard vulnerabilities. Deals +12% extra damage against Bosses per level.',
    chestTier: 'common',
    baseUnlockCost: '950',
    costMultiplier: 1.12,
    baseValue: 0.12,
    valueMultiplierPerLevel: 0.12,
    colorHex: '#f87171' // Red-400
  },

  // ==========================================
  // --- RARE CHEST CARDS (15 CARDS) ---
  // ==========================================
  {
    id: 'tap_warrior',
    name: "Mănușile Combatante (Kael's Combat Gauntlets)",
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
    name: "Ura și Orgoliul lui Kaelan (Kaelan's Royal Rivalry)",
    type: 'BOSS_SHRED',
    description: "Solmour's older brother whose challenger challenge drives Solmour to conquer all bosses. Deals +40% extra damage against Bosses per level.",
    chestTier: 'rare',
    baseUnlockCost: '15000',
    costMultiplier: 1.18,
    baseValue: 0.4,
    valueMultiplierPerLevel: 0.4,
    colorHex: '#ef4444' // Red-500
  },
  {
    id: 'gold_chest_silver_bars',
    name: 'Lingoul de Argint Aurelian (Aurelian Silver Bullion)',
    type: 'GOLD_BOOST',
    description: 'Refined noble metal from Aurelia\'s mountain veins. Increases all Gold drops by +30% per level.',
    chestTier: 'rare',
    baseUnlockCost: '18000',
    costMultiplier: 1.16,
    baseValue: 0.3,
    valueMultiplierPerLevel: 0.2,
    colorHex: '#94a3b8' // Slate-400
  },
  {
    id: 'tap_warrior_greatsword',
    name: 'Spada Războinicului (Ironheart Greatsword)',
    type: 'TAP_DAMAGE',
    description: 'A heavy, well-balanced sword forged from high-quality steel. Increases Click damage by +80 flat and +24% per level.',
    chestTier: 'rare',
    baseUnlockCost: '22000',
    costMultiplier: 1.15,
    baseValue: 80,
    valueMultiplierPerLevel: 0.24,
    colorHex: '#475569' // Slate-600
  },
  {
    id: 'poison_bite_serpent',
    name: 'Scuipatul Viperinei (Serpents Venom Sack)',
    type: 'POISON_DPS',
    description: "Concentrated corrosive venom glands. Deals 40 Poison damage/sec, increases by +26% per level.",
    chestTier: 'rare',
    baseUnlockCost: '26000',
    costMultiplier: 1.16,
    baseValue: 40,
    valueMultiplierPerLevel: 0.26,
    colorHex: '#16a34a' // Green-600
  },
  {
    id: 'earth_quake_trencher',
    name: 'Săpăliga de Război (Roakk Trencher)',
    type: 'EARTH_BURST',
    description: 'A heavy iron spade carved with geological glyphs. Deals 280 Earth damage every 4s, +32% per level.',
    chestTier: 'rare',
    baseUnlockCost: '32000',
    costMultiplier: 1.17,
    baseValue: 280,
    valueMultiplierPerLevel: 0.32,
    colorHex: '#a16207' // Yellow-800
  },
  {
    id: 'ice_storm_breath',
    name: 'Suflarea Viscolului (Glacial Breath)',
    type: 'ICE_CHILL',
    description: 'Freezing atmospheric pressure focused through obsidian runes. Deals 45 Ice damage/sec, slows by +30% per level.',
    chestTier: 'rare',
    baseUnlockCost: '40000',
    costMultiplier: 1.17,
    baseValue: 45,
    valueMultiplierPerLevel: 0.3,
    colorHex: '#0284c7' // Sky-600
  },
  {
    id: 'boss_shred_apex',
    name: 'Lama Vânătorului (Apex Hunter Blade)',
    type: 'BOSS_SHRED',
    description: 'Damascus alloy crafted to tear through thick giant hides. Deals +45% extra damage against Bosses per level.',
    chestTier: 'rare',
    baseUnlockCost: '50000',
    costMultiplier: 1.18,
    baseValue: 0.45,
    valueMultiplierPerLevel: 0.45,
    colorHex: '#dc2626' // Red-600
  },
  {
    id: 'tap_warrior_amulet',
    name: 'Amuleta de Bronz (Bronze Heart Medal)',
    type: 'TAP_DAMAGE',
    description: 'An old combat medallion of soldiers. Increases Click damage by +50 flat and +18% per level.',
    chestTier: 'rare',
    baseUnlockCost: '60000',
    costMultiplier: 1.15,
    baseValue: 50,
    valueMultiplierPerLevel: 0.18,
    colorHex: '#b45309' // Amber-700
  },
  {
    id: 'poison_bite_trap',
    name: 'Căpăstru Serpentin (Snakeskin Venom Trap)',
    type: 'POISON_DPS',
    description: 'Poison spike traps covered in moss. Deals 30 Poison damage/sec, increases by +22% per level.',
    chestTier: 'rare',
    baseUnlockCost: '72000',
    costMultiplier: 1.16,
    baseValue: 30,
    valueMultiplierPerLevel: 0.22,
    colorHex: '#166534' // Green-800
  },
  {
    id: 'earth_quake_sentinel',
    name: 'Sculptura de Argilă (Clay Sentinel Remnants)',
    type: 'EARTH_BURST',
    description: 'Earthen core fragments of ancient guard statues. Deals 220 Earth damage every 4s, +28% per level.',
    chestTier: 'rare',
    baseUnlockCost: '85000',
    costMultiplier: 1.17,
    baseValue: 220,
    valueMultiplierPerLevel: 0.28,
    colorHex: '#854d0e' // Yellow-900
  },
  {
    id: 'ice_storm_shards',
    name: 'Așchiile de Gheață (Glacial Cryo Shards)',
    type: 'ICE_CHILL',
    description: 'Violent needles of everlasting permafrost. Deals 38 Ice damage/sec, slows by +25% per level.',
    chestTier: 'rare',
    baseUnlockCost: '99000',
    costMultiplier: 1.17,
    baseValue: 38,
    valueMultiplierPerLevel: 0.25,
    colorHex: '#06b6d4' // Cyan-500
  },

  // ==========================================
  // --- LEGENDARY CHEST CARDS (15 CARDS) ---
  // ==========================================
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
    name: "Ciocanul Adâncului (Borin's Deep Hammer)",
    type: 'EARTH_BURST',
    description: "Borin's legendary hammer made of the red iron of Roakk. Deals 6800 Earth damage every 4s, +70% per level.",
    chestTier: 'legendary',
    baseUnlockCost: '500000',
    costMultiplier: 1.22,
    baseValue: 6800,
    valueMultiplierPerLevel: 0.70,
    colorHex: '#78350f' // Amber-900
  },
  {
    id: 'ice_absolute_zero',
    name: "Piatra Tunetului a lui Kaelor (Kaelor's Thunder Stone)",
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
    name: "Cristalul Lioraei (Liora's Healing Crystal)",
    type: 'GOLD_BOOST',
    description: "The legendary warm crystal held by Isolde, reflecting Queen Liora's kindness. Increases all Gold dropped by +200% per level.",
    chestTier: 'legendary',
    baseUnlockCost: '1200000',
    costMultiplier: 1.24,
    baseValue: 2.0,
    valueMultiplierPerLevel: 2.0,
    colorHex: '#f59e0b' // Yellow-500
  },
  {
    id: 'boss_slayer_archangel',
    name: 'Sabia Arhanghelului (Archangel Sunblade)',
    type: 'BOSS_SHRED',
    description: 'Holy broadsword burning with stellar flares. Deals +75% extra damage against Bosses per level.',
    chestTier: 'legendary',
    baseUnlockCost: '1500000',
    costMultiplier: 1.21,
    baseValue: 0.75,
    valueMultiplierPerLevel: 0.75,
    colorHex: '#f43f5e' // Rose-500
  },
  {
    id: 'tap_hero_imperial',
    name: 'Inelul Împăratului (Imperial Signet Ring)',
    type: 'TAP_DAMAGE',
    description: 'An ancient gold seal with a flawless ruby prism. Increases Click Damage by +1200 flat and +60% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '1850000',
    costMultiplier: 1.20,
    baseValue: 1200,
    valueMultiplierPerLevel: 0.60,
    colorHex: '#e11d48' // Rose-600
  },
  {
    id: 'poison_nova_hydra',
    name: 'Sângele Hidrei (Hydra Blood Tonic)',
    type: 'POISON_DPS',
    description: 'A noxious brew that corrodes anything it touches. Deals 900 Poison damage/sec, increases by +65% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '2200000',
    costMultiplier: 1.21,
    baseValue: 900,
    valueMultiplierPerLevel: 0.65,
    colorHex: '#15803d' // Green-700
  },
  {
    id: 'earth_crater_core',
    name: 'Mantie Tectonică (Core Fissure Mantle)',
    type: 'EARTH_BURST',
    description: 'Active volcanic dust flowing around your boots. Deals 7500 Earth damage every 4s, +75% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '2700000',
    costMultiplier: 1.22,
    baseValue: 7500,
    valueMultiplierPerLevel: 0.75,
    colorHex: '#ea580c' // Orange-600
  },
  {
    id: 'ice_glacier_star',
    name: 'Inima Stelei Înghețate (Frozen Star Core)',
    type: 'ICE_CHILL',
    description: 'The cold matter of a fallen stellar body. Deals 1300 Ice damage/sec, increases slows/debuffs by +70% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '3300000',
    costMultiplier: 1.22,
    baseValue: 1300,
    valueMultiplierPerLevel: 0.7,
    colorHex: '#0891b2' // Cyan-600
  },
  {
    id: 'gold_royal_crown',
    name: 'Coroana Solarei (Crown of Golden Dawn)',
    type: 'GOLD_BOOST',
    description: 'The lost crown of Solarei\'s solar monarchy. Increases all Gold dropped by +250% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '4000000',
    costMultiplier: 1.24,
    baseValue: 2.5,
    valueMultiplierPerLevel: 2.2,
    colorHex: '#fbbf24' // Yellow-400
  },
  {
    id: 'boss_slayer_analyzer',
    name: 'Căutătorul de Slăbiciuni (Weakpoint Analyzer)',
    type: 'BOSS_SHRED',
    description: 'An advanced optical lens displaying atomic structural weakpoints. Deals +80% extra damage against Bosses per level.',
    chestTier: 'legendary',
    baseUnlockCost: '5000000',
    costMultiplier: 1.21,
    baseValue: 0.8,
    valueMultiplierPerLevel: 0.8,
    colorHex: '#ef4444' // Red-500
  },
  {
    id: 'tap_hero_gauntlets',
    name: 'Mănușile Runice (Runic Gauntlets of Auraria)',
    type: 'TAP_DAMAGE',
    description: 'Gauntlets pulsing with elder arcane inscriptions. Increases Click Damage by +1100 flat and +58% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '6200000',
    costMultiplier: 1.20,
    baseValue: 1100,
    valueMultiplierPerLevel: 0.58,
    colorHex: '#6366f1' // Indigo-500
  },
  {
    id: 'poison_apocalypse_void',
    name: 'Veninul Infinit (Voidspore Cloud)',
    type: 'POISON_DPS',
    description: 'Cosmic void dust that eats organic tissues instantly. Deals 950 Poison damage/sec, increases by +62% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '7500000',
    costMultiplier: 1.21,
    baseValue: 950,
    valueMultiplierPerLevel: 0.62,
    colorHex: '#14532d' // Green-950
  },
  {
    id: 'earth_meteor_starfall',
    name: 'Meteorul Prăbușit (Roakk Starfall Fragment)',
    type: 'EARTH_BURST',
    description: 'A heavy celestial stone radiating deep gravitational heat. Deals 8000 Earth damage every 4s, +80% per level.',
    chestTier: 'legendary',
    baseUnlockCost: '9500000',
    costMultiplier: 1.22,
    baseValue: 8000,
    valueMultiplierPerLevel: 0.8,
    colorHex: '#ca8a04' // Yellow-700
  },

  // ==========================================
  // --- GUILD EXCLUSIVE CARDS (15 CARDS) ---
  // ==========================================
  {
    id: 'guild_synergy',
    name: 'Jurământul din Aurenor (Aurenor Return Oath)',
    type: 'GUILD_BOOST',
    description: "Solmour's silent promise to return and restore Solarei's light. Increases Guild Points gained on reset by +50% per level.",
    chestTier: 'guild',
    baseUnlockCost: '25', // GP
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
    baseUnlockCost: '30', // GP
    costMultiplier: 1.25,
    baseValue: 3.0,
    valueMultiplierPerLevel: 3.0,
    colorHex: '#e11d48' // Rose-600
  },
  {
    id: 'guild_damage_pike',
    name: 'Sulița Generalului (General\'s Brass Pike)',
    type: 'TAP_DAMAGE',
    description: 'Commanding spear of the High Marshal. Increases Click Damage by +2000 flat and +70% per level.',
    chestTier: 'guild',
    baseUnlockCost: '35',
    costMultiplier: 1.26,
    baseValue: 2000,
    valueMultiplierPerLevel: 0.7,
    colorHex: '#e11d48' // Rose-600
  },
  {
    id: 'guild_poison_standard',
    name: 'Rețeta Alchimisților (Apothecaries Standard)',
    type: 'POISON_DPS',
    description: 'Guild-exclusive formula for military-grade acids. Deals 1800 Poison damage/sec, increases by +80% per level.',
    chestTier: 'guild',
    baseUnlockCost: '40',
    costMultiplier: 1.26,
    baseValue: 1800,
    valueMultiplierPerLevel: 0.8,
    colorHex: '#a21caf' // Fuchsia-700
  },
  {
    id: 'guild_earth_pillar',
    name: 'Ancestralul Pământului (Earthcarver Pillar)',
    type: 'EARTH_BURST',
    description: 'Ancient mountain brick holding heavy leyline focus. Deals 15000 Earth damage every 4s, +90% per level.',
    chestTier: 'guild',
    baseUnlockCost: '45',
    costMultiplier: 1.27,
    baseValue: 15000,
    valueMultiplierPerLevel: 0.9,
    colorHex: '#be123c' // Rose-700
  },
  {
    id: 'guild_ice_staff',
    name: 'Vigorea Înghețată (Council Froststaff)',
    type: 'ICE_CHILL',
    description: 'Grand Councilor scepter freezing all nearby targets. Deals 2000 Ice damage/sec, slows by +85% per level.',
    chestTier: 'guild',
    baseUnlockCost: '50',
    costMultiplier: 1.27,
    baseValue: 2000,
    valueMultiplierPerLevel: 0.85,
    colorHex: '#f43f5e' // Rose-500
  },
  {
    id: 'guild_boss_banner',
    name: 'Furia Breaslei (Guild Wrath Banner)',
    type: 'BOSS_SHRED',
    description: 'Rallying standard used in the ultimate dragon hunts. Deals +100% extra damage against Bosses per level.',
    chestTier: 'guild',
    baseUnlockCost: '55',
    costMultiplier: 1.26,
    baseValue: 1.0,
    valueMultiplierPerLevel: 1.0,
    colorHex: '#fda4af' // Rose-300
  },
  {
    id: 'guild_synergy_alliance',
    name: 'Alianța Secretă (The Secret Alliance Pact)',
    type: 'GUILD_BOOST',
    description: 'Undersigned pact of the subterranean council. Increases Guild Points gained on reset by +60% per level.',
    chestTier: 'guild',
    baseUnlockCost: '60',
    costMultiplier: 1.25,
    baseValue: 0.6,
    valueMultiplierPerLevel: 0.6,
    colorHex: '#f472b6' // Pink-400
  },
  {
    id: 'guild_gold_vault_deeds',
    name: 'Trezoreria Breaslei (Guild Vault Deeds)',
    type: 'GOLD_BOOST',
    description: 'Shared wealth ownership from High Sanctury. Adds +400% Gold Find multiplier per level.',
    chestTier: 'guild',
    baseUnlockCost: '70',
    costMultiplier: 1.25,
    baseValue: 4.0,
    valueMultiplierPerLevel: 4.0,
    colorHex: '#fb7185' // Rose-400
  },
  {
    id: 'guild_tap_bulwark',
    name: 'Răsunetul Luptei (Aurenor Steel Bulwark)',
    type: 'TAP_DAMAGE',
    description: 'A divine shield projecting crushing force waves. Increases Click Damage by +2500 flat and +75% per level.',
    chestTier: 'guild',
    baseUnlockCost: '80',
    costMultiplier: 1.26,
    baseValue: 2500,
    valueMultiplierPerLevel: 0.75,
    colorHex: '#e11d48' // Rose-600
  },
  {
    id: 'guild_poison_fangs',
    name: 'Amurgul Scuipător (Twilight Viper Fangs)',
    type: 'POISON_DPS',
    description: 'Honed daggers saturated with concentrated viper toxins. Deals 2200 Poison damage/sec, increases by +85% per level.',
    chestTier: 'guild',
    baseUnlockCost: '95',
    costMultiplier: 1.26,
    baseValue: 2200,
    valueMultiplierPerLevel: 0.85,
    colorHex: '#db2777' // Pink-600
  },
  {
    id: 'guild_earth_corestone',
    name: 'Smaraldul din Roakk (Citadel Corestone)',
    type: 'EARTH_BURST',
    description: 'Heavy core of a mountain citadel containing concentrated tectonic power. Deals 18000 Earth damage every 4s, +95% per level.',
    chestTier: 'guild',
    baseUnlockCost: '110',
    costMultiplier: 1.27,
    baseValue: 18000,
    valueMultiplierPerLevel: 0.95,
    colorHex: '#9f1239' // Rose-800
  },
  {
    id: 'guild_ice_rimelord',
    name: 'Viscolul din Tharnor (Rime Lord Core)',
    type: 'ICE_CHILL',
    description: 'An iced sphere pulsating with ancient rime storm energy. Deals 2400 Ice damage/sec, slows by +90% per level.',
    chestTier: 'guild',
    baseUnlockCost: '130',
    costMultiplier: 1.27,
    baseValue: 2400,
    valueMultiplierPerLevel: 0.9,
    colorHex: '#f43f5e' // Rose-500
  },
  {
    id: 'guild_boss_executioner',
    name: 'Insigna Executorului (Council Executioner Seal)',
    type: 'BOSS_SHRED',
    description: 'Lethal executioner seal dealing massive vulnerabilities on the highest targets. Deals +120% extra damage against Bosses per level.',
    chestTier: 'guild',
    baseUnlockCost: '150',
    costMultiplier: 1.26,
    baseValue: 1.2,
    valueMultiplierPerLevel: 1.2,
    colorHex: '#fda4af' // Rose-300
  },
  {
    id: 'guild_synergy_edict',
    name: 'Decretul Consiliului (Grand Marshal Edict)',
    type: 'GUILD_BOOST',
    description: 'Command decree authorized by the Grand Marshal. Increases Guild Points gained on reset by +70% per level.',
    chestTier: 'guild',
    baseUnlockCost: '180',
    costMultiplier: 1.25,
    baseValue: 0.7,
    valueMultiplierPerLevel: 0.7,
    colorHex: '#f472b6' // Pink-400
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
