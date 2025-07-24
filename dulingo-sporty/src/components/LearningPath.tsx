import React, { useState, useRef, useEffect } from 'react';
import './LearningPath.css';

interface LearningPathProps {
  increaseStreak: () => void;
}

const initialUnits = [
  { icon: '📘', status: 'active', label: 'Lesson 1', task: 'Read Chapter', button: 'Start' },
  { icon: '✅', status: 'completed', label: 'Lesson 2', task: 'Quiz', button: 'Review' },
  { icon: '🏋️‍♂️', status: 'active', label: 'Practice', task: 'Workout', button: 'Go' },
  { icon: '🔒', status: 'locked', label: 'Challenge', task: 'Locked', button: 'Locked' },
  { icon: '🔒', status: 'locked', label: 'Bonus', task: 'Locked', button: 'Locked' },
  { icon: '🔒', status: 'locked', label: 'Final', task: 'Locked', button: 'Locked' },
];

const nodePositions = [
  { x: 120, y: 90 },
  { x: 60, y: 270 },
  { x: 180, y: 450 },
  { x: 80, y: 630 },
  { x: 160, y: 810 },
  { x: 100, y: 990 },
];

function getCurvePath(p1: {x:number,y:number}, p2: {x:number,y:number}) {
  const mx = (p1.x + p2.x) / 2;
  return `M${p1.x},${p1.y} Q${mx},${p1.y + 60} ${p2.x},${p2.y}`;
}

const LearningPath: React.FC<LearningPathProps> = ({ increaseStreak }) => {
  const [units, setUnits] = useState(initialUnits);
  const [tooltipIdx, setTooltipIdx] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUnit, setModalUnit] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (modalOpen && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => {});
    } else if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [modalOpen]);

  const handleUnitClick = (idx: number) => {
    if (units[idx].status === 'active') {
      setModalOpen(true);
      setModalUnit(idx);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalUnit(null);
  };

  const handleCompleteLesson = () => {
    if (modalUnit !== null) {
      const idx = modalUnit;
      if (units[idx].status === 'active') {
        const newUnits = [...units];
        newUnits[idx].status = 'completed';
        if (newUnits[idx + 1] && newUnits[idx + 1].status === 'locked') {
          newUnits[idx + 1].status = 'active';
        }
        setUnits(newUnits);
        increaseStreak();
      }
      setModalOpen(false);
      setModalUnit(null);
    }
  };

  return (
    <div className="LearningPathScrollable">
      {/* Mascot image next to first node */}
      <img src="/mascot.png" alt="Mascot" className="MascotImage" />
      <svg className="CurvyPathSVG" width={240} height={1100} viewBox="0 0 240 1100">
        <defs>
          <linearGradient id="path-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1CB0F6" />
            <stop offset="100%" stopColor="#58CC02" />
          </linearGradient>
        </defs>
        {nodePositions.slice(0, -1).map((p, i) => (
          <path
            key={i}
            d={getCurvePath(p, nodePositions[i + 1])}
            stroke="url(#path-gradient)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            filter="url(#curvy-glow)"
          />
        ))}
        <filter id="curvy-glow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        {units.map((unit, idx) => {
          const { x, y } = nodePositions[idx];
          return (
            <g key={idx}>
              <circle
                cx={x}
                cy={y}
                r={48}
                fill={unit.status === 'completed' ? '#58CC02' : unit.status === 'active' ? '#1CB0F6' : '#DDDDDD'}
                stroke="#fff"
                strokeWidth={6}
                style={{ filter: unit.status !== 'locked' ? 'drop-shadow(0 4px 16px #1cb0f655)' : 'none', cursor: unit.status === 'active' ? 'pointer' : 'default', transition: 'fill 0.2s' }}
                onClick={() => handleUnitClick(idx)}
                onMouseEnter={() => unit.status === 'locked' && setTooltipIdx(idx)}
                onMouseLeave={() => setTooltipIdx(null)}
              />
              <text
                x={x}
                y={y + 12}
                textAnchor="middle"
                fontSize="2.5rem"
                fontWeight="bold"
                fill={unit.status === 'locked' ? '#aaa' : '#fff'}
                pointerEvents="none"
                style={{ userSelect: 'none' }}
              >
                {unit.icon}
              </text>
              {unit.status === 'locked' && tooltipIdx === idx && (
                <foreignObject x={x - 80} y={y - 80} width={160} height={40} style={{overflow:'visible'}}>
                  <div className="PathTooltipSVG">Complete previous lessons to unlock</div>
                </foreignObject>
              )}
              {/* Task label and button below each node */}
              <foreignObject x={x - 60} y={y + 55} width={120} height={60} style={{overflow:'visible'}}>
                <div className="PathTaskBox">
                  <div className="PathTaskLabel">{unit.task}</div>
                  <button
                    className={`PathTaskBtn${unit.status === 'active' ? ' active' : ''}`}
                    disabled={unit.status !== 'active'}
                    onClick={() => handleUnitClick(idx)}
                  >
                    {unit.button}
                  </button>
                </div>
              </foreignObject>
              {/* Main label above each node */}
              <foreignObject x={x - 60} y={y - 70} width={120} height={40} style={{overflow:'visible'}}>
                <div className="PathNodeLabel">{unit.label}</div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
      {/* Modal for camera */}
      {modalOpen && (
        <div className="CameraModalOverlay">
          <div className="CameraModal">
            <button className="CameraModalClose" onClick={handleModalClose}>&times;</button>
            <h2 className="CameraModalTitle">Complete Your Exercise</h2>
            <p className="CameraModalDesc">Show your exercise on camera to complete this lesson!</p>
            <video ref={videoRef} className="CameraVideo" autoPlay playsInline muted style={{width:'100%',height:'60%',borderRadius:'1.5rem',background:'#222'}} />
            <button className="CameraModalAction" onClick={handleCompleteLesson}>Mark as Complete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPath; 