import React from 'react';
import { Heart, ExternalLink, GraduationCap, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-auto bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 transition-colors duration-300 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="w-6 h-6 text-sjit-blue-700 dark:text-sjit-gold-400" />
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">SJIT Internal Mark Portal</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            A premium diagnostic tool for engineering students to calculate their internal assessment scores, simulate grading outcomes, and stay on top of academic eligibility requirements.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">Quick Resources</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <a href="https://stjosephstechnology.ac.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-sjit-blue-700 dark:hover:text-sjit-gold-400 transition-colors">
                SJIT Main Website <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </li>

          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4">College Details</h4>
          <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
            <p>
              St. Joseph's Institute of Technology,<br />
              OMR, Chennai, Tamil Nadu, 600119
            </p>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Affiliated to Anna University. Autonomous Institution.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          &copy; {new Date().getFullYear()} St. Joseph's Institute of Technology. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Made with <Heart className="inline-block w-4 h-4 text-rose-500 mx-0.5 heart-pulse fill-rose-500" /> by AMBRISH JEYAN T [IT]
          </p>
        </div>
      </div>
    </footer>
  );
}
