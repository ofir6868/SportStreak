import React from 'react';
import './PremiumOffer.css';

const PremiumOffer: React.FC = () => (
  <div className="PremiumOffer">
    <img src="/mascot.png" alt="Mascot" className="PremiumMascotImg" />
    <div className="PremiumText">
      <div className="PremiumTitle">Super SportStreak</div>
      <div className="PremiumDesc"><div>Keep your Streak strong 💪🏽</div>
        with Ad-free, unlimited practice, legendary rewards!
      </div>
      <button className="PremiumCTA">2 WEEKS FREE</button>
    </div>
  </div>
);

export default PremiumOffer; 