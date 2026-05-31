/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslationDictionary {
  GOLD: string;
  GUILD: string;
  MENU: string;
  AUTO: string;
  FIGHT_BOSS: string;
  SAVE: string;
  SETTINGS: string;
  SYSTEMS_CODES: string;
  MUTE_AUDIO: string;
  UNMUTE_AUDIO: string;
  SAVE_PROGRESS: string;
  EXPORT_SAVE: string;
  IMPORT_SAVE: string;
  WIPE_SAVE: string;
  LANGUAGE_LABEL: string;
  ACTIVE_LANG: string;
  WIPE_CONFIRM: string;
  QUICK_HINT: string;
  QUICK_HINT_DESC: string;
  TAB_CARDS: string;
  TAB_SYNERGY: string;
  TAB_BATTLE: string;
  TAB_GUILD: string;
  TAB_STATS: string;
  DUNGEON_RUN_ANALYTICS: string;
  TIME_ADVENTURING: string;
  TOTAL_CLICKS: string;
  MONSTERS_DEFEATED: string;
  BOSSES_SLAIN: string;
  GOLD_EARNED: string;
  PRESTIGE_RESURRECTS: string;
  MAX_STAGE: string;
  CONFRUNTAREA_UMBREI: string;
  CREATURE_DUNGEON: string;
  TAP_TO_COLOR: string;
  OFFLINE_TITLE: string;
  OFFLINE_AWAY: string;
  OFFLINE_EARNED: string;
  CLAIM: string;
  GUILD_TITLE: string;
  GUILD_SUB: string;
  SELECT_FOCUS: string;
  CURRENT_GUILD_LEVEL: string;
  GUILD_WARRIOR_NAME: string;
  GUILD_WARRIOR_DESC: string;
  GUILD_MERCHANT_NAME: string;
  GUILD_MERCHANT_DESC: string;
  GUILD_MAGIC_NAME: string;
  GUILD_MAGIC_DESC: string;
  PERKS_SECTION: string;
  PERKS_SUB: string;
  BUY_BUY: string;
  PERK_MAXED: string;
  GP_REQUIRED: string;
  RESET_CONFIRM_TITLE: string;
  RESET_ACTIVE: string;
  RESET_RETAIN: string;
  RESET_REWARDS_GP: string;
  RESET_DO_IT: string;
  RESET_CLOSE: string;
  ALIGNMENT_EARNED: string;
  UNALIGNED_WARN: string;
  STAGE_REQUIRED_RESET: string;
  CARD_SHOP: string;
  CARDS_SUB: string;
  BUY_SATCHEL: string;
  SATCHELS_TIER_DESC_COMMON: string;
  SATCHELS_TIER_DESC_RARE: string;
  SATCHELS_TIER_DESC_LEGENDARY: string;
  SATCHELS_TIER_DESC_GUILD: string;
  CURRENT_BONUS: string;
  UPGRADE_COST: string;
  MAX_UPGRADED_LEVEL: string;
  LEVEL_UP_LABEL: string;
  NOT_UNLOCKED: string;
  UNPACK_HEADER: string;
  UNPACK_NEW: string;
  UNPACK_LEVELUP: string;
  UNPACK_TAP: string;
  AUTO_ADVANCE_DESC: string;
  CHEST_COMMON_NAME: string;
  CHEST_RARE_NAME: string;
  CHEST_LEGENDARY_NAME: string;
  CHEST_GUILD_NAME: string;
}

