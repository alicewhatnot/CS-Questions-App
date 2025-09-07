import { createContext, useContext, useState, useEffect } from 'react';
import { Preferences } from '@capacitor/preferences';

const StatsContext = createContext();

export function StatsProvider({ children }) {
  const [sessionStats, setSessionStats] = useState(null);

  // Load session stats from storage on mount
  useEffect(() => {
    Preferences.get({ key: 'sessionStats' }).then(({ value }) => {
      setSessionStats(value ? JSON.parse(value) : getEmptyStats());
    });
  }, []);

  // Save session stats to storage whenever they change
  useEffect(() => {
    if (sessionStats)
      Preferences.set({ key: 'sessionStats', value: JSON.stringify(sessionStats) });
  }, [sessionStats]);

  function startSession() {
    const empty = getEmptyStats();
    setSessionStats(empty);
    Preferences.set({ key: 'sessionStats', value: JSON.stringify(empty) });
  }

  return (
    <StatsContext.Provider value={{ sessionStats, setSessionStats, startSession }}>
      {children}
    </StatsContext.Provider>
  );
}

export function useStats() {
  return useContext(StatsContext);
}

export function getEmptyStats() {
  return {
    mulChoice: { totalAnswered: 0, totalCorrect: 0},
    longform: { totalAnswered: 0, totalFullMarks: 0, totalMarks: 0, totalPossibleMarks: 0}
  };
}