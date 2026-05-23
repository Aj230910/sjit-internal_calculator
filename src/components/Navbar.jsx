import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Award, Calculator, Home } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // default to dark mode

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'cgpa', label: 'CGPA Estimator', icon: Award },
  ];

  return (
    <nav className="glass-nav fixed top-0 left-0 w-full z-40 px-6 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sjit-blue-700 to-sjit-blue-500 dark:from-sjit-gold-600 dark:to-sjit-gold-400 flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
            <span className="text-white dark:text-slate-950 font-bold text-lg">SJ</span>
          </div>
          <div>
            <h1 className="text-md md:text-lg font-bold text-sjit-blue-700 dark:text-sjit-gold-400 tracking-tight leading-none">
              ST. JOSEPH'S
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider">
              INSTITUTE OF TECHNOLOGY
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-900/50 p-1.5 rounded-full border border-slate-200/50 dark:border-slate-800/50">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-sjit-blue-700 to-sjit-blue-600 text-white dark:from-sjit-gold-400 dark:to-sjit-gold-500 dark:text-slate-950 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-sjit-blue-700 dark:hover:text-sjit-gold-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/30'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions (Theme and Hamburger) */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-sjit-gold-400" /> : <Moon className="w-4 h-4 text-sjit-blue-700" />}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass shadow-2xl border-t border-slate-100 dark:border-slate-800 animate-slide-down">
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl text-left font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-sjit-blue-700 to-sjit-blue-600 text-white dark:from-sjit-gold-400 dark:to-sjit-gold-500 dark:text-slate-950'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
