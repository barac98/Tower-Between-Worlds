/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart2, ShieldCheck, Copy, Check, RefreshCw, Key, Award, Flame, Zap } from 'lucide-react';
import { GameStats } from '../types/game';
import { Decimal } from '../utils/decimal';

interface StatsTabProps {
  stats: GameStats;
  currentStage: number;
  highestStageReached: number;
  baseClickPower: Decimal;
  activeBaseDps: Decimal;
  activePoisonDps: Decimal;
  activeIceDps: Decimal;
  activeEarthDps: Decimal;
  soundOn: boolean;
  onImportString: (saveString: string) => boolean;
  onExportStateString: () => string;
  language?: 'en' | 'ro';
}

export const StatsTab: React.FC<StatsTabProps> = ({
  stats,
  currentStage,
  highestStageReached,
  baseClickPower,
  activeBaseDps,
  activePoisonDps,
  activeIceDps,
  activeEarthDps,
  onImportString,
  onExportStateString,
  language = 'en',
}) => {
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // Format Playtime in standard readable format e.g. 02h 45m 12s
  const formatPlaytime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (hrs > 0) parts.push(`${hrs}h`);
    if (mins > 0 || hrs > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);
    return parts.join(' ');
  };

  const handleExportClick = () => {
    const saveString = onExportStateString();
    
    // Attempt modern copy-paste
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(saveString)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          // fallback handled below
        });
    } else {
      // Fallback: manually select and prompt
      alert(language === 'ro' ? "Te rugăm să copiezi salvările direct din casetă!" : "Please copy the text directly from the Save String field below!");
    }
  };

  const handleImportSubmit = () => {
    if (!importText.trim()) return;

    const success = onImportString(importText.trim());
    if (success) {
      setImportStatus('success');
      setImportText('');
      setTimeout(() => setImportStatus('idle'), 3000);
    } else {
      setImportStatus('fail');
      setTimeout(() => setImportStatus('idle'), 3000);
    }
  };

  const totalPassiveDps = activeBaseDps
    .add(activePoisonDps)
    .add(activeIceDps);

  return (
    <div className="flex flex-col gap-6 w-full pb-10" id="stats-tab-panel">
      {/* COLUMN LAYOUT FOR METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* STATS BREAKDOWN */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            {language === 'ro' ? 'ANALITICA ANTRENAMENTULUI (Thalorion)' : 'TRAINING ANALYTICS (Thalorion Training Data)'}
          </h3>

          <div className="flex flex-col gap-2.5 font-mono text-xs sm:text-sm" id="analytics-statistics-list">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 gap-2">
              <span className="text-slate-400 font-sans sm:font-mono">{language === 'ro' ? 'Călătorind de:' : 'Playtime duration:'}</span>
              <span className="text-slate-200 font-bold shrink-0">{formatPlaytime(stats.playtime)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 gap-2">
              <span className="text-slate-400 font-sans sm:font-mono">{language === 'ro' ? 'Lovituri manuale (Taps):' : 'Manual Taps Triggered:'}</span>
              <span className="text-slate-200 font-bold shrink-0">{stats.tapCount} {language === 'ro' ? 'lovituri' : 'taps'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 gap-2">
              <span className="text-slate-400 font-sans sm:font-mono">{language === 'ro' ? 'Gărzi ale Umbrei înfrânte:' : 'Shadow Minions Defeated:'}</span>
              <span className="text-emerald-400 font-bold shrink-0">{stats.monsterKills} {language === 'ro' ? 'sate libere' : 'kills'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 gap-2">
              <span className="text-slate-400 font-sans sm:font-mono">{language === 'ro' ? 'Generali de Facțiune înfrânți:' : 'Faction Bosses Banished:'}</span>
              <span className="text-red-400 font-bold shrink-0">{stats.bossKills} {language === 'ro' ? 'victorii' : 'victories'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 gap-2">
              <span className="text-slate-400 font-sans sm:font-mono">{language === 'ro' ? 'Aur total colectat:' : 'Total Gold Accumulated:'}</span>
              <span className="text-amber-400 font-bold shrink-0">{Decimal.from(stats.totalGoldEarned).format(2)}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/40 gap-2">
              <span className="text-slate-400 font-sans sm:font-mono">{language === 'ro' ? 'Reveniri la Consiliu (Prestigii):' : 'Prestige Resets Performed:'}</span>
              <span className="text-fuchsia-400 font-bold shrink-0">{stats.timesPrestiged} {language === 'ro' ? 'inițieri' : 'ascensions'}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 gap-2">
              <span className="text-slate-400 font-sans sm:font-mono">{language === 'ro' ? 'Stagiul maxim înregistrat:' : 'Max Historical Stage:'}</span>
              <span className="text-cyan-400 font-bold shrink-0">{language === 'ro' ? 'Stagiul ' : 'Stage '}{highestStageReached}</span>
            </div>
          </div>
        </div>

        {/* COMBAT & ELEMENTAL FORCE */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
            <Flame className="w-4 h-4 text-red-400" />
            {language === 'ro' ? 'DETALII DAUNE ACTIVE (DPS)' : 'ACTIVE DAMAGE BREAKDOWN'}
          </h3>

          <div className="flex flex-col gap-3 font-mono text-xs sm:text-sm h-full justify-between" id="active-elements-damage-list">
            <div className="flex flex-col gap-2.5">
              {/* Click tap */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-950 gap-2">
                <span className="text-slate-200 font-bold flex items-center gap-1 sm:gap-1.5 font-sans text-xs sm:text-sm truncate">
                  <Zap className="w-3.5 h-3.5 text-yellow-400 shrink-0" /> {language === 'ro' ? 'Daune per Click' : 'Manual Tap Damage'}
                </span>
                <span className="text-yellow-400 font-black shrink-0 text-sm">{baseClickPower.format(0)}</span>
              </div>

              {/* Base passive */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 gap-2">
                <span className="text-slate-400 font-sans text-xs sm:text-sm truncate">{language === 'ro' ? 'Dps Pasiv de Bază' : 'Base Passive Normal DPS'}</span>
                <span className="text-slate-200 font-semibold shrink-0 text-xs sm:text-sm">{activeBaseDps.format(0)} /s</span>
              </div>

              {/* Poison */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 gap-2">
                <span className="text-emerald-400 font-bold font-sans text-xs sm:text-sm truncate">🧪 {language === 'ro' ? 'Active Poison DPS' : 'Active Poison DPS'}</span>
                <span className="text-emerald-400 font-semibold shrink-0 text-xs sm:text-sm">{activePoisonDps.format(0)} /s</span>
              </div>

              {/* Ice */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 gap-2">
                <span className="text-cyan-400 font-bold font-sans text-xs sm:text-sm truncate">❄️ {language === 'ro' ? 'Active Chill DPS' : 'Active Chill Ice DPS'}</span>
                <span className="text-cyan-400 font-semibold shrink-0 text-xs sm:text-sm">{activeIceDps.format(0)} /s</span>
              </div>

              {/* Earth */}
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 gap-2">
                <span className="text-amber-500 font-bold font-sans text-xs sm:text-sm truncate">⛰️ {language === 'ro' ? 'Seism (La 4s)' : 'Earthquake (4s)'}</span>
                <span className="text-amber-500 font-semibold shrink-0 text-xs sm:text-sm">{activeEarthDps.format(0)} {language === 'ro' ? 'daune' : 'burst'}</span>
              </div>
            </div>

            {/* Total Passive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-t border-slate-800 pt-3 gap-1.5">
              <span className="text-slate-300 font-bold uppercase text-[10px] sm:text-xs font-sans">{language === 'ro' ? 'Daune total pasive din relicve (DPS):' : 'Total Active Passive DPS:'}</span>
              <span className="text-base sm:text-lg font-black text-emerald-400 shrink-0">{totalPassiveDps.format(1)} /s</span>
            </div>
          </div>
        </div>
      </div>

      {/* SAVE MIGRATION CENTER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col gap-4" id="save-migration-panel">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 font-sans">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          {language === 'ro' ? 'CENTRU MIGRARE DE SALVĂRI' : 'SAVE MIGRATION CENTER'}
        </h3>
        <p className="text-xs text-slate-400 font-sans leading-relaxed">
          {language === 'ro' 
            ? 'Vrei să muți progresul pe alt browser sau pe telefon? Copiază textul criptat de salvare de mai jos, sau introdu un cod de salvare generat anterior pentru a relua aventura direct!' 
            : 'Need to transition to another browser or back up your progression? Export your current save file string below, or paste a previously backed up save string to resume playing instantly.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2" id="save-fields-grid">
          {/* Export Box */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase text-slate-400 font-mono">{language === 'ro' ? 'Codul tău criptat de salvare' : 'Your Encrypted Save String'}</span>
            <div className="relative w-full">
              <textarea
                readOnly
                value={onExportStateString()}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                className="w-full h-24 bg-slate-950 border border-slate-800 text-slate-350 rounded-xl p-3 font-mono text-[10px] resize-none focus:outline-none focus:border-cyan-500 transition cursor-pointer"
                id="export-textarea-box"
              />
              <button
                onClick={handleExportClick}
                className="absolute right-2.5 bottom-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 px-3 py-1.5 text-xs font-bold rounded-lg transition-transform cursor-pointer flex items-center gap-1.5 active:scale-95 font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? (language === 'ro' ? 'Copiat!' : 'Copied') : (language === 'ro' ? 'Copiază' : 'Copy')}
              </button>
            </div>
          </div>

          {/* Import Box */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase text-slate-400 font-mono">{language === 'ro' ? 'Încarcă o salvare de siguranță' : 'Load Backup Save String'}</span>
            <div className="flex flex-col gap-3">
              <textarea
                placeholder={language === 'ro' ? 'Lipește codul salvării aici...' : 'Paste save code here...'}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full h-24 bg-slate-950 border border-slate-800 text-white placeholder-slate-650 rounded-xl p-3 font-mono text-[10px] resize-none focus:outline-none focus:border-violet-500 transition"
                id="import-textarea-box"
              />
              
              <div className="flex items-center gap-3">
                <button
                  id="submit-import-btn"
                  disabled={!importText.trim()}
                  onClick={handleImportSubmit}
                  className="px-4.5 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-slate-950 disabled:text-slate-600 text-white font-black text-xs rounded-xl transition cursor-pointer scroll-m-2 active:scale-95 flex items-center gap-1.5 border border-transparent disabled:border-slate-900 font-sans"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {language === 'ro' ? 'Aplică Cod Salvare' : 'Apply Backup Code'}
                </button>

                {importStatus === 'success' && (
                  <span className="text-xs text-emerald-400 font-mono font-bold animate-pulse">
                    {language === 'ro' ? '✓ Salvare validată cu succes! Jocul s-a reîncărcat.' : '✓ Code validated! Game state refreshed.'}
                  </span>
                )}
                {importStatus === 'fail' && (
                  <span className="text-xs text-red-400 font-mono font-bold animate-pulse">
                    {language === 'ro' ? '✗ Formatul codului de salvare este invalid!' : '✗ Invalid backup string format!'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
