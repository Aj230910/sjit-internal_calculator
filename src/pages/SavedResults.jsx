import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, Calendar, FileText, ChevronRight, GraduationCap, Download, RefreshCw } from 'lucide-react';
import Toast from '../components/Toast';
import jsPDF from 'jspdf';

export default function SavedResults() {
  const [reports, setReports] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const data = JSON.parse(localStorage.getItem('sjit_saved_reports')) || [];
    // Sort by date newest first
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
    setReports(data);
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleDeleteReport = (id, e) => {
    e.stopPropagation();
    const updated = reports.filter(r => r.id !== id);
    localStorage.setItem('sjit_saved_reports', JSON.stringify(updated));
    setReports(updated);
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
    showToast("Report deleted successfully", "success");
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all saved reports?")) {
      localStorage.removeItem('sjit_saved_reports');
      setReports([]);
      setSelectedReport(null);
      showToast("All reports cleared", "success");
    }
  };

  // Re-use PDF downloading logic
  const handleDownloadPDF = (report, e) => {
    if (e) e.stopPropagation();
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const isSjit = report.type === 'sjit';
    const res = report.result;
    const details = report.details;

    const primaryColor = [15, 44, 89];
    
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("ST. JOSEPH'S INSTITUTE OF TECHNOLOGY", 105, 18, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Smart Internal Mark Calculator Report", 105, 28, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Generated: ${report.date}`, 105, 36, { align: 'center' });

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT DETAILS", 20, 58);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Name: ${details.name || 'N/A'}`, 20, 66);
    doc.text(`Register No: ${details.regNo || 'N/A'}`, 20, 72);
    doc.text(`Department: ${details.department}`, 110, 66);
    doc.text(`Semester: ${details.semester}`, 110, 72);
    doc.text(`Subject: ${details.subject || 'N/A'}`, 20, 78);

    doc.setDrawColor(220, 220, 220);
    doc.line(20, 84, 190, 84);

    if (isSjit) {
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
        ["Category Activity 1", `${res.pt1}`],
        ["Category Activity 2", `${res.pt2}`],
        ["Category Activity 3", `${res.pt3}`],
      ];

      let yPos = 102;
      rows.forEach(([label, value]) => {
        doc.text(label, 20, yPos);
        doc.text(value, 150, yPos);
        doc.line(20, yPos + 2, 190, yPos + 2);
        yPos += 8;
      });

      doc.setFillColor(245, 247, 250);
      doc.rect(20, yPos + 4, 170, 36, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...primaryColor);
      doc.text(`TOTAL INTERNAL MARK: ${res.internalMark} / 40`, 30, yPos + 14);
      
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text(`Minimum Marks Needed in External (Semester) Exam to Pass: ${res.requiredExternal} / 100`, 30, yPos + 24);

    } else {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("COMPONENT WEIGHTAGE EVALUATION (OUT OF 100)", 20, 94);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const rows = [
        ["Assignment 1 & 2 Average (10% Weight)", `${res.breakdown.assignments} / 10`],
        ["Cycle Test 1 & 2 Average (20% Weight)", `${res.breakdown.cycleTests} / 20`],
        ["Model Exam (50% Weight)", `${res.breakdown.model} / 50`],
        ["Attendance Score (10% Weight)", `${res.breakdown.attendance} / 10`],
        ["Lab Assessment (10% Weight)", `${res.breakdown.lab} / 10`],
      ];

      let yPos = 102;
      rows.forEach(([label, value]) => {
        doc.text(label, 20, yPos);
        doc.text(value, 120, yPos);
        doc.line(20, yPos + 2, 190, yPos + 2);
        yPos += 10;
      });

      doc.setFillColor(245, 247, 250);
      doc.rect(20, yPos + 4, 170, 36, 'F');
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      const [rVal, gVal, bVal] = res.isEligible ? [16, 124, 65] : [200, 50, 50];
      doc.setTextColor(rVal, gVal, bVal);
      doc.text(`TOTAL INTERNAL MARK: ${res.totalInternal} / 100`, 30, yPos + 14);
      doc.text(`ELIGIBILITY STATUS: ${res.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}`, 30, yPos + 22);
    }

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("St. Joseph's Institute of Technology Student Portal - Smart Calculator", 105, 280, { align: 'center' });

    doc.save(`SJIT_Report_${details.subject || 'Marks'}.pdf`);
    showToast("PDF report downloaded!", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10 mt-6 text-center sm:text-left w-full">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center sm:justify-start gap-2">
            <Bookmark className="w-8 h-8 text-sjit-blue-700 dark:text-sjit-gold-400" />
            Saved Reports
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
            Browse, inspect, and export your previously audited subject mark sheets.
          </p>
        </div>
        {reports.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-rose-250 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100/50 text-xs font-bold transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Reports list */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {reports.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-6 min-h-[300px] border-2 border-dashed border-slate-350 dark:border-slate-800"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-450">
                  <Bookmark className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-850 dark:text-slate-150">No Saved Reports</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                    You haven't saved any reports yet. Complete a calculation and click the bookmark button to save it locally.
                  </p>
                </div>
              </motion.div>
            ) : (
              reports.map((report) => (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => setSelectedReport(report)}
                  className={`glass-card rounded-2xl p-5 text-left flex items-center justify-between border cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 ${
                    selectedReport?.id === report.id
                      ? 'border-sjit-blue-700 dark:border-sjit-gold-400 bg-slate-100/50 dark:bg-slate-900/40 ring-1 ring-sjit-blue-700/20 dark:ring-sjit-gold-400/20'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-4 truncate">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                      report.type === 'sjit' 
                        ? 'bg-sjit-blue-50 dark:bg-slate-900 text-sjit-blue-700 dark:text-sjit-gold-400 border border-sjit-blue-100/50 dark:border-slate-800' 
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-350'
                    }`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {report.details?.subject || 'All Subjects'}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-semibold flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.date}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
                        {report.type === 'sjit' ? 'SJIT Mode' : 'Component Mode'} &bull; S{report.details?.semester}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <span className="text-lg font-black text-sjit-blue-700 dark:text-sjit-gold-400">
                        {report.type === 'sjit' ? report.result?.internalMark : report.result?.totalInternal}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {report.type === 'sjit' ? '/40' : '/100'}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteReport(report.id, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-slate-350 dark:text-slate-700" />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Right: Selected Report Details Panel */}
        <div className="lg:col-span-6">
          <AnimatePresence mode="wait">
            {!selectedReport ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-6 min-h-[350px] border-2 border-dashed border-slate-350 dark:border-slate-800"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-450">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-150">Report Inspector</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                    Select a report from the list on the left to inspect its detailed grading statistics and marks breakdown.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                className="glass-card rounded-2xl p-6 text-left flex flex-col gap-6"
              >
                <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-800/50 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white">
                      {selectedReport.details?.subject || 'All Subjects'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      Report ID: {selectedReport.id}
                    </p>
                  </div>
                  <button
                    onClick={(e) => handleDownloadPDF(selectedReport, e)}
                    className="flex items-center gap-1 text-xs font-bold px-3.5 py-2 bg-gradient-to-r from-sjit-blue-700 to-sjit-blue-600 text-white dark:from-sjit-gold-400 dark:to-sjit-gold-500 dark:text-slate-950 rounded-xl shadow-sm hover:scale-102 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>

                {/* Details Sheet */}
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4 bg-slate-100/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200/40 dark:border-slate-800/40 text-xs">
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Student Name</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedReport.details?.name || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Register No</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedReport.details?.regNo || 'N/A'}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Department & Sem</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedReport.details?.department} - Sem {selectedReport.details?.semester}</span>
                    </div>
                    <div className="mt-2">
                      <span className="font-bold text-slate-400 uppercase tracking-wider block">Saved Date</span>
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 block">{selectedReport.date}</span>
                    </div>
                  </div>

                  {selectedReport.type === 'sjit' ? (
                    <div className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Marks breakdown</h4>
                      
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Model 1 Exam Score</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.m1} / 100</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Model 2 Exam Score</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.m2} / 100</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Model 3 Exam Score</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.m3} / 100</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Model 1 & 2 Weight (10)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.first_10} / 10</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Model 3 Weight (10)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.second_10} / 10</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Bonus Extra Marks (20)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">
                          {selectedReport.result?.pt1 + selectedReport.result?.pt2 + selectedReport.result?.pt3} / 20
                        </span>
                      </div>

                      <div className="mt-4 p-4 rounded-xl bg-sjit-blue-50/50 dark:bg-slate-950/20 border border-sjit-blue-100/30 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Total Sjit Internal</span>
                        <span className="text-3xl font-black text-sjit-blue-700 dark:text-sjit-gold-400 block mt-1">
                          {selectedReport.result?.internalMark} / 40
                        </span>
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-350 block mt-1.5">
                          External exam mark required to pass: <strong className="text-slate-850 dark:text-slate-100">{selectedReport.result?.requiredExternal} / 100</strong>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Component breakdowns</h4>
                      
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Assignments (10%)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.breakdown?.assignments} / 10</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Cycle Tests (20%)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.breakdown?.cycleTests} / 20</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Model Exam (50%)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.breakdown?.model} / 50</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Attendance (10%)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.breakdown?.attendance} / 10</span>
                      </div>
                      <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100 dark:border-slate-900/50">
                        <span className="font-semibold text-slate-500 dark:text-slate-400">Lab Marks (10%)</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedReport.result?.breakdown?.lab} / 10</span>
                      </div>

                      <div className="mt-4 p-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/20 border border-slate-200/40 dark:border-slate-800 text-center">
                        <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wider block">Aggregate Internal</span>
                        <span className="text-3xl font-black text-slate-700 dark:text-white block mt-1">
                          {selectedReport.result?.totalInternal} / 100
                        </span>
                        <div className="mt-2.5">
                          <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                            selectedReport.result?.isEligible 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-450'
                          }`}>
                            {selectedReport.result?.isEligible ? 'Eligible for Exams' : 'Not Eligible'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
