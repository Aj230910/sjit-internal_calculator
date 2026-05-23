import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Award, 
  TrendingUp, 
  FileText, 
  Moon, 
  ShieldCheck, 
  Sparkles, 
  GraduationCap
} from 'lucide-react';

export default function Home({ setActivePage }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const features = [
    {
      icon: Calculator,
      title: "SJIT Official Mode",
      description: "Calculates internal marks (out of 40) using Model 1, 2, 3 scores, optional 1.5x bonus, and categories (General, HOPE Elite, PEP).",
      color: "from-blue-500 to-indigo-600 text-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Visually represents your marks breakdown with gorgeous interactive pie charts, comparative bar charts, and eligibility gauges.",
      color: "from-emerald-500 to-teal-600 text-emerald-500",
    },
    {
      icon: Award,
      title: "GPA & CGPA Estimator",
      description: "Forecasts your current and future semesters to estimate cumulative CGPAs instantly based on credits and estimated GPAs.",
      color: "from-purple-500 to-pink-600 text-purple-500",
    },
    {
      icon: FileText,
      title: "PDF & Print Reports",
      description: "Generates beautiful report cards containing your details, marks sheet, eligibility status, and charts that you can print or download.",
      color: "from-cyan-500 to-blue-600 text-cyan-500",
    },
    {
      icon: Moon,
      title: "Dark Mode & Responsive",
      description: "Features a modern premium interface that adapts seamlessly to light or dark mode on mobile, tablet, and desktop screens.",
      color: "from-violet-500 to-purple-600 text-violet-500",
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center gap-16"
    >
      {/* Hero Section */}
      <motion.div 
        variants={itemVariants} 
        className="w-full text-center flex flex-col items-center gap-6 mt-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-slate-200/50 dark:border-slate-800/40 text-sjit-blue-700 dark:text-sjit-gold-400 text-xs md:text-sm font-semibold tracking-wider uppercase mb-2">
          <Sparkles className="w-4 h-4 animate-spin-slow" />
          Autonomous Academic Portal
        </div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-tight">
          Smart Internal Mark <br />
          <span className="bg-gradient-to-r from-sjit-blue-700 via-indigo-500 to-sjit-blue-500 dark:from-sjit-gold-400 dark:via-sjit-gold-300 dark:to-sjit-gold-500 bg-clip-text text-transparent">
            Calculator
          </span>
        </h2>

        <p className="max-w-2xl text-slate-600 dark:text-slate-400 text-md md:text-lg font-medium leading-relaxed">
          The ultimate academic companion for students of <strong>St. Joseph's Institute of Technology</strong>. Check exam eligibility, simulate grades, and analyze marks in real-time.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full justify-center">
          <button
            onClick={() => setActivePage('calculator')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sjit-blue-700 to-sjit-blue-600 text-white dark:from-sjit-gold-400 dark:to-sjit-gold-500 dark:text-slate-950 font-bold text-md tracking-wider shadow-lg shadow-sjit-blue-700/20 dark:shadow-sjit-gold-400/20 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Calculator className="w-5 h-5" />
            Calculate Marks
          </button>
          
          <button
            onClick={() => setActivePage('cgpa')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-md tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Award className="w-5 h-5" />
            Estimate CGPA
          </button>
        </div>
      </motion.div>

      {/* College Info Banner */}
      <motion.div 
        variants={itemVariants}
        className="w-full glass-card rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="p-4 rounded-2xl bg-sjit-blue-50 dark:bg-slate-900 border border-sjit-blue-100 dark:border-slate-800 text-sjit-blue-700 dark:text-sjit-gold-400 flex-shrink-0">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">St. Joseph's Institute of Technology</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
              An institution known for academic excellence. This portal supports the official Model-Exam-based grading scheme.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 px-4 py-2.5 rounded-2xl text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-xs md:text-sm font-bold tracking-wide uppercase">Regulation 2021 Compliant</span>
        </div>
      </motion.div>

      {/* Feature Section */}
      <div className="w-full flex flex-col gap-8">
        <div className="text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
            Features & Capabilities
          </h3>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
            Everything you need to predict, optimize, and log your internal achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="glass-card rounded-2xl p-6 flex flex-col items-start gap-4 transition-all duration-300 text-left cursor-pointer group"
              >
                <div className={`p-3.5 rounded-xl bg-gradient-to-tr ${feature.color.split(' ')[0]} ${feature.color.split(' ')[1]} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white mb-2 group-hover:text-sjit-blue-700 dark:group-hover:text-sjit-gold-400 transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
