import './stats.css';

import { useEffect, useState } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useStats, getEmptyStats } from '../statsContext';

function percent(n, d) {
  return d === 0 ? "N/A" : ((n / d) * 100).toFixed(1) + "%";
}

export default function Stats() {
  const [allTime, setAllTime] = useState(getEmptyStats());
  const { sessionStats, startSession } = useStats();

  useEffect(() => {
    async function fetchStats() {
      const mul = await Preferences.get({ key: 'mulChoiceStats' });
      const longf = await Preferences.get({ key: 'longformStats' });
      setAllTime({
        mulChoice: mul.value ? JSON.parse(mul.value) : getEmptyStats().mulChoice,
        longform: longf.value ? JSON.parse(longf.value) : getEmptyStats().longform,
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="StatsContainer">
        <div className='Header'>
            <h1>
            Statistics
            </h1>
            <hr />
        </div>


        <div className='Stats'>
            <div className='CurrentSession'>
                <div className='CurrentSessionHeader'>
                    <h2>Current Session</h2>
                </div>
                <div className='MulChoice'>
                    <h3>Multiple Choice</h3>
                    <p>Answered: {sessionStats?.mulChoice.totalAnswered ?? 0}</p>
                    <p>Correct: {sessionStats?.mulChoice.totalCorrect ?? 0}</p>
                    <p>Percentage: {percent(sessionStats?.mulChoice.totalCorrect ?? 0, sessionStats?.mulChoice.totalAnswered ?? 0)}</p>
                </div>
                <div className='Longform'>
                    <h3>Longform</h3>
                    <p>Answered: {sessionStats?.longform.totalAnswered ?? 0}</p>
                    <p>Full Marks: {sessionStats?.longform.totalFullMarks ?? 0}</p>
                    <p>Marks Achieved: {sessionStats?.longform.totalMarks ?? 0}/{sessionStats?.longform.totalPossibleMarks ?? 0}</p>
                    <p>Percentage Marks: {percent(sessionStats?.longform.totalMarks ?? 0, sessionStats?.longform.totalPossibleMarks ?? 0)}</p>
                </div>
                <button onClick={startSession} className='SessionButton'>Start New Session</button>

            </div>

            <div className='AllTime'>
                <h2>All Time</h2>
                <div className='MulChoice'>
                    <h3>Multiple Choice</h3>
                    <p>Answered: {allTime.mulChoice.totalAnswered}</p>
                    <p>Correct: {allTime.mulChoice.totalCorrect}</p>
                    <p>Percentage: {percent(allTime.mulChoice.totalCorrect, allTime.mulChoice.totalAnswered)}</p>
                </div>
                <div className='Longform'>
                    <h3>Longform</h3>
                        <p>Answered: {allTime.longform.totalAnswered}</p>
                        <p>Full Marks: {allTime.longform.totalFullMarks}</p>
                        <p>Marks Achieved: {allTime.longform.totalMarks}/{allTime.longform.totalPossibleMarks}</p>
                        <p>Percentage Marks: {percent(allTime.longform.totalMarks, allTime.longform.totalPossibleMarks)}</p>
                </div>
            </div>
        </div>
    </div>
  );
}