export const translations: Record<'en' | 'ro', TranslationDictionary> = {
  en: {
    GOLD: "GOLD",
    GUILD: "GUILD",
    MENU: "MENU",
    AUTO: "AUTO",
    FIGHT_BOSS: "FIGHT BOSS",
    SAVE: "SAVE",
    SETTINGS: "SETTINGS",
    SYSTEMS_CODES: "SETTINGS & UTILITIES",
    MUTE_AUDIO: "Mute Audio",
    UNMUTE_AUDIO: "Unmute Audio",
    SAVE_PROGRESS: "Save Progress",
    EXPORT_SAVE: "Export Save",
    IMPORT_SAVE: "Import Save",
    WIPE_SAVE: "Wipe Save Data",
    LANGUAGE_LABEL: "Switch Language",
    ACTIVE_LANG: "English (EN)",
    WIPE_CONFIRM: "Are you absolutely sure you want to Wipe All Save Data? This will permanently delete your progression, gold, card levels, and prestige points!",
    QUICK_HINT: "ELDRIN'S QUICK ADVICE",
    QUICK_HINT_DESC: "Defeating generic monsters clears your path towards the Generali of the Shadow Realm. Soft-resets at Thalorion's Council grant dynamic master ranks & permanent vestiges that do not disappear!",
    TAB_CARDS: "Relics & Chests",
    TAB_SYNERGY: "Synergies",
    TAB_BATTLE: "Battle Arena",
    TAB_GUILD: "Council Resets",
    TAB_STATS: "Dungeon Stats",
    DUNGEON_RUN_ANALYTICS: "THALORION TRAINING DATA",
    TIME_ADVENTURING: "Time Adventuring:",
    TOTAL_CLICKS: "Total Weapon Clicks:",
    MONSTERS_DEFEATED: "Shadow Guards Defeated:",
    BOSSES_SLAIN: "Realm Generali Slain:",
    GOLD_EARNED: "Total Gold Collected:",
    PRESTIGE_RESURRECTS: "Thalorion Reset Initiations:",
    MAX_STAGE: "Max Stage Level Reached:",
    CONFRUNTAREA_UMBREI: "CONFRONTING THE SHADOW",
    CREATURE_DUNGEON: "SOLMOUR'S JOURNEY",
    TAP_TO_COLOR: "TAP TO STRIKE & SHRED THE DARK!",
    OFFLINE_TITLE: "Welcome Back, Prince Solmour!",
    OFFLINE_AWAY: "You were away from Aurenor for",
    OFFLINE_EARNED: "passive training in the Five Great Arts harvested basic gold reserves:",
    CLAIM: "Gather Off-Line Gold",
    GUILD_TITLE: "Council of Thalorion (Prestige)",
    GUILD_SUB: "Perform a soft-reset of temporary stage speeds and gold to align Solmour with legendary masters of the Five Great Arts.",
    SELECT_FOCUS: "Select Solmour's Academic Focus at Thalorion:",
    CURRENT_GUILD_LEVEL: "Current Rank:",
    GUILD_WARRIOR_NAME: "The Art of Combat (Warrior)",
    GUILD_WARRIOR_DESC: "Guided by Dwarf Master Kael. Increases total damage by +100% per rank and boosts passive elements tick speed by +15%.",
    GUILD_MERCHANT_NAME: "Alchemy & History (Alchemic)",
    GUILD_MERCHANT_DESC: "Guided by Elf Master Elara & Human Master Sophia. Increases gold multiplier by +150% per rank.",
    GUILD_MAGIC_NAME: "Art of Magic & Runes (Arcane)",
    GUILD_MAGIC_DESC: "Guided by Beastkin Master Elaria & Giant Master Grim. Accelerates and buffs active elemental DPS ticking by +15% per rank.",
    PERKS_SECTION: "PERMANENT VESTIGES & AMULETS",
    PERKS_SUB: "These permanent high-end legacy blessings do NOT get reset when you prestige again!",
    BUY_BUY: "Purchase / Upgrade for",
    PERK_MAXED: "MAX RANK",
    GP_REQUIRED: "Requires",
    RESET_CONFIRM_TITLE: "COMMIT ACADEMIC RESET?",
    RESET_ACTIVE: "You are actively choosing to soft-reset your temporary combat progress to gain high-level Academic status in this discipline.",
    RESET_RETAIN: "You will retain ALL unlocked cards, cards levels, silver levels, and permanent vestiges, but current gold and stage return to start.",
    RESET_REWARDS_GP: "Academic Experience (GP) to be gained:",
    RESET_DO_IT: "ACCEDE TO THE INITIATION (RESET!)",
    RESET_CLOSE: "Close / Delay",
    ALIGNMENT_EARNED: "ACTIVE FOCUS:",
    UNALIGNED_WARN: "You are currently in Exile. Reach Stage 5 or higher to align at the Council!",
    STAGE_REQUIRED_RESET: "REQUIRES STAGE 5 OR HIGHER FOR RESET",
    CARD_SHOP: "Relics & Satchels (Realms Satchels)",
    CARDS_SUB: "Unlock and upgrade ancient tools of power, companions, and remnants from the five kingdoms to assist Solmour.",
    BUY_SATCHEL: "Buy Chest",
    SATCHELS_TIER_DESC_COMMON: "Yields random card items of common rarity.",
    SATCHELS_TIER_DESC_RARE: "Yields random card items of rare rarity.",
    SATCHELS_TIER_DESC_LEGENDARY: "Vault of the five sacred vestiges. Gurantees rare/legendary card items.",
    SATCHELS_TIER_DESC_GUILD: "Guarantees exclusive Academic cards of the Thalorion guild.",
    CURRENT_BONUS: "Current Bonus:",
    UPGRADE_COST: "Upgrade Cost:",
    MAX_UPGRADED_LEVEL: "MAX LEVEL",
    LEVEL_UP_LABEL: "Upgrade Relic",
    NOT_UNLOCKED: "LOCKED (Acquire standard satchel packs to unlock)",
    UNPACK_HEADER: "NEW LEGENDARY REVELATION UNPACKED!",
    UNPACK_NEW: "NEW RELIC ADDED",
    UNPACK_LEVELUP: "RELIC LEVEL UPGRADED",
    UNPACK_TAP: "Tap card or background to dismiss",
    AUTO_ADVANCE_DESC: "Dethrone to advance",
    CHEST_COMMON_NAME: "Exile Satchel",
    CHEST_RARE_NAME: "Elven Chest",
    CHEST_LEGENDARY_NAME: "Vault of Vestiges",
    CHEST_GUILD_NAME: "Thalorion Strongbox",
  },
  ro: {
    GOLD: "AUR",
    GUILD: "BRESLA",
    MENU: "MENIU",
    AUTO: "AUTO",
    FIGHT_BOSS: "LUPTĂ BOSS",
    SAVE: "SALVEAZĂ",
    SETTINGS: "SETĂRI",
    SYSTEMS_CODES: "SETĂRI ȘI UTILITĂȚI",
    MUTE_AUDIO: "Oprește Sunetul",
    UNMUTE_AUDIO: "Pornește Sunetul",
    SAVE_PROGRESS: "Salvează Progresul",
    EXPORT_SAVE: "Exportă Salvarea",
    IMPORT_SAVE: "Importă Salvarea",
    WIPE_SAVE: "Șterge Progresul",
    LANGUAGE_LABEL: "Schimbă Limba",
    ACTIVE_LANG: "Română (RO)",
    WIPE_CONFIRM: "Ești absolut sigur că vrei să ștergi TOATE datele salvate? Această acțiune va șterge permanent progresul, aurul, nivelul cărților și punctele de breslă!",
    QUICK_HINT: "SFATUL LUI ELDRIN",
    QUICK_HINT_DESC: "Înfrângerea gărzilor curăță drumul către Generalii Umbrei. Inițierile la Consiliul de la Thalorion deblochează specializări permanente și amulete legendare ce supraviețuiesc soft-reseturilor!",
    TAB_CARDS: "Relicve & Cufere",
    TAB_SYNERGY: "Sinergii",
    TAB_BATTLE: "Arena de Luptă",
    TAB_GUILD: "Consiliu (Resets)",
    TAB_STATS: "Statistici Run",
    DUNGEON_RUN_ANALYTICS: "ANALITICA ANTRENAMENTULUI",
    TIME_ADVENTURING: "Călătorind de:",
    TOTAL_CLICKS: "Lovituri aplicate:",
    MONSTERS_DEFEATED: "Gărzi ale Umbrei înfrânte:",
    BOSSES_SLAIN: "Generali de Facțiune înfrânți:",
    GOLD_EARNED: "Aur total colectat:",
    PRESTIGE_RESURRECTS: "Reveniri la Consiliu:",
    MAX_STAGE: "Stagiul maxim atins:",
    CONFRUNTAREA_UMBREI: "CONFRUNTAREA UMBREI",
    CREATURE_DUNGEON: "CĂLĂTORIA LUI SOLMOUR",
    TAP_TO_COLOR: "ATINGE PENTRU A ADUCE LUMINA ŞI A LOVI!",
    OFFLINE_TITLE: "Bine ai revenit, Prințule Solmour!",
    OFFLINE_AWAY: "Ai lipsit de la curtea din Aurenor timp de",
    OFFLINE_EARNED: "antrenamentul pasiv offline în cele cinci Arte Mari ți-a adus rezerve de aur:",
    CLAIM: "Colectează Aurul",
    GUILD_TITLE: "Consiliul de la Thalorion (Prestigiu)",
    GUILD_SUB: "Resetul academic curăță stagiile și aurul temporar pentru a-și specializa aura de forță a lui Solmour în artele lăsate de preoți.",
    SELECT_FOCUS: "Selectează focusul academic al lui Solmour la Thalorion:",
    CURRENT_GUILD_LEVEL: "Rang Curent:",
    GUILD_WARRIOR_NAME: "Arta Luptelor (Combat)",
    GUILD_WARRIOR_DESC: "Ghidat de Maestrul Kael din Munții Roakk. Crește daunele totale cu 100% per rang și oferă +15% viteză bătăilor pasive.",
    GUILD_MERCHANT_NAME: "Alchimie & Istorie (Alchemic)",
    GUILD_MERCHANT_DESC: "Ghidat de Maestrul Elara din Sylvanar și Sophia din Solarei. Crește multiplicatorul de aur global cu 150% la fiecare rang.",
    GUILD_MAGIC_NAME: "Arta Magiei & Runelor",
    GUILD_MAGIC_DESC: "Ghidat de Maestrul Elaria și Giant Master Grim. Accelerează efectele pasive ale tuturor elementelor magice cu +15% per rang.",
    PERKS_SECTION: "VESTIGII PERMANENTE ȘI AMULETE",
    PERKS_SUB: "Aceste amulete și binecuvântări regale permanente NU sunt șterse la resetările de prestigiu!",
    BUY_BUY: "Studiază / Upgradează cu",
    PERK_MAXED: "RANG MAXIM",
    GP_REQUIRED: "Necesită",
    RESET_CONFIRM_TITLE: "CONFIRMĂ DECIZIA DE RESET ȘI STUDIU",
    RESET_ACTIVE: "Ești pe cale să reinițializezi stagiul curent și aurul pentru a fi inițiat în această artă a spiritului la Turnul Echilibrului.",
    RESET_RETAIN: "Vei păstra TOATE cărțile deblocate, nivelele, upgrade-ul de argint și amuletele permanente, dar aurul și viteza etapei vor reporni.",
    RESET_REWARDS_GP: "Experiență Academică (GP) acumulată la reset:",
    RESET_DO_IT: "ACCEPTĂ INIȚIEREA REPREZENTATIVĂ (RESET!)",
    RESET_CLOSE: "Mai așteaptă",
    ALIGNMENT_EARNED: "SPECIALIZARE ACTIVĂ:",
    UNALIGNED_WARN: "Momentan ești neinițiat (Exilat). Depășește stagiul 5 pentru a debloca admiterile Consiliului!",
    STAGE_REQUIRED_RESET: "NECESITĂ MINIM STAGIUL 5 PENTRU INIȚIERE",
    CARD_SHOP: "Magazinul de Cărți & Realms Satchels",
    CARDS_SUB: "Deblochează și upgradează artefacte din interiorul regatelor pentru a mări puterea și rezistența noului prinț.",
    BUY_SATCHEL: "Cumpără Sac",
    SATCHELS_TIER_DESC_COMMON: "Conține relicve și aliați din rarități elementare (Common).",
    SATCHELS_TIER_DESC_RARE: "Conține relicve și piese de gradul rar (Rare).",
    SATCHELS_TIER_DESC_LEGENDARY: "Cripta celor cinci vestigii regale. Garantează relicve de nivel ridicat.",
    SATCHELS_TIER_DESC_GUILD: "Garantează cărți de expansiune breslașe de la Thalorion.",
    CURRENT_BONUS: "Efect Actual:",
    UPGRADE_COST: "Cost Îmbunătățire:",
    MAX_UPGRADED_LEVEL: "NIVEL MAXIM",
    LEVEL_UP_LABEL: "Îmbunătățește Relicva",
    NOT_UNLOCKED: "BLOCAT (Deschide sacii elementari pentru a debloca)",
    UNPACK_HEADER: "FELICITĂRI! O NOUĂ BILECUȚĂ A FOST DESTRĂMATĂ!",
    UNPACK_NEW: "RELICVĂ DETALIAZĂ",
    UNPACK_LEVELUP: "RELICVA A FOST UPGRADATĂ",
    UNPACK_TAP: "Click pe fundal pentru a continua",
    AUTO_ADVANCE_DESC: "Înfrânge pentru a avansa",
    CHEST_COMMON_NAME: "Rucsac Modest de Exil",
    CHEST_RARE_NAME: "Cufărul Elfilor din Silvarel",
    CHEST_LEGENDARY_NAME: "Cripta celor Cinci Vestigii",
    CHEST_GUILD_NAME: "Cufărul de la Thalorion",
  }
};

