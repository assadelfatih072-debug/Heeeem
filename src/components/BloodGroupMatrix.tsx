import React, { useState } from 'react';
import { Shield, CheckCircle2, XCircle } from 'lucide-react';

type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

export const BloodGroupMatrix: React.FC = () => {
  const [selectedDonor, setSelectedDonor] = useState<BloodType>('O-');
  const [selectedRecipient, setSelectedRecipient] = useState<BloodType>('A+');
  const [activeTab, setActiveTab] = useState<'matrix' | 'hdfn'>('matrix');

  const bloodTypes: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];

  // RBC Compatibility rules:
  // Recipient cannot receive antigens they have antibodies against.
  // O has Anti-A and Anti-B -> can only receive O.
  // A has Anti-B -> can receive A or O.
  // B has Anti-A -> can receive B or O.
  // AB has neither -> can receive A, B, AB, O.
  // Rh- can only receive Rh- (unless un-sensitized in emergency). Rh+ can receive Rh+ or Rh-.
  const canDonateRBC = (donor: BloodType, recipient: BloodType): boolean => {
    const donorABO = donor.replace(/[+-]/, '');
    const donorRh = donor.includes('+');
    const recipientABO = recipient.replace(/[+-]/, '');
    const recipientRh = recipient.includes('+');

    // Rh check: Rh- can give to anyone; Rh+ can only give to Rh+
    if (donorRh && !recipientRh) return false;

    // ABO check:
    if (recipientABO === 'AB') return true;
    if (recipientABO === 'A') return donorABO === 'A' || donorABO === 'O';
    if (recipientABO === 'B') return donorABO === 'B' || donorABO === 'O';
    if (recipientABO === 'O') return donorABO === 'O';
    return false;
  };

  const isRBCCompatible = canDonateRBC(selectedDonor, selectedRecipient);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Transfusion Medicine</span>
            <span aria-hidden="true">·</span>
            <span>ABO & Rh D Antigens</span>
            <span aria-hidden="true">·</span>
            <span>Questions 60–65 Review</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Blood Group Compatibility & Hemolytic Disease of Newborn (HDFN)
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Simulate ABO/Rh compatibility, examine Landsteiner's rule, and review the clinical mechanics of maternal sensitization.
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium self-start md:self-auto">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'matrix' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compatibility Matrix
          </button>
          <button
            onClick={() => setActiveTab('hdfn')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'hdfn' ? 'bg-white text-slate-900 shadow-sm font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rh Incompatibility & HDFN
          </button>
        </div>
      </div>

      {activeTab === 'matrix' ? (
        <div className="space-y-6">
          {/* Interactive Transfusion Checker */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl items-center">
            <div className="md:col-span-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700">1. Select Donor RBC Type:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {bloodTypes.map((type) => (
                  <button
                    key={`donor-${type}`}
                    onClick={() => setSelectedDonor(type)}
                    className={`py-1.5 text-xs font-mono font-bold rounded border transition-all ${
                      selectedDonor === type
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 space-y-2">
              <label className="block text-xs font-bold text-slate-700">2. Select Recipient Patient Type:</label>
              <div className="grid grid-cols-4 gap-1.5">
                {bloodTypes.map((type) => (
                  <button
                    key={`recipient-${type}`}
                    onClick={() => setSelectedRecipient(type)}
                    className={`py-1.5 text-xs font-mono font-bold rounded border transition-all ${
                      selectedRecipient === type
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 p-3 rounded-lg border bg-white flex flex-col justify-center space-y-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Cross-Match Result:
              </span>
              <div className="flex items-center gap-2">
                {isRBCCompatible ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>COMPATIBLE for Packed RBC Transfusion</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>INCOMPATIBLE! (Acute Hemolytic Reaction)</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isRBCCompatible
                  ? `Recipient ${selectedRecipient} lacks antibodies targeting ${selectedDonor} RBC antigens.`
                  : `Recipient ${selectedRecipient} has circulating antibodies that will agglutinate and lyse ${selectedDonor} cells.`}
              </p>
            </div>
          </div>

          {/* Reference Table of ABO and Rh groups */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">ABO Blood Group</th>
                  <th className="p-3">RBC Surface Antigens</th>
                  <th className="p-3">Plasma Antibodies (Isohemagglutinins)</th>
                  <th className="p-3">Can Receive Packed RBCs From</th>
                  <th className="p-3">Clinical Designation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">Group A</td>
                  <td className="p-3 text-slate-700">A antigen</td>
                  <td className="p-3 text-rose-600 font-semibold">Anti-B (IgM)</td>
                  <td className="p-3 text-slate-600">A, O</td>
                  <td className="p-3 text-slate-500 font-sans">Common</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-900">Group B</td>
                  <td className="p-3 text-slate-700">B antigen</td>
                  <td className="p-3 text-rose-600 font-semibold">Anti-A (IgM)</td>
                  <td className="p-3 text-slate-600">B, O</td>
                  <td className="p-3 text-slate-500 font-sans">Common</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-indigo-50/30">
                  <td className="p-3 font-bold text-indigo-900">Group AB</td>
                  <td className="p-3 text-indigo-800 font-semibold">Both A and B antigens</td>
                  <td className="p-3 text-emerald-600 font-semibold">Neither Anti-A nor Anti-B</td>
                  <td className="p-3 text-indigo-700">A, B, AB, O (All)</td>
                  <td className="p-3 text-indigo-900 font-sans font-semibold">Universal RBC Recipient</td>
                </tr>
                <tr className="hover:bg-slate-50/50 bg-rose-50/30">
                  <td className="p-3 font-bold text-rose-950">Group O</td>
                  <td className="p-3 text-slate-500">Neither A nor B (only H antigen)</td>
                  <td className="p-3 text-rose-700 font-semibold">Both Anti-A and Anti-B (IgM & IgG)</td>
                  <td className="p-3 text-rose-800">O only</td>
                  <td className="p-3 text-rose-950 font-sans font-semibold">Universal RBC Donor (O-)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* HDFN Section */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="text-xs font-mono text-indigo-600 font-semibold">Stage 01</span>
              <h3 className="text-sm font-bold text-slate-900">Maternal-Fetal Setup</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Occurs when an <strong>Rh-negative mother</strong> carries an <strong>Rh-positive fetus</strong> (inheriting the D antigen from the Rh-positive father).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="text-xs font-mono text-amber-600 font-semibold">Stage 02</span>
              <h3 className="text-sm font-bold text-slate-900">Sensitization Event</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                During 1st delivery or fetomaternal hemorrhage, fetal Rh+ RBCs enter maternal circulation. Maternal B cells produce <strong>IgG anti-D antibodies</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <span className="text-xs font-mono text-rose-600 font-semibold">Stage 03</span>
              <h3 className="text-sm font-bold text-slate-900">Subsequent Pregnancy Hemolysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                In subsequent Rh+ pregnancies, maternal <strong>IgG anti-D crosses the placenta</strong>, attacking fetal erythrocytes → anemia, jaundice, hydrops fetalis.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-1">
              <span className="font-bold block">Clinical Prophylaxis Protocol (RhoGAM):</span>
              <p className="leading-relaxed">
                Administer <strong>Rho(D) immune globulin (RhoGAM)</strong> to all unsensitized Rh-negative pregnant women at <strong>28 weeks gestation</strong> and within <strong>72 hours of delivery</strong> of an Rh-positive newborn. RhoGAM clears circulating fetal Rh+ RBCs before the maternal immune system can recognize the D antigen and undergo sensitization!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
