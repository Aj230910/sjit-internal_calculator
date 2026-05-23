import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Plus, Trash2, RotateCcw, TrendingUp, BookOpen, Star } from 'lucide-react';
import { estimateCgpa } from '../utils/calc';
import Toast from '../components/Toast';

export default function CgpaEstimator() {
  const [semesters, setSemesters] = useState([
    { id: 1, name: 'Semester 1', gpa: '', credits: '20' },
    { id: 2, name: 'Semester 2', gpa: '', credits: '20' },
  ]);
  const [toast, setToast] = useState(null);
  const [cgpaResult, setCgpaResult] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleSemesterChange = (id, field, val) => {
    setSemesters(
      semesters.map(sem => (sem.id === id ? { ...sem, [field]: val } : sem))
    );
  };

  const handleAddSemester = () => {
    const newId = semesters.length > 0 ? Math.max(...semesters.map(s => s.id)) + 1 : 1;
    setSemesters([
      ...semesters,
      { id: newId, name: `Semester ${newId}`, gpa: '', credits: '20' }
    ]);
  };

  const handleRemoveSemester = (id) => {
    setSemesters(semesters.filter(sem => sem.id !== id));
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    
    // Validate inputs
    let hasError = false;
    semesters.forEach(sem => {
      const gpa = parseFloat(sem.gpa);
      const credits = parseFloat(sem.credits);
      if (isNaN(gpa) || gpa < 0 || gpa > 10) {
        hasError = true;
      }
      if (isNaN(credits) || credits <= 0) {
        hasError = true;
      }
    });

    if (hasError) {
      showToast("Please enter valid GPA (0-10) and credits (>0) for all semesters.", "error");
      return;
    }

    const res = estimateCgpa(semesters);
    setCgpaResult(res);
    showToast("CGPA Estimated successfully!", "success");
  };

  const handleReset = () => {
    setSemesters([
      { id: 1, name: 'Semester 1', gpa: '', credits: '20' },
      { id: 2, name: 'Semester 2', gpa: '', credits: '20' },
    ]);
    setCgpaResult(null);
    showToast("Estimator reset successfully", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16">
      
      {/* Page Header */}
      <div className="text-center md:text-left mb-10 mt-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white flex items-center justify-center md:justify-start gap-2">
          <Award className="w-8 h-8 text-sjit-blue-700 dark:text-sjit-gold-400" />
          CGPA Estimator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
          Forecast your future target semesters and estimate cumulative graduation GPAs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Semesters Inputs */}
        <div className="lg:col-span-7">
          <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-sjit-blue-700 dark:bg-sjit-gold-400"></div>
            
            <form onSubmit={handleCalculate} className="flex flex-col gap-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-850 dark:text-white">Semester Scores</h3>
                <button
                  type="button"
                  onClick={handleAddSemester}
                  className="flex items-center gap-1 text-xs font-extrabold px-3.5 py-2 rounded-xl bg-sjit-blue-50 dark:bg-slate-900 border border-sjit-blue-100/50 dark:border-slate-800 text-sjit-blue-700 dark:text-sjit-gold-400 hover:bg-sjit-blue-100 dark:hover:bg-slate-800/80 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Semester
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <AnimatePresence initial={false}>
                  {semesters.map((sem, idx) => (
                    <motion.div
                      key={sem.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-12 gap-3 items-center bg-slate-100/30 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/40"
                    >
                      <div className="col-span-5 text-left pl-1.5">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-350">{sem.name}</span>
                      </div>
                      
                      <div className="col-span-3">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={sem.gpa}
                          onChange={(e) => handleSemesterChange(sem.id, 'gpa', e.target.value)}
                          placeholder="GPA (0-10)"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-center font-bold focus:outline-none focus:ring-1 focus:ring-sjit-blue-500 dark:focus:ring-sjit-gold-400"
                          required
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          min="1"
                          value={sem.credits}
                          onChange={(e) => handleSemesterChange(sem.id, 'credits', e.target.value)}
                          placeholder="Credits"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-center font-semibold focus:outline-none focus:ring-1 focus:ring-sjit-blue-500 dark:focus:ring-sjit-gold-400"
                          required
                        />
                      </div>

                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveSemester(sem.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all"
                          disabled={semesters.length <= 1}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-3 mt-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-sjit-blue-700 to-sjit-blue-600 text-white dark:from-sjit-gold-400 dark:to-sjit-gold-500 dark:text-slate-950 font-bold text-sm tracking-wider shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <TrendingUp className="w-4 h-4" />
                  Estimate CGPA
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-255/10 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all flex items-center justify-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Output: Dashboard Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {!cgpaResult ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-6 min-h-[300px] border-2 border-dashed border-slate-350 dark:border-slate-800"
              >
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-450 animate-pulse">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-150">Awaiting Inputs</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xs mx-auto">
                    Fill in semester grade point averages (GPA) and course credits on the left to see cumulative forecasting.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="glass-card rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 text-left flex flex-col gap-6"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-sjit-blue-500/10 dark:bg-sjit-gold-400/5 rounded-full blur-xl"></div>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold px-3 py-1 bg-sjit-blue-50 dark:bg-slate-800/80 text-sjit-blue-700 dark:text-sjit-gold-400 border border-sjit-blue-100/50 dark:border-slate-700/50 rounded-full tracking-wider uppercase">
                    Cumulative Audit
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2 text-center py-4 bg-slate-100/30 dark:bg-slate-950/20 rounded-2xl border border-slate-200/50 dark:border-slate-800/40">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Estimated CGPA</p>
                  <span className="text-6xl font-black text-sjit-blue-700 dark:text-sjit-gold-400 tracking-tighter">
                    {cgpaResult.cgpa}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-450 dark:text-slate-400 mt-1 font-bold">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>Total Audited Credits: {cgpaResult.totalCredits}</span>
                  </div>
                </div>

                {/* Rating scale */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Standing Classification</h4>
                  
                  <div className="flex flex-col gap-2">
                    {[
                      { range: '9.0 - 10.0', label: 'First Class with Exemplary Distinction', active: cgpaResult.cgpa >= 9.0, color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-500/10' },
                      { range: '7.5 - 8.99', label: 'First Class with Distinction', active: cgpaResult.cgpa >= 7.5 && cgpaResult.cgpa < 9.0, color: 'text-blue-500 dark:text-blue-400 bg-blue-500/10' },
                      { range: '6.5 - 7.49', label: 'First Class standing', active: cgpaResult.cgpa >= 6.5 && cgpaResult.cgpa < 7.5, color: 'text-amber-500 dark:text-amber-400 bg-amber-500/10' },
                      { range: '5.0 - 6.49', label: 'Second Class standing', active: cgpaResult.cgpa >= 5.0 && cgpaResult.cgpa < 6.5, color: 'text-slate-500 dark:text-slate-400 bg-slate-500/10' },
                    ].map((classification, idx) => (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center p-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                          classification.active 
                            ? `${classification.color} border-slate-200/50 dark:border-slate-800 scale-102 shadow-sm font-bold`
                            : 'border-transparent text-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          {classification.active && <Star className="w-3 h-3 fill-current" />}
                          {classification.label}
                        </span>
                        <span>{classification.range}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-center italic mt-2">
                  Classification is estimated based on autonomous Anna University grading systems.
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