export const cardNames: Record<string, Record<'en' | 'ro', { name: string; description: string }>> = {
  tap_novice: {
    en: {
      name: "Solarian Training Blade",
      description: "Solmour's simple training iron blade from Aurenor's sparring yards. Increases Click Damage by +5 flat and +10% per level."
    },
    ro: {
      name: "Pumnalul Solarian",
      description: "Sabia simplă de fier a lui Solmour din curțile de antrenament din Aurenor. Crește daunele din click cu +5 flat și +10% pe nivel."
    }
  },
  poison_cloud: {
    en: {
      name: "Duskari Poison Mist",
      description: "Summons toxic mist from Draenos's dark realm of Duskari. Deals 2 Poison damage/sec, increases by +12% per level."
    },
    ro: {
      name: "Mările de Otravă din Duskari",
      description: "Invocă ceață toxică din regatul umbrelor Duskari acaparat de Draenos. Provoacă 2 daune de otravă pe secundă, +12% pe nivel."
    }
  },
  earth_pebble: {
    en: {
      name: "Roakk Pebble Sling",
      description: "Crafted by the twin smith Brundar. Triggers earth spikes dealing 12 damage every 4s, +15% per level."
    },
    ro: {
      name: "Sling de Mină din Roakk",
      description: "Făurită de geamănul de la forjă Brundar. Invocă țepi de piatră provocând 12 daune la fiecare 4 secunde, +15% pe nivel."
    }
  },
  ice_frost: {
    en: {
      name: "Silvarel Forest Ice Spark",
      description: "Chilled essence from the elven forests of Silvarel. Deals 1.5 Ice damage/sec, slows enemy HP regeneration by +5% per level."
    },
    ro: {
      name: "Gheața Sacră din Silvarel",
      description: "Esență înghețată extrasă din codrii elfilor din Silvarel. Oferă 1.5 daune de gheață pe secundă și încetinește regenerarea inamicilor cu +5% pe nivel."
    }
  },
  gold_magnet: {
    en: {
      name: "Maelis's Scarf",
      description: "The golden silk scarf left by sister Maelis. Solmour's warm link to his home. Increases all Gold drops by +15% per level."
    },
    ro: {
      name: "Eșarfa Mătăsoasă a lui Maelis",
      description: "Eșarfa din mătase și fir de aur cusută de Maelis. Legătura caldă din inima lui Solmour. Crește tot aurul colectat cu +15% pe nivel."
    }
  },
  tap_warrior: {
    en: {
      name: "Kael's Combat Gauntlets",
      description: "Sledge-forged bronze knuckles approved by Kael, Guardian of Fight. Increases Click Damage by +60 flat and +22% per level."
    },
    ro: {
      name: "Mănușile Combatante ale lui Kael",
      description: "Mănuși grele din bronz pentru bătăi aspre supervizate de Kael, Maestrul Luptelor. Crește daunele din click cu +60 flat și +22% pe nivel."
    }
  },
  poison_bite: {
    en: {
      name: "Akesha's Feline Claws",
      description: "Lethal retractables honed in the dueling trees of Aeraris. Deals 35 Poison damage/sec, increases by +25% per level."
    },
    ro: {
      name: "Ghearele Akeshei",
      description: "Gheare retractabile ascuțite în ritualurile din regatul Aeraris. Provoacă 35 daune de otravă pe secundă și cresc cu +25% pe nivel."
    }
  },
  earth_boulder: {
    en: {
      name: "Orm's Rock Mace",
      description: "Swung by Orm, the steadfast bear champion of Beastkin. Triggers Pebble Smash dealing 240 damage every 4s, +30% per level."
    },
    ro: {
      name: "Buzduganul lui Orm",
      description: "Mânuit de solidul gardian Orm din rândul ursilor. Lovește pământul provocând 240 daune la fiecare 4 secunde, +30% pe nivel."
    }
  },
  ice_blizzard: {
    en: {
      name: "Iven's Archivist Journal",
      description: "Written by the quiet savant of Tharnor. Deals 40 Ice dps, reduces healing and slows by +28% per level."
    },
    ro: {
      name: "Cronicile Ghidate ale lui Iven",
      description: "Scrise de liniștitul savant din Tharnor. Provoacă 40 daune de gheață/sec, încetinind substanțial vindecarea cu +28% pe nivel."
    }
  },
  boss_buster: {
    en: {
      name: "Kaelan's Royal Rivalry",
      description: "Solmour's older brother whose hateful challenge drives Solmour to conquer all bosses. Deals +40% extra damage against Bosses per level."
    },
    ro: {
      name: "Ura și Orgoliul lui Kaelan",
      description: "Provocările aspre ale fratelui mai mare din Aurenor, care-l motivează pe Solmour. Face cu +40% mai mari daunele împotriva Generali Boss la fiecare nivel."
    }
  },
  tap_hero: {
    en: {
      name: "Luna Moonbow",
      description: "The Sylvanar Tree of Life bow given to elf archer Thalion. Increases Click Damage by +1000 flat and +55% per level."
    },
    ro: {
      name: "Arcana Lunii (Arcul Lunethiel)",
      description: "Arcul mitic făcut din Arborele Vieții încredințat arcașului elf Thalion. Oferă +1000 daune click de bază și +55% pe nivel."
    }
  },
  poison_apocalypse: {
    en: {
      name: "Aeliana's Sky Ribbon",
      description: "Woven from raw thunder clouds by Aeliana of Aeraris. Deals 850 Poison damage/sec, increases by +60% per level."
    },
    ro: {
      name: "Panglica Vântului a Aelianei",
      description: "Împletită din nori de furtună și pene sacre. Provoacă 850 daune de otravă/sec (daune ale vântului), +60% pe nivel."
    }
  },
  earth_quaker: {
    en: {
      name: "Borin's Deep Hammer",
      description: "Borin's legendary hammer made of the red iron of Roakk. Deals 6800 Earth damage every 4s, +70% per level."
    },
    ro: {
      name: "Ciocanul Adâncului al lui Borin",
      description: "Ciocanul de forjă al războinicului gnom Borin. Prăbușește scoarța provocând 6800 daune la fiecare 4s, +70% pe nivel."
    }
  },
  ice_absolute_zero: {
    en: {
      name: "Kaelor's Thunder Stone",
      description: "A frozen lightning strike carried by giant Kaelor of Tharnor. Deals 1200 Ice damage/sec, increases click vulnerability by +65% per level."
    },
    ro: {
      name: "Piatra Tunetului a lui Kaelor",
      description: "Un fragment dintr-un fulger înghețat dus de gigantul Kaelor din Tharnor. Deals 1200 daune gheață/sec, mărind vulnerabilitatea la click cu +65% pe nivel."
    }
  },
  gold_vault: {
    en: {
      name: "Liora's Healing Crystal",
      description: "The legendary warm crystal held by Isolde, reflecting Queen Liora's kindness. Increases all Gold dropped by +200% per level."
    },
    ro: {
      name: "Cristalul Lioraei",
      description: "Cristalul de vindecare din lacrima Zeiței deținut de sora Isolde. Reflectă blândețea reginei mame Liora. Ridică aurul picat cu +200% pe nivel."
    }
  },
  guild_synergy: {
    en: {
      name: "Aurenor Return Oath",
      description: "Solmour's silent promise to return and restore Solarei's light. Increases Guild Points gained on reset by +50% per level."
    },
    ro: {
      name: "Jurământul din Aurenor",
      description: "Promisiunea mută a lui Solmour de a reveni și de a restabili lumina în Solarei. Crește punctele de breslă (GP) primite la reset cu 50% pe nivel."
    }
  },
  guild_gold: {
    en: {
      name: "The Five Realms Treaty",
      description: "The golden treaty signed under Malenar's vision. Adds +300% Gold Find multiplier per level."
    },
    ro: {
      name: "Tratatul celor Cinci Regate",
      description: "Mărețul tratat de unitate impus de magicianul Malenar. Adaugă +300% multiplicator la aurul prădat pe nivel."
    }
  }
};

