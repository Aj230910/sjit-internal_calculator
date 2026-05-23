import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Layers,
  RotateCcw,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Bookmark,
  Download,
  Printer,
  Percent,
  Sparkles,
  User,
  Hash,
  BookOpen,
  Calendar,
  Grid,
  TrendingUp,
  FileText
} from 'lucide-react';
import { calculateSjitInternal } from '../utils/calc';
import Toast from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReChartsTooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import jsPDF from 'jspdf';

export default function CalculatorPage() {
  const activeTab = 'sjit';
  const [toast, setToast] = useState(null);
  const uiStyle = 'premium';

  // Student details
  const [studentDetails, setStudentDetails] = useState({
    name: 'AMBRISH JEYAN T',
    regNo: 'IT',
    department: 'IT',
    semester: '4',
    subject: 'Marks'
  });

  // State for SJIT Mode
  const [sjitMarks, setSjitMarks] = useState({
    m1: '',
    m2: '',
    m3: '',
    bonusEnabled: true,
    category: 'general',
    pt1: '0', // NPTEL / Certification / etc.
    pt2: '0', // Course / Assessment
    pt3: '0', // Extra / Performance
  });

  // Results State
  const [sjitResult, setSjitResult] = useState(null);

  // Interactive slider internal mark (for possible grades simulator)
  const [simulatedInternal, setSimulatedInternal] = useState(0);

  // Error shaking states
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleDetailsChange = (e) => {
    setStudentDetails({
      ...studentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSjitMarkChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSjitMarks({
      ...sjitMarks,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const triggerShake = (id) => {
    setErrors(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setErrors(prev => ({ ...prev, [id]: false }));
    }, 400);

    // Trigger mobile vibration if supported
    if (navigator.vibrate) {
      navigator.vibrate(150);
    }
  };

  // Reset function
  const handleReset = () => {
    setSjitMarks({
      m1: '',
      m2: '',
      m3: '',
      bonusEnabled: true,
      category: 'general',
      pt1: '0',
      pt2: '0',
      pt3: '0',
    });
    setSjitResult(null);
    setErrors({});
    showToast("Calculator reset successfully", "success");
  };

  // SJIT Submit
  const handleSjitCalculate = (e) => {
    e.preventDefault();
    setErrors({});

    const m1Val = parseFloat(sjitMarks.m1);
    const m2Val = parseFloat(sjitMarks.m2);
    const m3Val = parseFloat(sjitMarks.m3);
    const pt1Val = parseFloat(sjitMarks.pt1) || 0;
    const pt2Val = parseFloat(sjitMarks.pt2) || 0;
    const pt3Val = parseFloat(sjitMarks.pt3) || 0;

    let localErrors = {};
    let hasError = false;

    // Validate Exams
    if (isNaN(m1Val) || m1Val < 0 || m1Val > 100) { localErrors.m1 = true; triggerShake('m1'); hasError = true; }
    if (isNaN(m2Val) || m2Val < 0 || m2Val > 100) { localErrors.m2 = true; triggerShake('m2'); hasError = true; }
    if (isNaN(m3Val) || m3Val < 0 || m3Val > 100) { localErrors.m3 = true; triggerShake('m3'); hasError = true; }

    // Validate Category limits
    let max1 = 8, max2 = 7, max3 = 5;
    if (sjitMarks.category === 'hope_elite' || sjitMarks.category === 'pep') {
      max1 = 7; max2 = 6; max3 = 7;
    }

    if (pt1Val < 0 || pt1Val > max1) { localErrors.pt1 = true; triggerShake('pt1'); hasError = true; }
    if (pt2Val < 0 || pt2Val > max2) { localErrors.pt2 = true; triggerShake('pt2'); hasError = true; }
    if (pt3Val < 0 || pt3Val > max3) { localErrors.pt3 = true; triggerShake('pt3'); hasError = true; }

    if (hasError) {
      showToast("Please enter valid marks within ranges.", "error");
      return;
    }

    const res = calculateSjitInternal(m1Val, m2Val, m3Val, sjitMarks.category, sjitMarks.bonusEnabled, {
      pt1: pt1Val,
      pt2: pt2Val,
      pt3: pt3Val
    });

    setSjitResult(res);
    setSimulatedInternal(res.internalMark);

    // Celebration!
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });

    showToast("Calculated successfully!", "success");
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const res = sjitResult;

    if (!res) {
      showToast("Please calculate marks first.", "error");
      return;
    }

    // Colors
    const primaryColor = [109, 40, 217]; // Royal Violet #6D28D9
    const secondaryColor = [45, 212, 191]; // Neo Mint Teal #2DD4BF

    // Header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("ST. JOSEPH'S INSTITUTE OF TECHNOLOGY", 105, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Smart Internal Mark Calculator Report", 105, 28, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 105, 36, { align: 'center' });

    // Student Info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT DETAILS", 20, 58);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${studentDetails.name || 'N/A'}`, 20, 66);
    doc.text(`Register No: ${studentDetails.regNo || 'N/A'}`, 20, 72);
    doc.text(`Department: ${studentDetails.department}`, 110, 66);
    doc.text(`Semester: ${studentDetails.semester}`, 110, 72);
    doc.text(`Subject: ${studentDetails.subject || 'N/A'}`, 20, 78);

    // Separator line
    doc.setDrawColor(220, 220, 220);
    doc.line(20, 84, 190, 84);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("INTERNAL MARKS EVALUATION (OUT OF 40)", 20, 94);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const rows = [
      ["Model 1 Exam Score", `${res.m1} / 100`],
      ["Model 2 Exam Score", `${res.m2} / 100`],
      ["Model 3 Exam Score", `${res.m3} / 100`],
      ["Model 1 & 2 Weightage (Max 10)", `${res.first_10} / 10`],
      ["Model 3 Weightage (Max 10)", `${res.second_10} / 10`],
      [`Category Activity 1 (${res.category === 'general' ? 'NPTEL' : 'Cert'})`, `${res.pt1}`],
      [`Category Activity 2 (${res.category === 'general' ? 'Course' : 'Assessment'})`, `${res.pt2}`],
      [`Category Activity 3 (${res.category === 'general' ? 'Extra' : 'Perf/NPTEL'})`, `${res.pt3}`],
    ];

    let yPos = 102;
    rows.forEach(([label, value]) => {
      doc.text(label, 20, yPos);
      doc.text(value, 150, yPos);
      doc.line(20, yPos + 2, 190, yPos + 2);
      yPos += 8;
    });

    // Total Result Callout Box
    doc.setFillColor(245, 247, 250);
    doc.rect(20, yPos + 4, 170, 36, 'F');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...primaryColor);
    doc.text(`TOTAL INTERNAL MARK: ${res.internalMark} / 40`, 30, yPos + 14);

    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    doc.text(`Minimum Marks Needed in External (Semester) Exam to Pass: ${res.requiredExternal} / 100`, 30, yPos + 24);

    if (res.isSpecialCase) {
      doc.setFontSize(9);
      doc.setTextColor(200, 50, 50);
      doc.text("⚠️ Special Case: Total exam marks < 100. No Category Bonus added.", 30, yPos + 32);
    }

    // Footer signoff
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("St. Joseph's Institute of Technology Student Portal - Smart Calculator", 105, 280, { align: 'center' });

    doc.save(`SJIT_Report_${studentDetails.subject || 'Marks'}.pdf`);
    showToast("PDF report downloaded!", "success");
  };

  // Print Report
  const handlePrint = () => {
    window.print();
  };

  // Simulated Grade outcomes for the slider
  const getSimulatedOutcomes = () => {
    const extScores = [100, 90, 80, 70, 60, 50, 45];
    return extScores.map(extVal => {
      const extContrib = extVal * 0.6;
      const total = Math.min(100, parseFloat((simulatedInternal + extContrib).toFixed(2)));
      return {
        external: extVal,
        total: total,
        grade: total >= 90 ? 'O' : total >= 80 ? 'A+' : total >= 70 ? 'A' : total >= 60 ? 'B+' : total >= 50 ? 'B' : 'RA'
      };
    });
  };

  const getSjitChartData = () => {
    if (!sjitResult) return [];
    const isDark = document.documentElement.classList.contains('dark');
    return [
      { name: 'Model 1 & 2', value: sjitResult.first_10, color: isDark ? '#d97706' : '#c084fc' }, // sjit-gold-600 in dark mode
      { name: 'Model 3', value: sjitResult.second_10, color: isDark ? '#b45309' : '#8b5cf6' },    // sjit-gold-700 in dark mode
      { name: 'Bonus 1', value: sjitResult.pt1, color: '#fcd34d' },                              // sjit-gold-300
      { name: 'Bonus 2', value: sjitResult.pt2, color: '#fbbf24' },                              // sjit-gold-400
      { name: 'Bonus 3', value: sjitResult.pt3, color: '#f59e0b' },                              // sjit-gold-500
    ];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16">

      {/* Page Header */}
      <div className="text-center md:text-left mb-10 mt-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-2">
          <Calculator className="w-8 h-8 text-sjit-blue-700 dark:text-sjit-gold-400" />
          Marks Calculator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
          Perform high-fidelity internal assessment audits with modern analytics tools.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Side: Inputs Panel */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          {/* Marks Input Card */}
          <div className={`rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${uiStyle === 'premium'
              ? 'glass-card border-2 border-sjit-blue-600/15 dark:border-sjit-gold-400/20 shadow-[0_0_30px_rgba(0,88,230,0.05)] dark:shadow-[0_0_30px_rgba(212,163,89,0.08)]'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 shadow-sm'
            }`}>
            <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors duration-500 ${uiStyle === 'premium' ? 'bg-gradient-to-b from-sjit-blue-500 to-sjit-blue-700 dark:from-sjit-gold-300 dark:to-sjit-gold-500' : 'bg-sjit-blue-700 dark:bg-sjit-gold-400'
              }`}></div>

            {/* SJIT Tab Form */}
            <form onSubmit={handleSjitCalculate} className="flex flex-col gap-5">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-extrabold text-slate-850 dark:text-white tracking-tight">Exam Marks Entry</h3>
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Bonus [1.5x]</span>
                  <button
                    type="button"
                    onClick={() => setSjitMarks(prev => ({ ...prev, bonusEnabled: !prev.bonusEnabled }))}
                    className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-300 focus:outline-none ${sjitMarks.bonusEnabled ? 'bg-sjit-blue-700 dark:bg-sjit-gold-400' : 'bg-slate-300 dark:bg-slate-800'
                      }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white dark:bg-slate-950 transition-transform duration-300 ${sjitMarks.bonusEnabled ? 'translate-x-5.5' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              </div>

              {/* Model Exams Row */}
              <div className="grid grid-cols-3 gap-3.5">
                <div className={`p-3.5 rounded-2xl border-2 transition-all duration-300 ${errors.m1
                    ? 'border-red-500 bg-red-50/15 animate-vibrate'
                    : uiStyle === 'premium'
                      ? 'border-slate-200 dark:border-slate-800/80 focus-within:border-sjit-gold-400 dark:focus-within:border-sjit-gold-400'
                      : 'border-slate-200 dark:border-slate-800 focus-within:border-sjit-blue-500'
                  }`}>
                  <label className="block text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase mb-1.5 tracking-wider text-center">Model 1</label>
                  <input
                    id="m1"
                    type="number"
                    name="m1"
                    value={sjitMarks.m1}
                    onChange={handleSjitMarkChange}
                    placeholder="0-100"
                    min="0" max="100"
                    className="w-full bg-transparent text-lg focus:outline-none text-center font-black text-sjit-blue-800 dark:text-sjit-gold-400"
                    required
                  />
                </div>
                <div className={`p-3.5 rounded-2xl border-2 transition-all duration-300 ${errors.m2
                    ? 'border-red-500 bg-red-50/15 animate-vibrate'
                    : uiStyle === 'premium'
                      ? 'border-slate-200 dark:border-slate-800/80 focus-within:border-sjit-gold-400 dark:focus-within:border-sjit-gold-400'
                      : 'border-slate-200 dark:border-slate-800 focus-within:border-sjit-blue-500'
                  }`}>
                  <label className="block text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase mb-1.5 tracking-wider text-center">Model 2</label>
                  <input
                    id="m2"
                    type="number"
                    name="m2"
                    value={sjitMarks.m2}
                    onChange={handleSjitMarkChange}
                    placeholder="0-100"
                    min="0" max="100"
                    className="w-full bg-transparent text-lg focus:outline-none text-center font-black text-sjit-blue-800 dark:text-sjit-gold-400"
                    required
                  />
                </div>
                <div className={`p-3.5 rounded-2xl border-2 transition-all duration-300 ${errors.m3
                    ? 'border-red-500 bg-red-50/15 animate-vibrate'
                    : uiStyle === 'premium'
                      ? 'border-slate-200 dark:border-slate-800/80 focus-within:border-sjit-gold-400 dark:focus-within:border-sjit-gold-400'
                      : 'border-slate-200 dark:border-slate-800 focus-within:border-sjit-blue-500'
                  }`}>
                  <label className="block text-[10px] font-black text-slate-450 dark:text-slate-400 uppercase mb-1.5 tracking-wider text-center">Model 3</label>
                  <input
                    id="m3"
                    type="number"
                    name="m3"
                    value={sjitMarks.m3}
                    onChange={handleSjitMarkChange}
                    placeholder="0-100"
                    min="0" max="100"
                    className="w-full bg-transparent text-lg focus:outline-none text-center font-black text-sjit-blue-800 dark:text-sjit-gold-400"
                    required
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Category Select</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-100/50 dark:bg-slate-900/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                  {['general', 'hope_elite', 'pep'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSjitMarks({ ...sjitMarks, category: cat })}
                      className={`py-2 px-1 rounded-lg text-xs font-bold capitalize transition-all duration-300 ${sjitMarks.category === cat
                          ? 'bg-white dark:bg-slate-800 text-sjit-blue-700 dark:text-sjit-gold-400 shadow-sm'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                    >
                      {cat.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Extra Mark Inputs */}
              <div className="flex flex-col gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-550 dark:text-slate-350 flex items-center gap-1">
                    Co-curricular Extra Credits (Max 20 Marks Total)
                  </span>
                  {(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100 && (
                    <span className="text-[10px] text-rose-500 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded border border-rose-200/30">
                      Exam Total &lt; 100: Disabled
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {sjitMarks.category === 'general' && (
                    <>
                      <div className={`p-2 rounded-xl border ${errors.pt1 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">NPTEL (Max 8)</label>
                        <input
                          id="pt1"
                          type="number" step="0.01" min="0" max="8"
                          name="pt1" value={sjitMarks.pt1} onChange={handleSjitMarkChange}
                          placeholder="Max 8" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                      <div className={`p-2 rounded-xl border ${errors.pt2 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">Course (Max 7)</label>
                        <input
                          id="pt2"
                          type="number" step="0.01" min="0" max="7"
                          name="pt2" value={sjitMarks.pt2} onChange={handleSjitMarkChange}
                          placeholder="Max 7" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                      <div className={`p-2 rounded-xl border ${errors.pt3 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">Extra (Max 5)</label>
                        <input
                          id="pt3"
                          type="number" step="0.01" min="0" max="5"
                          name="pt3" value={sjitMarks.pt3} onChange={handleSjitMarkChange}
                          placeholder="Max 5" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                    </>
                  )}

                  {sjitMarks.category === 'hope_elite' && (
                    <>
                      <div className={`p-2 rounded-xl border ${errors.pt1 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">Cert (Max 7)</label>
                        <input
                          id="pt1"
                          type="number" step="0.01" min="0" max="7"
                          name="pt1" value={sjitMarks.pt1} onChange={handleSjitMarkChange}
                          placeholder="Max 7" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                      <div className={`p-2 rounded-xl border ${errors.pt2 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">Assess (Max 6)</label>
                        <input
                          id="pt2"
                          type="number" step="0.01" min="0" max="6"
                          name="pt2" value={sjitMarks.pt2} onChange={handleSjitMarkChange}
                          placeholder="Max 6" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                      <div className={`p-2 rounded-xl border ${errors.pt3 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">Perf (Max 7)</label>
                        <input
                          id="pt3"
                          type="number" step="0.01" min="0" max="7"
                          name="pt3" value={sjitMarks.pt3} onChange={handleSjitMarkChange}
                          placeholder="Max 7" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                    </>
                  )}

                  {sjitMarks.category === 'pep' && (
                    <>
                      <div className={`p-2 rounded-xl border ${errors.pt1 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">Cert/Crse (7)</label>
                        <input
                          id="pt1"
                          type="number" step="0.01" min="0" max="7"
                          name="pt1" value={sjitMarks.pt1} onChange={handleSjitMarkChange}
                          placeholder="Max 7" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                      <div className={`p-2 rounded-xl border ${errors.pt2 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">Assess (Max 6)</label>
                        <input
                          id="pt2"
                          type="number" step="0.01" min="0" max="6"
                          name="pt2" value={sjitMarks.pt2} onChange={handleSjitMarkChange}
                          placeholder="Max 6" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                      <div className={`p-2 rounded-xl border ${errors.pt3 ? 'border-red-500 bg-red-50/15 animate-vibrate' : 'border-slate-200 dark:border-slate-800'}`}>
                        <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase mb-1">NPTEL (Max 7)</label>
                        <input
                          id="pt3"
                          type="number" step="0.01" min="0" max="7"
                          name="pt3" value={sjitMarks.pt3} onChange={handleSjitMarkChange}
                          placeholder="Max 7" className="w-full bg-transparent text-sm focus:outline-none text-center font-bold"
                          disabled={(parseFloat(sjitMarks.m1) + parseFloat(sjitMarks.m2) + parseFloat(sjitMarks.m3)) < 100}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sjit-blue-700 to-sjit-blue-600 text-white dark:from-sjit-gold-400 dark:to-sjit-gold-500 dark:text-slate-950 font-bold text-sm tracking-wider shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-255/10 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-1"
                  aria-label="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Results Section (expanding on calculations) */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <AnimatePresence mode="wait">

            {!sjitResult && (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-6 min-h-[400px] border-2 border-dashed border-slate-350 dark:border-slate-800"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 animate-pulse">
                  <Calculator className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-slate-800 dark:text-slate-150">Awaiting Calculations</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
                    Enter your academic details on the left and click calculate to reveal your comprehensive internal report card.
                  </p>
                </div>
              </motion.div>
            )}

            {/* 2. SJIT Results Dashboard */}
            {activeTab === 'sjit' && sjitResult && (
              <motion.div
                key="sjit-result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-6"
                id="printable-report"
              >
                {/* Score Summary Banner */}
                <div className={`rounded-2xl p-6 relative overflow-hidden transition-all duration-500 ${uiStyle === 'premium'
                    ? 'glass-card border-2 border-sjit-blue-600/15 dark:border-sjit-gold-400/20 shadow-[0_0_30px_rgba(0,88,230,0.05)] dark:shadow-[0_0_30px_rgba(212,163,89,0.08)] bg-gradient-to-br from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80'
                    : 'bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-850 shadow-sm'
                  }`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sjit-blue-500/10 dark:bg-sjit-gold-400/5 rounded-full blur-2xl"></div>

                  {/* Action Bar */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-sjit-blue-50 dark:bg-slate-800/80 text-sjit-blue-700 dark:text-sjit-gold-400 border border-sjit-blue-100/50 dark:border-slate-700/50 uppercase tracking-wider">
                      Internal Mark Report Card
                    </span>
                  </div>

                  {/* Marks display row */}
                  <div className="flex flex-col md:flex-row items-center justify-around gap-6 mt-4">
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Internals</p>
                      <div className="flex items-baseline justify-center gap-1 mt-2">
                        <span className={`text-5xl font-black tracking-tighter transition-colors duration-500 ${uiStyle === 'premium' ? 'text-transparent bg-clip-text bg-gradient-to-r from-sjit-blue-700 to-sjit-blue-900 dark:from-sjit-gold-400 dark:to-sjit-gold-300' : 'text-sjit-blue-700 dark:text-sjit-gold-400'
                          }`}>
                          {sjitResult.internalMark}
                        </span>
                        <span className="text-sm text-slate-400">/ 40</span>
                      </div>
                    </div>

                    <div className="w-px h-16 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Required External Mark</p>
                      <div className="flex items-baseline justify-center gap-1 mt-2">
                        <span className="text-5xl font-black text-slate-855 dark:text-white tracking-tighter">
                          {sjitResult.requiredExternal}
                        </span>
                        <span className="text-sm text-slate-400">/ 100</span>
                      </div>
                    </div>

                    <div className="w-px h-16 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bonus Scheme</p>
                      <div className="mt-3">
                        <span className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${sjitResult.bonusEnabled
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                          }`}>
                          {sjitResult.bonusEnabled ? 'Active [1.5x]' : 'Inactive [1.0x]'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {sjitResult.isSpecialCase && (
                    <div className="mt-6 flex items-start gap-2 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 p-4 rounded-xl text-left text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold">⚠️ Special Case Notification</h4>
                        <p className="text-xs leading-relaxed mt-0.5 opacity-90">
                          Your model exams total mark ({sjitResult.m1 + sjitResult.m2 + sjitResult.m3}) is less than 100. As per college policies, co-curricular bonus marks are not credited.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bonus Option Comparison Card */}
                <div className={`rounded-2xl p-5 border transition-all duration-500 text-left flex flex-col gap-4 ${uiStyle === 'premium'
                    ? 'glass-card border-2 border-sjit-blue-600/15 dark:border-sjit-gold-400/20 shadow-[0_0_20px_rgba(0,88,230,0.03)] dark:shadow-[0_0_20px_rgba(212,163,89,0.04)] bg-gradient-to-br from-white/40 to-slate-50/40 dark:from-slate-900/40 dark:to-slate-950/40'
                    : 'bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-850 shadow-sm'
                  }`}>
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-450 dark:text-slate-400 uppercase tracking-wider">Bonus Impact Comparison</h4>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Live Simulation</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* With 1.5x Bonus calculation */}
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${sjitResult.bonusEnabled
                        ? 'bg-gradient-to-br from-sjit-blue-500/5 to-sjit-blue-600/10 dark:from-sjit-gold-400/5 dark:to-sjit-gold-500/10 border-sjit-blue-500/20 dark:border-sjit-gold-400/30'
                        : 'bg-slate-50/40 dark:bg-slate-950/20 border-transparent opacity-65'
                      }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">With 1.5x Bonus</span>
                        {sjitResult.bonusEnabled && (
                          <span className="text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded bg-sjit-blue-600/10 dark:bg-sjit-gold-400/20 text-sjit-blue-800 dark:text-sjit-gold-400">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-800 dark:text-white">
                          {calculateSjitInternal(sjitResult.m1, sjitResult.m2, sjitResult.m3, sjitResult.category, true, { pt1: sjitResult.pt1, pt2: sjitResult.pt2, pt3: sjitResult.pt3 }).internalMark}
                        </span>
                        <span className="text-xs text-slate-450">/ 40</span>
                      </div>
                      <p className="text-[10px] text-slate-450 mt-1 font-medium">
                        Model 1 & 2 = {Math.min(10, parseFloat(((sjitResult.m1 * 1.5 + sjitResult.m2 * 1.5) * 0.05).toFixed(2)))} | Model 3 = {Math.min(10, parseFloat((sjitResult.m3 * 1.5 * 0.1).toFixed(2)))}
                      </p>
                    </div>

                    {/* Without Bonus calculation */}
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${!sjitResult.bonusEnabled
                        ? 'bg-gradient-to-br from-sjit-blue-500/5 to-sjit-blue-600/10 dark:from-sjit-gold-400/5 dark:to-sjit-gold-500/10 border-sjit-blue-500/20 dark:border-sjit-gold-400/30'
                        : 'bg-slate-50/40 dark:bg-slate-950/20 border-transparent opacity-65'
                      }`}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Without Bonus</span>
                        {!sjitResult.bonusEnabled && (
                          <span className="text-[8px] font-black tracking-wider px-1.5 py-0.5 rounded bg-sjit-blue-600/10 dark:bg-sjit-gold-400/20 text-sjit-blue-800 dark:text-sjit-gold-400">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-800 dark:text-white">
                          {calculateSjitInternal(sjitResult.m1, sjitResult.m2, sjitResult.m3, sjitResult.category, false, { pt1: sjitResult.pt1, pt2: sjitResult.pt2, pt3: sjitResult.pt3 }).internalMark}
                        </span>
                        <span className="text-xs text-slate-450">/ 40</span>
                      </div>
                      <p className="text-[10px] text-slate-455 mt-1 font-medium">
                        Model 1 & 2 = {Math.min(10, parseFloat(((sjitResult.m1 * 1.0 + sjitResult.m2 * 1.0) * 0.05).toFixed(2)))} | Model 3 = {Math.min(10, parseFloat((sjitResult.m3 * 1.0 * 0.1).toFixed(2)))}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score Breakdowns Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Breakdowns List */}
                  <div className={`rounded-2xl p-6 text-left flex flex-col gap-4 transition-all duration-500 ${uiStyle === 'premium'
                      ? 'glass-card border-2 border-sjit-blue-600/15 dark:border-sjit-gold-400/20 shadow-[0_0_20px_rgba(0,88,230,0.03)] dark:shadow-[0_0_20px_rgba(212,163,89,0.04)] bg-gradient-to-br from-white/40 to-slate-50/40 dark:from-slate-900/40 dark:to-slate-950/40'
                      : 'bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-850 shadow-sm'
                    }`}>
                    <h3 className="font-bold text-slate-800 dark:text-white pb-2 border-b border-slate-200/50 dark:border-slate-800/50">
                      Calculation Breakdowns
                    </h3>

                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Model 1 & 2 Weightage</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{sjitResult.first_10} / 10</span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">Model 3 Weightage</span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{sjitResult.second_10} / 10</span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {sjitResult.category === 'general' ? 'NPTEL Score' : 'Certification'}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {sjitResult.pt1} / {sjitResult.category === 'general' ? '8' : '7'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {sjitResult.category === 'general' ? 'Certificate Course' : 'Assessment'}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {sjitResult.pt2} / {sjitResult.category === 'general' ? '7' : '6'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm py-1">
                      <span className="font-semibold text-slate-500 dark:text-slate-400">
                        {sjitResult.category === 'general' ? 'Extra Co-curricular' : sjitResult.category === 'pep' ? 'NPTEL' : 'Performance'}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {sjitResult.pt3} / {sjitResult.category === 'general' ? '5' : '7'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-md font-bold text-sjit-blue-700 dark:text-sjit-gold-400 border-t border-slate-200/50 dark:border-slate-800/50 pt-3">
                      <span>Aggregate Mark</span>
                      <span>{sjitResult.internalMark} / 40</span>
                    </div>
                  </div>

                  {/* Recharts Analytics Pie Chart */}
                  <div className={`rounded-2xl p-6 flex flex-col items-center justify-center transition-all duration-500 ${uiStyle === 'premium'
                      ? 'glass-card border-2 border-sjit-blue-600/15 dark:border-sjit-gold-400/20 shadow-[0_0_20px_rgba(0,88,230,0.03)] dark:shadow-[0_0_20px_rgba(212,163,89,0.04)] bg-gradient-to-br from-white/40 to-slate-50/40 dark:from-slate-900/40 dark:to-slate-950/40'
                      : 'bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-850 shadow-sm'
                    }`}>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-2 self-start">Marks Share</h3>
                    <div className="w-full h-44 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getSjitChartData()}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {getSjitChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ReChartsTooltip
                            contentStyle={{
                              background: 'rgba(15, 23, 42, 0.95)',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '11px',
                              color: '#fff'
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-slate-700 dark:text-slate-350">{sjitResult.internalMark}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Internal</span>
                      </div>
                    </div>

                    {/* Legends Custom */}
                    <div className="grid grid-cols-3 gap-2 mt-2 w-full text-center">
                      {getSjitChartData().map((entry, idx) => (
                        <div key={idx} className="flex flex-col items-center">
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                            <span className="text-[10px] font-bold text-slate-500 truncate max-w-[65px]">{entry.name}</span>
                          </div>
                          <span className="text-xs font-bold text-slate-850 dark:text-slate-200 mt-0.5">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Possible Marks Grade Simulator */}
                <div className={`rounded-2xl p-6 text-left flex flex-col gap-4 transition-all duration-500 ${uiStyle === 'premium'
                    ? 'glass-card border-2 border-sjit-blue-600/15 dark:border-sjit-gold-400/20 shadow-[0_0_30px_rgba(0,88,230,0.04)] dark:shadow-[0_0_30px_rgba(212,163,89,0.06)] bg-gradient-to-br from-white/60 to-slate-50/60 dark:from-slate-900/60 dark:to-slate-950/60'
                    : 'bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-850 shadow-sm'
                  }`}>
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white">Possible Grade Simulator</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Adjust the slider below to test different internal score scenarios and predict your final grade outputs.
                    </p>
                  </div>

                  {/* Simulator Slider Container */}
                  <div className="p-4 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Simulated Internal Mark</span>
                      <span className="text-md font-extrabold text-sjit-blue-700 dark:text-sjit-gold-400">{simulatedInternal} / 40</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="0.1"
                      value={simulatedInternal}
                      onChange={(e) => setSimulatedInternal(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sjit-blue-700 dark:accent-sjit-gold-400"
                    />

                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>0.0 (Min)</span>
                      <span>20.0 (Average)</span>
                      <span>40.0 (Max)</span>
                    </div>
                  </div>

                  {/* Grade outcomes table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-450 dark:text-slate-500">
                          <th className="py-2.5 font-bold uppercase tracking-wider">External Score (100)</th>
                          <th className="py-2.5 font-bold uppercase tracking-wider">External Weight (60)</th>
                          <th className="py-2.5 font-bold uppercase tracking-wider">Total Combined</th>
                          <th className="py-2.5 font-bold uppercase tracking-wider">Estimated Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSimulatedOutcomes().map((out, idx) => (
                          <tr key={idx} className="border-b border-slate-100 dark:border-slate-900/50 hover:bg-slate-100/30 dark:hover:bg-slate-900/10">
                            <td className="py-3 font-bold text-slate-700 dark:text-slate-350">{out.external} / 100</td>
                            <td className="py-3 font-semibold text-slate-500 dark:text-slate-400">{out.external * 0.6} / 60</td>
                            <td className="py-3 font-extrabold text-slate-850 dark:text-slate-100">{out.total} / 100</td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded font-extrabold ${out.grade === 'O'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : out.grade === 'A+' || out.grade === 'A'
                                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                    : out.grade === 'RA'
                                      ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                }`}>
                                {out.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center italic mt-2">
                    Note: St. Joseph's follows Anna University relative grading. Grade estimates represent standard reference brackets.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
