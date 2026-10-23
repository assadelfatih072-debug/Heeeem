import React, { useState } from 'react';
import { Printer, Search } from 'lucide-react';

export const CheatSheet: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      title: '1. Blood Volumes & Erythrocyte Normal Values',
      items: [
        { label: 'Total Adult Blood Volume', value: '~5 Liters (approx. 7–8% of body weight, 70 mL/kg)' },
        { label: 'Plasma Volume', value: '~3.5 Liters (~55% of blood volume)' },
        { label: 'Adult Male Hematocrit', value: '~45% (PCV; normal range 42%–52%)' },
        { label: 'RBC Shape', value: 'Biconcave disc (maximizes surface-to-volume ratio & capillary deformability)' },
        { label: 'RBC Mean Diameter', value: '7.5 μm (range 7.2–7.8 μm; matches small lymphocyte nucleus)' },
        { label: 'RBC Lifespan', value: '120 days (4 months; no nucleus or ribosomes; anaerobic glycolysis)' },
        { label: 'RBC Cellular Content', value: 'Hemoglobin accounts for ~95% of dry weight; lacks nucleus/organelles' },
      ],
    },
    {
      title: '2. Hematopoiesis Timeline & Sites',
      items: [
        { label: '1st Trimester Primary Site', value: 'Yolk sac mesoderm (mesoblastic period, weeks 3 to 10)' },
        { label: '2nd Trimester Primary Site', value: 'Liver and Spleen (hepatic period, weeks 6 to ~28)' },
        { label: 'Late Fetus & Adults', value: 'Red Bone Marrow (axial skeleton: sternum, ribs, vertebrae, iliac crest)' },
        { label: 'Extramedullary Hematopoiesis', value: 'Blood cell formation outside bone marrow (liver/spleen in thalassemia/myelofibrosis)' },
        { label: 'Erythropoiesis Maturation Sequence', value: 'Stem cell → Proerythroblast → Normoblast (extrudes nucleus) → Reticulocyte → Erythrocyte' },
        { label: 'Primary Regulator', value: 'Erythropoietin (EPO); ~90% produced by renal cortical peritubular fibroblasts' },
        { label: 'EPO Trigger / Stimulus', value: 'Tissue Hypoxia (sensed via HIF-1α stabilization)' },
      ],
    },
    {
      title: '3. Iron, Vitamins & Hemoglobin Genetics',
      items: [
        { label: 'Total Body Iron Content', value: '3 to 5 grams (~65% in hemoglobin, ~25% in ferritin storage)' },
        { label: 'Iron Deficiency Blood Film', value: 'Microcytic, hypochromic anemia (MCV < 80 fL, expanded central pallor)' },
        { label: 'Vitamin B12 Absorption Site', value: 'Terminal Ileum (requires gastric parietal cell Intrinsic Factor)' },
        { label: 'Folate Absorption Site', value: 'Jejunum (proximal small intestine)' },
        { label: 'B12 vs Folate Distinction', value: 'B12 deficiency causes Subacute Combined Degeneration of spinal cord; Folate does not' },
        { label: 'Pernicious Anemia Antibodies', value: 'Autoantibodies against Parietal Cells or Intrinsic Factor' },
        { label: 'Normal Heme Iron State', value: 'Ferrous iron (Fe²⁺); binds O₂ reversibly ("Fe2+ binds O2")' },
        { label: 'Normal Adult HbA', value: 'α₂β₂ tetramer with 4 heme groups (binds up to 4 O₂ molecules)' },
        { label: 'Sickle Cell Mutation (HbS)', value: 'Point mutation (β6 Glu → Val); hydrophobic substitution causing polymer rods' },
        { label: 'Methemoglobin State', value: 'Ferric iron (Fe³⁺); cannot bind O₂; treated with Methylene Blue' },
        { label: 'Carboxyhemoglobin', value: 'Hemoglobin bound to Carbon Monoxide (CO affinity is 200–250x higher than O₂)' },
        { label: 'Right Shift of O₂-Hb Curve', value: 'Decreased affinity → increased O₂ release/unloading (CADET: CO₂, Acid, DPG, Exercise, Temp)' },
      ],
    },
    {
      title: '4. Bilirubin Metabolism & Anemia Classification',
      items: [
        { label: 'Unconjugated Bilirubin Origin', value: 'Heme breakdown: Heme → Biliverdin → Unconjugated Bilirubin (bound to albumin)' },
        { label: 'Bilirubin Conjugation Site', value: 'Hepatocytes in Liver (via UDP-glucuronosyltransferase / UGT1A1)' },
        { label: 'Post-Hepatic Jaundice Findings', value: 'Biliary obstruction → Conjugated bilirubinuria (Dark urine) & pale/clay-colored acholic stools' },
        { label: 'Decreased RBC Production', value: 'Bone marrow disease/failure (aplastic anemia, myelophthisis, leukemia)' },
        { label: 'Thalassemia Morphology', value: 'Microcytic hypochromic anemia with target cells (decreased α or β globin chains)' },
        { label: 'Renal Failure Anemia', value: 'Normocytic normochromic anemia (deficient EPO production by damaged peritubular cells)' },
      ],
    },
    {
      title: '5. Immunology & Lymphocytes',
      items: [
        { label: 'T Lymphocyte Maturation', value: 'Thymus (undergoes positive and negative selection for self-tolerance)' },
        { label: 'B Lymphocyte Maturation', value: 'Bone marrow (differentiates into antibody-secreting plasma cells)' },
        { label: 'Cell-Mediated Immunity', value: 'T lymphocytes (CD4+ helper T cells, CD8+ cytotoxic T cells)' },
        { label: 'Humoral Immunity', value: 'B lymphocytes and antibodies (immunoglobulins neutralizing extracellular pathogens)' },
        { label: 'T Helper (CD4) Antigen Presentation', value: 'MHC-II (Rule of 8: 4 × 2 = 8; on APCs like macrophages/dendritic cells)' },
        { label: 'Cytotoxic T (CD8) Presentation', value: 'MHC-I (Rule of 8: 8 × 1 = 8; on all nucleated cells)' },
        { label: 'Largest Immunoglobulin (Pentamer)', value: 'IgM (massive, 900 kDa, 10 antigen-binding sites, primary response)' },
        { label: 'Placental Transfer Immunoglobulin', value: 'IgG (crosses placenta via FcRn receptor; provides neonatal passive immunity)' },
        { label: 'Allergy & Parasite Antibody', value: 'IgE (binds mast cells/basophils; triggers immediate histamine degranulation)' },
        { label: 'Natural Killer (NK) Cells', value: 'Innate immunity (large granular lymphocytes recognizing absence of MHC-I)' },
      ],
    },
    {
      title: '6. Hemostasis, Coagulation & Blood Groups',
      items: [
        { label: 'First Immediate Step in Hemostasis', value: 'Vasospasm (neurogenic reflex + local myogenic vasoconstriction)' },
        { label: 'Intrinsic Pathway Test', value: 'aPTT (evaluates Factors XII, XI, IX, VIII, and common pathway; monitors Heparin)' },
        { label: 'Extrinsic Pathway Trigger', value: 'Tissue Factor (TF / Factor III); interacts with Factor VII (assessed by PT/INR)' },
        { label: 'Intrinsic Factor Prior to Factor X', value: 'Factor VIII (with Factor IXa forms intrinsic tenase complex)' },
        { label: 'Factor II & Factor I Names', value: 'Factor II = Prothrombin; Factor I = Fibrinogen' },
        { label: 'Heparin Mechanism', value: 'Catalytically accelerates Antithrombin III, inactivating Thrombin (IIa) and Factor Xa' },
        { label: 'Protein C & S Targets', value: 'Inactivate active cofactors Factor Va and Factor VIIIa' },
        { label: 'Prolonged PT Etiology', value: 'Vitamin K deficiency (affects II, VII, IX, X, Prot C & S; Factor VII half-life 4-6h)' },
        { label: 'Prolonged Bleeding Time', value: 'Thrombocytopenia or platelet dysfunction (tests primary hemostasis)' },
        { label: 'Blood Group A Antibodies', value: 'Anti-B antibodies in plasma' },
        { label: 'Blood Group AB Antigens', value: 'Both A and B antigens on RBC surface (Universal RBC Recipient)' },
        { label: 'Blood Group O Antigens', value: 'Neither A nor B antigen on RBC surface (Universal RBC Donor)' },
        { label: 'Most Important Rh Antigen', value: 'Antigen D (~85% Rh-positive)' },
        { label: 'Anti-D Immunoglobulin Class', value: 'IgG (can cross placenta to cause erythroblastosis fetalis)' },
        { label: 'HDFN Setup & Prophylaxis', value: 'Rh-negative mother, Rh-positive fetus; prevented with RhoGAM at 28w and delivery' },
      ],
    },
  ];

  const filteredSections = sections.map((sec) => ({
    ...sec,
    items: sec.items.filter(
      (item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.value.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((sec) => sec.items.length > 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>High-Yield Summary</span>
            <span aria-hidden="true">·</span>
            <span>All 65 Handout Facts</span>
            <span aria-hidden="true">·</span>
            <span>Board Examination Digest</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Rapid High-Yield Clinical Reference Sheet
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Quick-access review tables for all definitions, reference ranges, biochemical pathways, and clinical correlations in the 65 review MCQs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facts (e.g. B12, PT, HbS)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 w-52 md:w-64"
            />
          </div>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSections.map((sec, idx) => (
          <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 font-bold text-xs text-slate-800">
              {sec.title}
            </div>
            <div className="divide-y divide-slate-100">
              {sec.items.map((item, i) => (
                <div key={i} className="p-3 text-xs flex flex-col sm:flex-row sm:items-start justify-between gap-1 hover:bg-white transition-colors">
                  <span className="font-semibold text-slate-900 sm:w-2/5 shrink-0">
                    {item.label}
                  </span>
                  <span className="text-slate-600 sm:w-3/5 text-right sm:text-left font-mono sm:font-sans">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
