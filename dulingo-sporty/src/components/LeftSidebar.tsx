import React from 'react';
import './LeftSidebar.css';

const navItems = [
  { icon: '🏠', label: 'Learn', active: true },
  { icon: '📝', label: 'Practice' },
  { icon: '🏆', label: 'Leaderboards' },
  { icon: '🎯', label: 'Quests' },
  { icon: '🛒', label: 'Shop' },
  { icon: '👤', label: 'Profile' },
  { icon: '⋯', label: 'More' },
];

const LeftSidebar: React.FC = () => (
  <nav className="LeftSidebar">
    <div className="SidebarLogoRow">
      <img src="/mascot.png" alt="Mascot" className="SidebarMascotImg" />
      <div className="SidebarLogo">SportStreak</div>
    </div>
    <ul className="SidebarNav">
      {navItems.map((item) => (
        <li key={item.label} className={`SidebarNavItem${item.active ? ' active' : ''}`}>
          <span className="SidebarIcon">{item.icon}</span>
          <span className="SidebarLabel">{item.label}</span>
        </li>
      ))}
    </ul>
  </nav>
);

export default LeftSidebar; 