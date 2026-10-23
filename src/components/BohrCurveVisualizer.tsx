import React, { useState } from 'react';
import { RefreshCw, Zap } from 'lucide-react';

export const BohrCurveVisualizer: React.FC = () => {
  // Parameters
  // Baseline: pH 7.4, PCO2 40, Temp 37, DPG normal (1.0x)
  const [ph, setPh] = useState<number>(7.4);
  const [pco2, setPco2] = useState<number>(40);
  const [temp, setTemp] = useState<number>(37);
  const [dpg, setDpg] = useState<number>(1.0);

  // Calculate shift factor (positive = right shift, negative = left shift)
  // Normal P50 is approx 26.6 mmHg
  // Lower pH -> right shift (Bohr effect)
  // Higher PCO2 -> right shift
  // Higher Temp -> right shift
  // Higher 2,3-DPG -> right shift
  const phEffect = (7.4 - ph) * 25; // if pH is 7.2 (+5), right shift
  const pco2Effect = (pco2 - 40) * 0.3; // if pco2 is 60 (+6), right shift
  const tempEffect = (temp - 37) * 1.2; // if temp 39 (+2.4), right shift
  const dpgEffect = (dpg - 1.0) * 15; // if dpg 1.5 (+7.5), right shift

  const totalShift = phEffect + pco2Effect + tempEffect + dpgEffect;
  const currentP50 = Math.max(14, Math.min(45, 26.8 + totalShift));

  const isRightShift = currentP50 > 28;
  const isLeftShift = currentP50 < 25.5;

  const resetToBaseline = () => {
    setPh(7.4);
    setPco2(40);
    setTemp(37);
    setDpg(1.0);
  };

  // Hill equation approximation for O2 saturation:
  // Saturation(PO2) = PO2^n / (PO2^n + P50^n) where n approx 2.7
  const calculateSat = (po2: number, p50Val: number): number => {
    const n = 2.7;
    const numerator = Math.pow(po2, n);
    const denominator = numerator + Math.pow(p50Val, n);
    return (numerator / denominator) * 100;
  };

  // Generate SVG path for 0 to 100 mmHg PO2
  // Width: 460, Height: 260
  // X scale: 0 to 100 mmHg -> 50 to 440
  // Y scale: 0 to 100 % Sat -> 240 to 20
  const getX = (po2: number) => 50 + (po2 / 100) * 390;
  const getY = (sat: number) => 240 - (sat / 100) * 220;

  const generateCurvePath = (p50Val: number) => {
    const points: string[] = [];
    for (let po2 = 0; po2 <= 100; po2 += 2) {
      const sat = calculateSat(po2, p50Val);
      const x = getX(po2);
      const y = getY(sat);
      points.push(`${po2 === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  const normalCurvePath = generateCurvePath(26.8);
  const activeCurvePath = generateCurvePath(currentP50);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Hematology Physiology</span>
            <span aria-hidden="true">·</span>
            <span>Oxygen Transport & Hemoglobin</span>
            <span aria-hidden="true">·</span>
            <span>Question 32 Review</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Oxygen–Hemoglobin Dissociation Curve Simulator
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Manipulate physiological variables to observe real-time curve shifts, altered P50, and tissue oxygen unloading mechanics.
          </p>
        </div>

        <button
          onClick={resetToBaseline}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset to Normal Baseline (7.4 / 40 / 37°C)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive SVG Graph */}
        <div className="lg:col-span-7 bg-slate-900 rounded-xl p-5 text-white flex flex-col justify-between shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-0.5 bg-slate-400 inline-block" /> Normal Curve (P50 ≈ 26.8)
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                <span className="w-2.5 h-1 bg-rose-500 inline-block rounded" /> Active Curve
              </span>
            </div>

            <div className="font-mono text-xs">
              P50 = <span className="font-bold text-amber-300">{currentP50.toFixed(1)}</span> mmHg
            </div>
          </div>

          {/* SVG Canvas */}
          <div className="w-full aspect-[16/10] relative">
            <svg viewBox="0 0 470 270" className="w-full h-full">
              {/* Grid Lines */}
              {[0, 20, 40, 60, 80, 100].map((po2) => (
                <g key={`x-${po2}`}>
                  <line
                    x1={getX(po2)}
                    y1={20}
                    x2={getX(po2)}
                    y2={240}
                    stroke="#334155"
                    strokeDasharray="2,2"
                    strokeWidth="1"
                  />
                  <text
                    x={getX(po2)}
                    y={255}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {po2}
                  </text>
                </g>
              ))}

              {[0, 25, 50, 75, 100].map((sat) => (
                <g key={`y-${sat}`}>
                  <line
                    x1={50}
                    y1={getY(sat)}
                    x2={440}
                    y2={getY(sat)}
                    stroke="#334155"
                    strokeDasharray="2,2"
                    strokeWidth="1"
                  />
                  <text
                    x={40}
                    y={getY(sat) + 3}
                    textAnchor="end"
                    fill="#94A3B8"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {sat}%
                  </text>
                </g>
              ))}

              {/* P50 dashed horizontal guide line at 50% */}
              <line
                x1={50}
                y1={getY(50)}
                x2={getX(currentP50)}
                y2={getY(50)}
                stroke="#F59E0B"
                strokeDasharray="4,4"
                strokeWidth="1.5"
              />
              <line
                x1={getX(currentP50)}
                y1={getY(50)}
                x2={getX(currentP50)}
                y2={240}
                stroke="#F59E0B"
                strokeDasharray="4,4"
                strokeWidth="1.5"
              />

              {/* Baseline curve */}
              <path d={normalCurvePath} fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="3,3" />

              {/* Active simulated curve */}
              <path
                d={activeCurvePath}
                fill="none"
                stroke={isRightShift ? '#F43F5E' : isLeftShift ? '#06B6D4' : '#10B981'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Axis Labels */}
              <text x={245} y={268} textAnchor="middle" fill="#CBD5E1" fontSize="11" fontWeight="600">
                PO₂ (mmHg) →
              </text>
              <text
                x={-130}
                y={15}
                transform="rotate(-90)"
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize="11"
                fontWeight="600"
              >
                Hb O₂ Saturation (%) →
              </text>
            </svg>
          </div>

          {/* Current State Diagnostic Banner */}
          <div className="mt-3 p-3 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="font-semibold text-slate-200">Curve State: </span>
              {isRightShift ? (
                <span className="text-rose-400 font-bold">
                  RIGHT SHIFT (Decreased affinity → Promotes O₂ unloading to tissues)
                </span>
              ) : isLeftShift ? (
                <span className="text-cyan-400 font-bold">
                  LEFT SHIFT (Increased affinity → Retains O₂, binds tighter)
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">NORMAL PHYSIOLOGICAL AFFINITY (P50 ≈ 26.8 mmHg)</span>
              )}
            </div>
          </div>
        </div>

        {/* Sliders and Clinical Mechanics */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Physiological Variable Sliders
            </h3>

            {/* pH Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  Blood pH (Bohr Effect):
                </span>
                <span className="font-mono font-bold text-slate-900">{ph.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="7.10"
                max="7.65"
                step="0.05"
                value={ph}
                onChange={(e) => setPh(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>7.10 (Acidosis → Right)</span>
                <span>7.40 (Normal)</span>
                <span>7.65 (Alkalosis → Left)</span>
              </div>
            </div>

            {/* PCO2 Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">PCO₂ (Carbon Dioxide):</span>
                <span className="font-mono font-bold text-slate-900">{pco2} mmHg</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                step="5"
                value={pco2}
                onChange={(e) => setPco2(parseInt(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>20 mmHg (Hypocapnia)</span>
                <span>40 mmHg</span>
                <span>70 mmHg (Hypercapnia → Right)</span>
              </div>
            </div>

            {/* Temperature Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Body Temperature:</span>
                <span className="font-mono font-bold text-slate-900">{temp}°C</span>
              </div>
              <input
                type="range"
                min="32"
                max="41"
                step="0.5"
                value={temp}
                onChange={(e) => setTemp(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>32°C (Hypothermia → Left)</span>
                <span>37°C</span>
                <span>41°C (Fever/Exercise → Right)</span>
              </div>
            </div>

            {/* 2,3-DPG Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">2,3-Bisphosphoglycerate (2,3-DPG):</span>
                <span className="font-mono font-bold text-slate-900">{dpg.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={dpg}
                onChange={(e) => setDpg(parseFloat(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.5x (Stored blood)</span>
                <span>1.0x (Normal)</span>
                <span>2.0x (High altitude → Right)</span>
              </div>
            </div>
          </div>

          {/* High-Yield Mnemonic Card */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs space-y-2">
            <div className="font-bold text-amber-950 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Mnemonic: "CADET, face Right!"</span>
            </div>
            <p className="text-amber-900 leading-relaxed text-[11px]">
              Factors shifting the curve to the <strong>RIGHT</strong> (facilitating oxygen delivery to active exercising tissues):
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-amber-900">
              <div><strong>C</strong> - ↑ CO₂</div>
              <div><strong>A</strong> - ↑ Acidity (↓ pH)</div>
              <div><strong>D</strong> - ↑ 2,3-DPG</div>
              <div><strong>E</strong> - Exercise</div>
              <div><strong>T</strong> - ↑ Temperature</div>
            </div>
            <div className="pt-2 border-t border-amber-200/80 text-[11px] text-amber-800">
              <em>Note:</em> Fetal Hemoglobin (HbF α₂γ₂) binds 2,3-DPG poorly, shifting its curve to the <strong>LEFT</strong> so it can extract O₂ from maternal HbA across the placenta!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
