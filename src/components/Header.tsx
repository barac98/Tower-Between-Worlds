/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Coins, Award, Settings, Trash2, Download, Upload, Volume2, VolumeX, ShieldCheck, Languages } from 'lucide-react';
import { Decimal } from '../utils/decimal';
import { GuildType } from '../types/game';
import { translations } from '../utils/translations';

interface HeaderProps {
  gold: Decimal;
  guildPoints: Decimal;
  currentStage: number;
  stageProgress: number;
  isBossUnlocked: boolean;
  isBossMode: boolean;
  activeGuild: GuildType;
  soundOn: boolean;
  autoAdvance: boolean;
  language: 'en' | 'ro';
  onToggleSound: () => void;
  onToggleAutoAdvance: () => void;
  onSave: () => void;
  onHardReset: () => void;
  onExport: () => void;
  onImport: () => void;
  onTriggerBoss: () => void;
  onToggleLanguage: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  gold,
  guildPoints,
  currentStage,
  stageProgress,
  isBossUnlocked,
  isBossMode,
  activeGuild,
  soundOn,
  autoAdvance,
  language,
  onToggleSound,
  onToggleAutoAdvance,
  onSave,
  onHardReset,
  onExport,
  onImport,
  onTriggerBoss,
  onToggleLanguage,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = translations[language];

  // Guild descriptive labels & colors
  const guildDetails = {
    NONE: { 
      name: language === 'ro' ? 'EXILAT' : 'EXILE', 
      fullName: language === 'ro' ? 'NEALINIAT (PRINȚ EXILAT)' : 'UNALIGNED (EXILED PRINCE)', 
      color: 'text-slate-400 border-slate-800 bg-slate-950/40' 
    },
    WARRIOR: { 
      name: language === 'ro' ? 'COMBAT' : 'WARRIOR', 
      fullName: language === 'ro' ? 'ARTA LUPTELOR (COMBAT)' : 'ART OF COMBAT (WARRIOR)', 
      color: 'text-red-400 border-red-950 bg-red-950/20' 
    },
    MERCHANT: { 
      name: language === 'ro' ? 'ALCHIMIE' : 'POTIONS', 
      fullName: language === 'ro' ? 'ALCHIMIE & POTIUNI' : 'ALCHEMY & POTIONS', 
      color: 'text-amber-400 border-amber-950 bg-amber-950/20' 
    },
    MAGIC: { 
      name: language === 'ro' ? 'MAGIE' : 'MAGIC', 
      fullName: language === 'ro' ? 'ARTA MAGIEI & RUNELOR' : 'MAGIC & RUNES ART', 
      color: 'text-cyan-400 border-cyan-950 bg-cyan-950/20' 
    },
  };

  const currentGuild = guildDetails[activeGuild] || guildDetails.NONE;

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 border-b border-slate-800 shrink-0 select-none shadow-md" id="main-header">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 md:px-6 py-2.5 md:py-0 md:h-12 gap-3 md:gap-4">
        {/* Resource block */}
        <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            {/* Logo and Guild tag */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-xs sm:text-sm font-sans font-black tracking-tight text-white flex items-center gap-0.5" id="header-logo">
                <span className="text-amber-500">DPS</span>
                <span className="font-light text-slate-400">IDLE</span>
              </span>
              <div className={`text-[9px] sm:text-[9.5px]/none uppercase font-mono px-1 sm:px-1.5 py-0.5 sm:py-1 rounded border ${currentGuild.color}`}>
                <span className="hidden sm:inline">{currentGuild.fullName}</span>
                <span className="inline sm:hidden">{currentGuild.name}</span>
              </div>
            </div>

            {/* Gold Display */}
            <div className="flex items-center gap-1 sm:gap-1.5 pr-1.5 border-l border-slate-800 pl-2 sm:pl-3" title="Gold">
              <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] shrink-0 animate-pulse" />
              <span className="text-[11px] sm:text-xs md:text-sm font-mono font-bold text-slate-300 truncate">
                {t.GOLD}: <span className="text-amber-400 font-extrabold">{gold.format(1)}</span>
              </span>
            </div>

