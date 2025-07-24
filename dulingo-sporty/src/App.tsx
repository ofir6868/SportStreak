import React from 'react';
import './App.css';
import LeftSidebar from './components/LeftSidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';

function App() {
  return (
    <div className="AppLayout">
      <LeftSidebar />
      <MainContent />
      <RightSidebar />
    </div>
  );
}

export default App; 