export const perkNames: Record<string, Record<'en' | 'ro', { name: string; description: string }>> = {
  ironGrip: {
    en: {
      name: "Maelis's Amulet",
      description: "The golden medallion with a green crystal left by Maelis. Channels Solmour's inner warm resolve. Increases Click Power by +15 flat per level."
    },
    ro: {
      name: "Amuleta lui Maelis",
      description: "Medalionul din aur trimis de tânăra Maelis cu o piatră verzuie. Trezește forța caldă interioară a lui Solmour. Crește puterea loviturii (Click Power) cu +15 din oficiu pe nivel."
    }
  },
  midasTouch: {
    en: {
      name: "Thandor's Elixir",
      description: "The ancient dark elixir that sustains King Thandor's 1000-year reign. Start runs with post-exile gold reserves: +500 to +50K gold per level."
    },
    ro: {
      name: "Elixirul lui Thandor",
      description: "Elixirul din sala întunecată a lui Draenos care menține regele Thandor la viață de 1000 de ani. Începe fiecare run cu fonduri de aur trimise: +500 la +50K pe nivel."
    }
  },
  portalScroll: {
    en: {
      name: "Gate of Thalorion",
      description: "The ancient dimensional portal crafted by Malenar to split worlds. Allows you to start runs at +10% of your highest historical stage level."
    },
    ro: {
      name: "Poarta din Thalorion",
      description: "Mecanismul de trecere spațială creat la Thalorion. Îți permite să parcurgi direct +10% din stagiul maxim istoric deblocat la reinițializări."
    }
  },
  masterBuilder: {
    en: {
      name: "Dwarf Forge Mastery",
      description: "Signy and Brundar's master level ironworking from the Roakk Mines. Streamlines cards and chests upgrades, decreasing all GP/Gold costs by -6% per level."
    },
    ro: {
      name: "Măiestria Forjei Pitice",
      description: "Tehnicile ascuțite de făurire din minele Roakk furnizate de Torvin și Signy. Scade costurile de îmbunătățire pentru cărți și cufere cu -6% la fiecare nivel."
    }
  }
};