            {/* Guild Points Display */}
            <div className="flex items-center gap-1 sm:gap-1.5 border-l border-slate-800 pl-2 sm:pl-4" title="Guild Points">
              <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] shrink-0" />
              <span className="text-[11px] sm:text-xs md:text-sm font-mono font-bold text-slate-300 truncate">
                {t.GUILD}: <span className="text-cyan-400 font-extrabold">{guildPoints.format(1)}</span>
              </span>
            </div>
          </div>

          {/* Quick Menu button for Mobile layout */}
          <div className="flex md:hidden items-center gap-2 relative">
            <button
              id="settings-toggle-btn-mob"
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[11px] font-bold uppercase transition scale-95 cursor-pointer active:scale-90"
            >
              {t.MENU}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl z-50 py-1.5 animate-fade-in font-sans" id="settings-dropdown-mob">
                  <div className="px-3 py-1 border-b border-slate-850 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {t.SYSTEMS_CODES}
                  </div>
                  
                  {/* Language Switcher Button */}
                  <button
                    onClick={() => {
                      onToggleLanguage();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-900 transition text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Languages className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'en' ? 'English (EN)' : 'Română (RO)'}</span>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-850" />

                  {/* Sound Toggle */}
                  <button
                    onClick={() => {
                      onToggleSound();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 transition text-left"
                  >
                    {soundOn ? (
                      <>
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                        <span>{t.MUTE_AUDIO}</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4 text-slate-500" />
                        <span>{t.UNMUTE_AUDIO}</span>
                      </>
                    )}
                  </button>

                  {/* Manual Save */}
                  <button
                    onClick={() => {
                      onSave();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 transition text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>{t.SAVE_PROGRESS}</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  {/* Export String */}
                  <button
                    onClick={() => {
                      onExport();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 transition text-left"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>{t.EXPORT_SAVE}</span>
                  </button>

                  {/* Import String */}
                  <button
                    onClick={() => {
                      onImport();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 transition text-left"
                  >
                    <Upload className="w-4 h-4 text-violet-400" />
                    <span>{t.IMPORT_SAVE}</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  {/* Hard Reset */}
                  <button
                    onClick={() => {
                      if (confirm(t.WIPE_CONFIRM)) {
                        onHardReset();
                      }
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-300 transition text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.WIPE_SAVE}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center alignment: Stage level progress bar */}
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-black leading-tight flex items-center gap-1.5">
            {isBossMode ? (
              <span className="text-red-500 font-extrabold animate-pulse">
                {language === 'ro' ? `STAGIUL ${currentStage} - BOSS` : `STAGE ${currentStage} BOSS`}
              </span>
            ) : (
              <span>
                {language === 'ro' ? `STAGIUL ${currentStage}` : `STAGE ${currentStage}`}
              </span>
            )}
          </div>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden" title="Progress Bar">
            {!isBossMode ? (
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_8px_#22d3ee] transition-all duration-300" 
                style={{ width: `${(stageProgress / 10) * 100}%` }}
              />
            ) : (
              <div className="h-full bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_8px_#ef4444] animate-pulse" style={{ width: '100%' }} />
            )}
          </div>
        </div>

        {/* Action Controls & Option triggers */}
        <div className="hidden md:flex items-center gap-3">
          {/* Auto Advance Toggle */}
          <button
            id="auto-advance-btn"
            onClick={onToggleAutoAdvance}
            className={`px-3 py-1 rounded text-[10px] font-mono font-bold uppercase border cursor-pointer select-none transition ${
              autoAdvance 
                ? 'bg-cyan-950/40 text-cyan-450 border-cyan-850 hover:bg-cyan-950/60' 
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {t.AUTO}: {autoAdvance ? 'ON' : 'OFF'}
          </button>

          {/* Fight Boss Button (if available) */}
          {isBossUnlocked && !isBossMode && (
            <button
              id="fight-boss-btn"
              onClick={onTriggerBoss}
              className="px-3 py-1 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-550 hover:to-amber-550 text-white text-[10px] font-bold uppercase rounded border border-red-500 cursor-pointer animate-pulse"
            >
              {t.FIGHT_BOSS}
            </button>
          )}

          {/* Save trigger */}
          <button
            onClick={onSave}
            className="bg-emerald-600 hover:bg-emerald-550 px-3 py-1 rounded text-[10px] font-bold text-white border border-emerald-500 cursor-pointer"
          >
            {t.SAVE}
          </button>

          {/* Settings Trigger */}
          <div className="relative">
            <button
              id="settings-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="bg-slate-850 hover:bg-slate-800 px-3 py-1 rounded text-[10px] font-bold text-slate-350 border border-slate-755 cursor-pointer"
            >
              {t.SETTINGS}
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl z-50 py-1.5 animate-fade-in font-sans" id="settings-dropdown">
                  <div className="px-3 py-1 border-b border-slate-850 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    {t.SYSTEMS_CODES}
                  </div>
                  
                  {/* Language Switcher Button */}
                  <button
                    onClick={() => {
                      onToggleLanguage();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-900 transition text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <Languages className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'en' ? 'English (EN)' : 'Română (RO)'}</span>
                    </div>
                    <span className="text-[9px] px-1 bg-emerald-950 text-emerald-300 rounded border border-emerald-800 font-mono">
                      {language === 'en' ? 'EN' : 'RO'}
                    </span>
                  </button>

                  <div className="my-1 border-t border-slate-850" />

                  {/* Sound Toggle */}
                  <button
                    onClick={() => {
                      onToggleSound();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 transition text-left"
                  >
                    {soundOn ? (
                      <>
                        <Volume2 className="w-4 h-4 text-cyan-400" />
                        <span>{t.MUTE_AUDIO}</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4 text-slate-500" />
                        <span>{t.UNMUTE_AUDIO}</span>
                      </>
                    )}
                  </button>

                  {/* Manual Save */}
                  <button
                    onClick={() => {
                      onSave();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 transition text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>{t.SAVE_PROGRESS}</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  {/* Export String */}
                  <button
                    onClick={() => {
                      onExport();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 transition text-left"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>{t.EXPORT_SAVE}</span>
                  </button>

                  {/* Import String */}
                  <button
                    onClick={() => {
                      onImport();
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900 transition text-left"
                  >
                    <Upload className="w-4 h-4 text-violet-400" />
                    <span>{t.IMPORT_SAVE}</span>
                  </button>

                  <div className="my-1 border-t border-slate-800" />

                  {/* Hard Reset */}
                  <button
                    onClick={() => {
                      if (confirm(t.WIPE_CONFIRM)) {
                        onHardReset();
                      }
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-950/20 hover:text-red-300 transition text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.WIPE_SAVE}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Stage selector and progress (Mobile Only) */}
        <div className="flex md:hidden flex-wrap items-center justify-between gap-3 border-t border-slate-800/40 pt-1.5 text-slate-300 w-full">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Stage:</span>
            <span className={`text-xs font-black px-2 py-0.5 rounded ${isBossMode ? 'bg-red-950/40 text-red-400 border border-red-900/40' : 'bg-slate-800 text-slate-200'}`} id="stagebar-label">
              {isBossMode 
                ? `${language === 'ro' ? 'STAGIUL' : 'STAGE'} ${currentStage} - BOSS` 
                : `${language === 'ro' ? 'STAGIUL' : 'STAGE'} ${currentStage}`}
            </span>
          </div>

          {/* Stage Progress Bar / Kill count dots */}
          <div className="flex-1 max-w-sm flex items-center gap-2">
            {!isBossMode ? (
              <div className="w-full flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-500">{stageProgress}/10</span>
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex" id="stage-mini-dots">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300 shadow-glow" 
                    style={{ width: `${(stageProgress / 10) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-full flex items-center bg-red-950/20 border border-red-900/40 rounded px-1.5 py-0.5 text-[10px] justify-between" id="boss-alert-header">
                <span className="text-red-400 font-bold tracking-tight animate-pulse flex items-center gap-0.5 animate-bounce">
                  ⚔️ {language === 'ro' ? 'Generalul!' : 'General!'}
                </span>
                <span className="text-slate-500 text-[9px] font-mono">{t.AUTO_ADVANCE_DESC}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Language Switcher (Mobile Quick Trigger) */}
            <button
              onClick={onToggleLanguage}
              className="px-1.5 py-1 bg-slate-800 border border-slate-700 hover:bg-slate-750 text-[9px] text-emerald-400 rounded-md font-mono font-bold leading-none align-middle"
              title="Toggle Language EN/RO"
            >
              {language.toUpperCase()}
            </button>

            {/* Auto-advance Toggle */}
            <button
              id="auto-advance-btn-mob"
              onClick={onToggleAutoAdvance}
              className={`text-[9px] font-bold font-mono px-2 py-1 rounded border transition duration-200 cursor-pointer ${
                autoAdvance 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                  : 'bg-slate-850 text-slate-400 border-slate-755'
              }`}
            >
              {t.AUTO}: {autoAdvance ? 'ON' : 'OFF'}
            </button>

            {/* Manual boss encounter button if unlocked */}
            {isBossUnlocked && !isBossMode && (
              <button
                id="fight-boss-btn-mob"
                onClick={onTriggerBoss}
                className="text-[9px] font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-2 py-1 rounded shadow cursor-pointer"
              >
                ⚔️ Boss
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
