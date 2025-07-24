import React, { useState, useRef, useEffect, createContext } from 'react';
import './TopNav.css';

const languages = [
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇰🇷', name: 'Korean' },
];

export const StreakContext = createContext<{streak: number, increaseStreak: () => void}>({streak: 0, increaseStreak: () => {}});

function getTodayStr() {
  return new Date().toISOString().slice(0, 10);
}

const TopNav: React.FC<{children?: React.ReactNode}> = ({ children }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [streak, setStreak] = useState(0);
  const [lastStreakDate, setLastStreakDate] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('streak');
    const storedDate = localStorage.getItem('streakDate');
    if (stored) setStreak(Number(stored));
    if (storedDate) setLastStreakDate(storedDate);
  }, []);

  useEffect(() => {
    localStorage.setItem('streak', String(streak));
    localStorage.setItem('streakDate', lastStreakDate);
  }, [streak, lastStreakDate]);

  function increaseStreak() {
    const today = getTodayStr();
    if (lastStreakDate !== today) {
      setStreak(s => s + 1);
      setLastStreakDate(today);
    }
  }

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === 'streak') setStreak(Number(e.newValue));
      if (e.key === 'streakDate' && e.newValue) setLastStreakDate(e.newValue);
    }
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <StreakContext.Provider value={{streak, increaseStreak}}>
      <div className="TopNav">
        <div className="TopNavTitle">Section 1: Rookie</div>
        <div className="TopNavRight">
          <div className="LangSelector" onClick={() => setDropdownOpen((v) => !v)} ref={dropdownRef} tabIndex={0}>
            <span className="LangFlag">🏃</span>
            <span className="LangName">Running</span>
            <span className="LangDropdown">▼</span>
            {dropdownOpen && (
              <div className="LangDropdownMenu">
                <div className="LangDropdownItem selected">
                  <span className="LangFlag">🏃</span> Running
                </div>
                <div className="LangDropdownItem">
                  <span className="LangFlag">🧘</span> Yoga

                </div>
                <div className="LangDropdownItem add">
                  <span className="LangAdd">＋</span> Add a new course
                </div>
              </div>
            )}
          </div>
          <div className="TopNavCounter TopNavStreak">
            <span className="StreakIcon">🔥</span>
            <span className="StreakCount">{streak}</span>
          </div>
          <div className="TopNavCounter TopNavGems">
            <span className="GemIcon">💎</span>
            <span className="GemCount">3350</span>
          </div>
          <div className="TopNavCounter TopNavHearts">
            <span className="HeartIcon">❤️</span>
            <span className="HeartCount">5</span>
          </div>
        </div>
      </div>
      {children}
    </StreakContext.Provider>
  );
};

export default TopNav; 