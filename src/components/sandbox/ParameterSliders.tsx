'use client';

import React from 'react';
import { ParameterSliderConfig } from '../../types/sandbox.ts';
import { useLanguage } from '@/context/LanguageContext';
import { Sliders, RotateCcw } from 'lucide-react';

interface ParameterSlidersProps {
  configs: ParameterSliderConfig[] | Record<string, ParameterSliderConfig>;
  values: Record<string, number>;
  onChange: (key: string, value: number) => void;
  onReset?: () => void;
  title?: string;
  className?: string;
}

export default function ParameterSliders({
  configs,
  values,
  onChange,
  onReset,
  title,
  className = '',
}: ParameterSlidersProps) {
  const { isZh } = useLanguage();
  const configList = (Array.isArray(configs)
    ? configs.map((c, i) => ({ ...c, id: c.id || `param_${i}` }))
    : Object.entries(configs).map(([id, cfg]) => ({ ...cfg, id: cfg.id || id }))) as Array<ParameterSliderConfig & { id: string }>;

  if (configList.length === 0) return null;

  return (
    <div className={`p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>{title || (isZh ? '实时参数控制滑块 (Interactive Parameter Controls)' : 'Interactive Parameter Controls')}</span>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-[11px] font-mono transition-colors cursor-pointer"
            title={isZh ? '重置为默认值' : 'Reset to defaults'}
          >
            <RotateCcw className="w-3 h-3" /> {isZh ? '重置' : 'Reset'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {configList.map((cfg) => {
          const val = values[cfg.id] !== undefined ? values[cfg.id] : cfg.default;
          return (
            <div key={cfg.id} className="space-y-1.5 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-medium">
                  {cfg.label} {cfg.symbol ? `(${cfg.symbol})` : ''}:
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={cfg.min}
                    max={cfg.max}
                    step={cfg.step}
                    value={val}
                    onChange={(e) => {
                      const parsed = parseFloat(e.target.value);
                      if (!isNaN(parsed)) onChange(cfg.id, parsed);
                    }}
                    className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right text-cyan-300 font-bold text-xs focus:border-cyan-400 outline-none"
                  />
                  {cfg.unit && <span className="text-slate-500 text-[10px]">{cfg.unit}</span>}
                </div>
              </div>

              <input
                type="range"
                min={cfg.min}
                max={cfg.max}
                step={cfg.step}
                value={val}
                onChange={(e) => onChange(cfg.id, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>{cfg.min}</span>
                {cfg.description && <span className="truncate max-w-[120px] text-slate-400">{cfg.description}</span>}
                <span>{cfg.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
