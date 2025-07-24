import React from 'react';
import './MainContent.css';
import TopNav, { StreakContext } from './TopNav';
import LearningPath from './LearningPath';

const MainContent: React.FC = () => (
  <main className="MainContent">
    <TopNav>
      <StreakContext.Consumer>
        {({ increaseStreak }) => <LearningPath increaseStreak={increaseStreak} />}
      </StreakContext.Consumer>
    </TopNav>
  </main>
);

export default MainContent; 