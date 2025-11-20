import React, { useState, useEffect } from 'react';
import './MoodSelector.css';

const MOOD_LEVELS = [
  {
    level: 1,
    emoji: '😰',
    text: "I think this is going to fall apart",
    color: '#FF3B30'
  },
  {
    level: 2,
    emoji: '😟',
    text: "Struggling to stay positive",
    color: '#FF6B58'
  },
  {
    level: 3,
    emoji: '😐',
    text: "Getting through the day",
    color: '#FF9500'
  },
  {
    level: 4,
    emoji: '🙂',
    text: "Feeling steady and focused",
    color: '#FFCC00'
  },
  {
    level: 5,
    emoji: '😊',
    text: "Energized and optimistic",
    color: '#8FC93A'
  },
  {
    level: 6,
    emoji: '😄',
    text: "Firing on all cylinders",
    color: '#34C759'
  },
  {
    level: 7,
    emoji: '🚀',
    text: "We're going to change the world",
    color: '#00D084'
  }
];

function MoodSelector({ onSelect, selectedMood }) {
  const [hoveredMood, setHoveredMood] = useState(null);

  return (
    <div className="mood-selector-container">
      <div className="mood-selector-card card">
        <h2 className="mood-selector-title">Select Your Mood</h2>

        <div className="mood-levels">
          {MOOD_LEVELS.map((mood) => (
            <div
              key={mood.level}
              className={`mood-level ${selectedMood === mood.level ? 'selected' : ''} ${
                hoveredMood === mood.level ? 'hovered' : ''
              }`}
              onClick={() => onSelect(mood.level)}
              onMouseEnter={() => setHoveredMood(mood.level)}
              onMouseLeave={() => setHoveredMood(null)}
              style={{
                '--mood-color': mood.color
              }}
            >
              <div className="mood-emoji">{mood.emoji}</div>
              <div className="mood-info">
                <div className="mood-text">{mood.text}</div>
                <div className="mood-level-number">Level {mood.level}</div>
              </div>
              <div className="mood-checkmark">
                {selectedMood === mood.level && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </div>
            </div>
          ))}
        </div>

        {selectedMood && (
          <div className="mood-hint">
            Tap your selection again to confirm with your password
          </div>
        )}
      </div>
    </div>
  );
}

export default MoodSelector;
