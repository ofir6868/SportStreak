import React from 'react';
import './RightSidebar.css';
import PremiumOffer from './PremiumOffer';
import GoldLeague from './GoldLeague';
import DailyQuests from './DailyQuests';

const RightSidebar: React.FC = () => (
  <aside className="RightSidebar">
    <PremiumOffer />
    <GoldLeague />
    <DailyQuests />
  </aside>
);

export default RightSidebar; 