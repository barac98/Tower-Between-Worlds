/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CardDefinition } from '../types/game';
import { CARD_TEMPLATES } from './gameData';

export interface SynergyDefinition {
  id: string;
  nameEn: string;
  nameRo: string;
  descriptionEn: string;
  descriptionRo: string;
  effectType: 'DPS' | 'TAP_DAMAGE' | 'GOLD' | 'BOSS_DAMAGE_GP';
  colorHexStart: string;
  colorHexEnd: string;
  // Card types that must be represented in the deck to trigger
  requiredTypes: string[];
}

export const SYNERGY_TEMPLATES: SynergyDefinition[] = [
  {
    id: 'corrosive_frost',
    nameEn: 'Corrosive Frost',
    nameRo: 'Ger Coroziv',
    descriptionEn: 'Fuses freezing essence with lethal poison to dissolve shadow hulls. Increases total passive DPS by +5% base, plus +0.1% per combined card level.',
    descriptionRo: 'Fuzionează esența înghețată cu otrava letală pentru a dizolva armura umbrelor. Crește DPS-ul pasiv total cu +5% de bază, plus +0.1% per nivel combinat.',
    effectType: 'DPS',
    colorHexStart: '#10b981', // green-500
    colorHexEnd: '#06b6d4', // cyan-500
    requiredTypes: ['POISON_DPS', 'ICE_CHILL']
  },
  {
    id: 'tectonic_strike',
    nameEn: 'Tectonic Strike',
    nameRo: 'Lovitură Tectonică',
    descriptionEn: 'Chuncky earth tremors coordinate with heavy slashes. Increases your Active Click Damage by +5% base, plus +0.1% per combined card level.',
    descriptionRo: 'Cutremurele terestre se coordonează cu loviturile grele de armă. Crește Puterea de Click activă cu +5% de bază, plus +0.1% per nivel combinat.',
    effectType: 'TAP_DAMAGE',
    colorHexStart: '#f59e0b', // amber-500
    colorHexEnd: '#94a3b8', // slate-400
    requiredTypes: ['EARTH_BURST', 'TAP_DAMAGE']
  },
  {
    id: 'alchemic_fortune',
    nameEn: 'Alchemic Transmutation',
    nameRo: 'Căutarea Alchimică',
    descriptionEn: 'Liquefies solid gold particles in vaporized toxic mist. Increases all Gold Drops by +5% base, plus +0.1% per combined card level.',
    descriptionRo: 'Lichefiază particulele de aur solid în ceața toxică vaporizată. Crește tot Aurul colectat cu +5% de bază, plus +0.1% per nivel combinat.',
    effectType: 'GOLD',
    colorHexStart: '#eab308', // yellow-500
    colorHexEnd: '#22c55e', // green-500
    requiredTypes: ['GOLD_BOOST', 'POISON_DPS']
  },
  {
    id: 'vanguard_accord',
    nameEn: 'Thalorion Alliance',
    nameRo: 'Alianța Thalorion',
    descriptionEn: 'The Council of five nations guides Solmours final strikes. Boosts Boss Damage and soft-reset GP gains by +5% base, plus +0.2% per combined card level.',
    descriptionRo: 'Consiliul celor cinci regate ghidează loviturile finale ale lui Solmour. Crește Dauna contra Boșilor și punctele GP câștigate cu +5% de bază, plus +0.2% per nivel combinat.',
    effectType: 'BOSS_DAMAGE_GP',
    colorHexStart: '#d946ef', // fuchsia-500
    colorHexEnd: '#ef4444', // red-500
    requiredTypes: ['GUILD_BOOST', 'BOSS_SHRED']
  }
];

export interface SynergyStatus {
  id: string;
  template: SynergyDefinition;
  isActive: boolean;
  combinedLevel: number;
  multiplier: number; // e.g. 1.05 or 1.15
  matchedCards: string[]; // Card IDs contributing to synergy
}

/**
 * Computes status of all synergies based on players currently owned/unlocked cards
 */
export function calculateSynergies(playerCardState: Record<string, { level: number; silverLevel: number }>): SynergyStatus[] {
  return SYNERGY_TEMPLATES.map(syn => {
    // Determine which cards player owns that match each required type
    const matchingUnlockedCards: CardDefinition[] = [];
    
    syn.requiredTypes.forEach(reqType => {
      // Find unlocked card of this type
      const cardsOfType = CARD_TEMPLATES.filter(c => c.type === reqType);
      cardsOfType.forEach(card => {
        if (playerCardState[card.id]) {
          matchingUnlockedCards.push(card);
        }
      });
    });

    // To be active, we must have at least one card of each required type unlocked.
    const hasEachRequiredType = syn.requiredTypes.every(reqType => {
      return matchingUnlockedCards.some(c => c.type === reqType);
    });

    const isActive = hasEachRequiredType;
    
    // Calculate combined level of ALL unlocked matching cards
    let combinedLevel = 0;
    const uniqueMatchedCardIds = new Set<string>();
    
    if (isActive) {
      matchingUnlockedCards.forEach(c => {
        const state = playerCardState[c.id];
        if (state) {
          combinedLevel += state.level;
          uniqueMatchedCardIds.add(c.id);
        }
      });
    }

    // Base bonus: +5% (0.05). Under vanguard accord we add larger boosts
    const baseBonus = 0.05;
    const perLevelBonus = syn.id === 'vanguard_accord' ? 0.002 : 0.001;
    
    const activeBonusPercentage = isActive 
      ? baseBonus + (combinedLevel * perLevelBonus)
      : 0;
      
    const multiplier = 1 + activeBonusPercentage;

    return {
      id: syn.id,
      template: syn,
      isActive,
      combinedLevel,
      multiplier,
      matchedCards: Array.from(uniqueMatchedCardIds)
    };
  });
}
