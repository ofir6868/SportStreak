import React, { useState } from 'react';
import './DailyQuests.css';

const initialProgress = [40, 70];

const DailyQuests: React.FC = () => {
  const [progress, setProgress] = useState(initialProgress);
  const handleQuestClick = (idx: number) => {
    setProgress((prev) => prev.map((p, i) => i === idx ? Math.min(100, p + 20) : p));
  };
  return (
    <div className="DailyQuests">
      <div className="DailyQuestsHeader">
        <span className="DailyQuestsTitle">Daily Quests</span>
        <button className="DailyQuestsCTA">VIEW ALL</button>
      </div>
      <div className="QuestList">
        <div className="QuestItem" onClick={() => handleQuestClick(0)} style={{cursor:'pointer'}}>
          <span className="QuestIcon">⚡</span>
          <span className="QuestLabel">Earn 10 XP</span>
          <div className="QuestProgressBar">
            <div className="QuestProgress" style={{width: progress[0] + '%'}}></div>
          </div>
        </div>
        <div className="QuestItem" onClick={() => handleQuestClick(1)} style={{cursor:'pointer'}}>
          <span className="QuestIcon">✅</span>
          <span className="QuestLabel">Get 5 in a row correct in 2 …</span>
          <div className="QuestProgressBar">
            <div className="QuestProgress" style={{width: progress[1] + '%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyQuests; 