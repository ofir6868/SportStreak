import React from 'react';
import './GoldLeague.css';

const GoldLeague: React.FC = () => (
  <div className="GoldLeague">
    <div className="GoldLeagueHeader">
      <span className="GoldTrophy">🏆</span>
      <span className="GoldLeagueTitle">Gold League</span>
      <button className="GoldLeagueCTA">VIEW LEAGUE</button>
    </div>
    <div className="GoldLeagueMsg">Complete a lesson to join this week’s leaderboard and compete against other learners</div>
  </div>
);

export default GoldLeague; 