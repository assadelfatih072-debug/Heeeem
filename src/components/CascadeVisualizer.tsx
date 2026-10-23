import React, { useState } from 'react';
import { Stethoscope } from 'lucide-react';

type HighlightFilter = 'all' | 'intrinsic' | 'extrinsic' | 'common' | 'aptt' | 'pt' | 'heparin' | 'protein_cs' | 'vit_k';

export const CascadeVisualizer: React.FC = () => {
  const [highlight, setHighlight] = useState<HighlightFilter>('all');
  const [selectedFactor, setSelectedFactor] = useState<string | null>('II');

  const factorsInfo: Record<string, { name: string; pathway: string; note: string; clinical: string }> = {
    XII: {
      name: 'Factor XII (Hageman Factor)',
      pathway: 'Intrinsic Pathway',
      note: 'Activated by contact with negatively charged subendothelial collagen. Activates Factor XI.',
      clinical: 'Factor XII deficiency causes prolonged aPTT in vitro but remarkably NO clinical bleeding tendency in vivo.',
    },
    XI: {
      name: 'Factor XI (Plasma Thromboplastin Antecedent)',
      pathway: 'Intrinsic Pathway',
      note: 'Activated by Factor XIIa. Cleaves and activates Factor IX.',
      clinical: 'Factor XI deficiency is Hemophilia C (autosomal, prevalent in Ashkenazi Jewish population). Mild bleeding.',
    },
    IX: {
      name: 'Factor IX (Christmas Factor)',
      pathway: 'Intrinsic Pathway',
      note: 'Vitamin K-dependent zymogen. With cofactor VIIIa, forms the intrinsic tenase complex.',
      clinical: 'Deficiency causes Hemophilia B (Christmas disease, X-linked recessive). Prolonged aPTT, normal PT.',
    },
    VIII: {
      name: 'Factor VIII (Antihemophilic Factor)',
      pathway: 'Intrinsic Pathway (Cofactor)',
      note: 'Labile cofactor bound to von Willebrand Factor (vWF) in circulation. Inactivated by activated Protein C.',
      clinical: 'Deficiency causes Hemophilia A (X-linked recessive; ~80% of hemophilias). Treated with recombinant Factor VIII.',
    },
    III: {
      name: 'Factor III (Tissue Factor / Thromboplastin)',
      pathway: 'Extrinsic Pathway (Trigger)',
      note: 'Subendothelial transmembrane glycoprotein exposed upon vascular wall trauma. Binds Factor VII.',
      clinical: 'Primary physiological initiator of in vivo coagulation after vascular injury.',
    },
    VII: {
      name: 'Factor VII (Proconvertin)',
      pathway: 'Extrinsic Pathway',
      note: 'Vitamin K-dependent protease. Has the shortest half-life (~4-6 hours) of all clotting factors.',
      clinical: 'Because of its rapid turnover, Factor VII levels drop first in Vitamin K deficiency or Warfarin therapy, prolonging PT/INR.',
    },
    X: {
      name: 'Factor X (Stuart-Prower Factor)',
      pathway: 'Common Pathway Convergence',
      note: 'Activated to Xa by both intrinsic tenase (IXa+VIIIa) and extrinsic tenase (TF+VIIa). Vitamin K-dependent.',
      clinical: 'Central nexus of coagulation. Direct Oral Anticoagulants (DOACs like Rivaroxaban, Apixaban) directly inhibit Xa.',
    },
    V: {
      name: 'Factor V (Proaccelerin / Labile Factor)',
      pathway: 'Common Pathway (Cofactor)',
      note: 'Cofactor with Xa in the prothrombinase complex. Cleaved and inactivated by Protein C & Protein S.',
      clinical: 'Factor V Leiden mutation (Arg506Gln) prevents APC cleavage, creating lifelong venous thromboembolism risk.',
    },
    II: {
      name: 'Factor II (Prothrombin → Thrombin)',
      pathway: 'Common Pathway',
      note: 'Vitamin K-dependent zymogen converted to Thrombin (IIa) by the prothrombinase complex (Xa + Va + Ca²⁺ + phospholipids).',
      clinical: 'Thrombin converts soluble fibrinogen to fibrin, activates Factors V, VIII, XI, XIII, and activates Protein C.',
    },
    I: {
      name: 'Factor I (Fibrinogen → Fibrin)',
      pathway: 'Common Pathway (Clot Scaffold)',
      note: 'Cleaved by Thrombin (IIa) to form insoluble fibrin monomers, which polymerize into a preliminary clot mesh.',
      clinical: 'Cross-linked and stabilized by Factor XIIIa (fibrin-stabilizing factor). Breakdown product is D-dimer.',
    },
    XIII: {
      name: 'Factor XIII (Fibrin Stabilizing Factor)',
      pathway: 'Final Clot Cross-linking',
      note: 'Transglutaminase activated by thrombin. Introduces covalent peptide cross-links between fibrin strands.',
      clinical: 'Deficiency presents with delayed umbilical stump bleeding and soft tissue hematomas with normal routine PT and aPTT.',
    },
  };

  const isHighlighted = (factor: string): boolean => {
    if (highlight === 'all') return true;
    if (highlight === 'intrinsic' && ['XII', 'XI', 'IX', 'VIII'].includes(factor)) return true;
    if (highlight === 'extrinsic' && ['III', 'VII'].includes(factor)) return true;
    if (highlight === 'common' && ['X', 'V', 'II', 'I', 'XIII'].includes(factor)) return true;
    if (highlight === 'aptt' && ['XII', 'XI', 'IX', 'VIII', 'X', 'V', 'II', 'I'].includes(factor)) return true;
    if (highlight === 'pt' && ['III', 'VII', 'X', 'V', 'II', 'I'].includes(factor)) return true;
    if (highlight === 'heparin' && ['II', 'X', 'IX', 'XI', 'XII'].includes(factor)) return true;
    if (highlight === 'protein_cs' && ['V', 'VIII'].includes(factor)) return true;
    if (highlight === 'vit_k' && ['II', 'VII', 'IX', 'X'].includes(factor)) return true;
    return false;
  };

  const activeInfo = selectedFactor ? factorsInfo[selectedFactor] : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Hematology Review</span>
            <span aria-hidden="true">·</span>
            <span>Secondary Hemostasis</span>
            <span aria-hidden="true">·</span>
            <span>Questions 50–59</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Interactive Coagulation Cascade</h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Explore the intrinsic, extrinsic, and common pathways. Toggle clinical filters to visualize clinical laboratory tests (aPTT vs PT) and regulatory mechanisms.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 rounded-lg text-xs font-medium">
        <button
          onClick={() => setHighlight('all')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'all' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          All Pathways
        </button>
        <button
          onClick={() => setHighlight('intrinsic')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'intrinsic' ? 'bg-indigo-600 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Intrinsic (XII → XI → IX → VIII)
        </button>
        <button
          onClick={() => setHighlight('extrinsic')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'extrinsic' ? 'bg-emerald-600 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Extrinsic (Tissue Factor + VII)
        </button>
        <button
          onClick={() => setHighlight('common')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'common' ? 'bg-amber-600 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Common (X → V → II → I)
        </button>
        <button
          onClick={() => setHighlight('aptt')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'aptt' ? 'bg-rose-600 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          aPTT Test Track
        </button>
        <button
          onClick={() => setHighlight('pt')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'pt' ? 'bg-cyan-600 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          PT / INR Track
        </button>
        <button
          onClick={() => setHighlight('protein_cs')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'protein_cs' ? 'bg-purple-600 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Protein C & S Targets (V & VIII)
        </button>
        <button
          onClick={() => setHighlight('vit_k')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'vit_k' ? 'bg-teal-600 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Vitamin K Dependent (1972)
        </button>
        <button
          onClick={() => setHighlight('heparin')}
          className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${highlight === 'heparin' ? 'bg-slate-800 text-white shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'}`}
        >
          Heparin / AT-III Action
        </button>
      </div>

      {/* Main Cascade Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cascade Schema */}
        <div className="lg:col-span-8 bg-slate-50/70 border border-slate-200 rounded-xl p-5 relative overflow-hidden">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
            {/* Intrinsic Pathway Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">Intrinsic Pathway</span>
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">aPTT</span>
              </div>
              <p className="text-[11px] text-slate-500">Triggered by collagen contact / surface charge</p>

              <div className="space-y-2 pt-1">
                {['XII', 'XI', 'IX', 'VIII'].map((f) => {
                  const active = isHighlighted(f);
                  const isSelected = selectedFactor === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFactor(f)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-200'
                          : active
                          ? 'border-indigo-200 bg-white hover:border-indigo-400'
                          : 'border-slate-200 bg-slate-100/60 opacity-40 hover:opacity-80'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-800">Factor {f}</span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {factorsInfo[f].name.split('(')[1]?.replace(')', '') || factorsInfo[f].name}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {f === 'VIII' ? 'Cofactor' : 'Serine Protease'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center my-1 text-slate-400">
                <span className="text-xs font-mono">↓ Intrinsic Tenase (IXa + VIIIa)</span>
              </div>
            </div>

            {/* Extrinsic Pathway Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">Extrinsic Pathway</span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">PT / INR</span>
              </div>
              <p className="text-[11px] text-slate-500">Triggered by subendothelial Tissue Factor (TF)</p>

              <div className="space-y-2 pt-1">
                {['III', 'VII'].map((f) => {
                  const active = isHighlighted(f);
                  const isSelected = selectedFactor === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setSelectedFactor(f)}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-200'
                          : active
                          ? 'border-emerald-200 bg-white hover:border-emerald-400'
                          : 'border-slate-200 bg-slate-100/60 opacity-40 hover:opacity-80'
                      }`}
                    >
                      <div>
                        <span className="font-mono font-bold text-slate-800">
                          {f === 'III' ? 'Tissue Factor (III)' : 'Factor VII'}
                        </span>
                        <p className="text-[11px] text-slate-500 truncate max-w-[150px]">
                          {f === 'VII' ? 'Shortest half-life (4-6h)' : 'Cellular receptor'}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {f === 'III' ? 'Trigger' : 'Vit K-dep'}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-center my-6 text-slate-400">
                <span className="text-xs font-mono">↓ Extrinsic Tenase (TF + VIIa)</span>
              </div>
            </div>
          </div>

          {/* Common Pathway Section */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">Common Pathway Convergence</span>
              <span className="text-[11px] text-slate-500 font-mono">Assessed by both PT and aPTT</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['X', 'V', 'II', 'I'].map((f) => {
                const active = isHighlighted(f);
                const isSelected = selectedFactor === f;
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFactor(f)}
                    className={`text-left p-2.5 rounded-lg border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/80 ring-2 ring-amber-200'
                        : active
                        ? 'border-amber-200 bg-white hover:border-amber-400'
                        : 'border-slate-200 bg-slate-100/60 opacity-40 hover:opacity-80'
                    }`}
                  >
                    <div className="font-mono font-bold text-slate-800">
                      Factor {f}
                      {f === 'II' && ' (Prothrombin)'}
                      {f === 'I' && ' (Fibrinogen)'}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1">
                      {f === 'X' && 'Prothrombinase hub'}
                      {f === 'V' && 'Inactivated by Prot C'}
                      {f === 'II' && '→ Thrombin'}
                      {f === 'I' && '→ Fibrin Mesh'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stable Clot End Result */}
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                <span className="font-semibold text-rose-950">Stable Fibrin Hemostatic Plug (Clot)</span>
                <span className="text-slate-500">Cross-linked by Factor XIIIa</span>
              </div>
              <button
                onClick={() => setSelectedFactor('XIII')}
                className="text-xs font-medium text-rose-700 hover:text-rose-900 underline"
              >
                Inspect Factor XIII
              </button>
            </div>
          </div>
        </div>

        {/* Factor Detail & Clinical Callout Card */}
        <div className="lg:col-span-4 space-y-4">
          {activeInfo ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="text-xs text-indigo-600 font-semibold uppercase tracking-wider">
                {activeInfo.pathway}
              </div>
              <h3 className="text-base font-bold text-slate-900">{activeInfo.name}</h3>

              <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                <div>
                  <strong className="text-slate-900 block mb-0.5">Physiological Function:</strong>
                  {activeInfo.note}
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <strong className="text-slate-900 block mb-0.5">High-Yield Clinical Correlation:</strong>
                  {activeInfo.clinical}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 text-center">
              Click any factor button in the cascade diagram to view its physiological role, test correlation, and pathology.
            </div>
          )}

          {/* Key Mnemonic Reference Box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5 text-xs text-slate-700">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-rose-600" />
              <span>Board Exam Fast Facts:</span>
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-600 list-disc list-inside">
              <li>
                <strong className="text-slate-800">First step in hemostasis:</strong> Vasospasm (vasoconstriction)
              </li>
              <li>
                <strong className="text-slate-800">Vitamin K factors:</strong> II, VII, IX, X + Protein C & S (Mnemonic: <em>1972</em>)
              </li>
              <li>
                <strong className="text-slate-800">Heparin:</strong> Accelerates Antithrombin III, blocking Thrombin & Xa
              </li>
              <li>
                <strong className="text-slate-800">Protein C & S:</strong> Degrade active cofactors Va & VIIIa
              </li>
              <li>
                <strong className="text-slate-800">Bleeding time:</strong> Platelet function/count (primary hemostasis)
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
