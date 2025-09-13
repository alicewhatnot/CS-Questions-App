import { useEffect, useState, useRef } from 'react';
import { Preferences } from '@capacitor/preferences';
import { useStats } from '../statsContext';
import { useDatabase } from '../databaseContext';
import { useFilter } from '../filterContext';
import '../App.css';
import './mulChoice.css';

function MulChoice() {
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [resetAttempted, setResetAttempted] = useState(false);
  const buttonRefs = useRef([]);
  const alreadyAnswered = useRef(false);
  const { dbRef, isReady } = useDatabase();
  const { selectedTopics } = useFilter();
  const { sessionStats, setSessionStats } = useStats(); 

  function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  const fetchQuestion = async (reset = false) => {
    try {
      const db = dbRef.current;
      if (!db) return;
      let askedMulChoiceIds = [];
      if (!reset) {
        const { value } = await Preferences.get({ key: 'askedMulChoiceIds' });
        askedMulChoiceIds = value ? JSON.parse(value) : [];
      } else {
        await Preferences.set({ key: 'askedMulChoiceIds', value: JSON.stringify([]) });
      }

      let where = askedMulChoiceIds.length
        ? `WHERE id NOT IN (${askedMulChoiceIds.join(',')}) AND question_type='mul_choice'`
        : `WHERE question_type='mul_choice'`;

      if (selectedTopics && selectedTopics.length > 0) {
        const conditions = selectedTopics.map(key => {
          const [topic, subtopic] = key.split(':');
          return `(topic='${topic}' AND subtopic='${subtopic}')`;
        });
        where += ` AND (${conditions.join(' OR ')})`;
      }

      const res = await db.query(`SELECT * FROM questions ${where} LIMIT 1;`);
      const question = res.values && res.values.length > 0 ? res.values[0] : null;

      if (!question && !reset) {
        setResetAttempted(true);
        fetchQuestion(true); // Try once with reset
        return;
      }

      setQuestion(question);

      if (question) {
        let newChoices = [];
        try {
          newChoices = typeof question.wrong_choices === 'string'
            ? JSON.parse(question.wrong_choices)
            : question.wrong_choices || [];
        } catch {
          newChoices = [];
        }
        newChoices.push(question.mark_scheme);
        shuffle(newChoices);
        setChoices(newChoices);

        // Add this question's id to askedMulChoiceIds
        if (question.id && !askedMulChoiceIds.includes(question.id)) {
          askedMulChoiceIds.push(question.id);
          await Preferences.set({
            key: 'askedMulChoiceIds',
            value: JSON.stringify(askedMulChoiceIds),
          });
        }
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    fetchQuestion();
  }, [isReady]);

  function handleChoice(idx) {
    console.log("handleChoice called", alreadyAnswered.current);
    if (!alreadyAnswered.current) {
      alreadyAnswered.current = true; 
      const correct = choices[idx] === question.mark_scheme;
      const correctIdx = choices.findIndex(c => c === question.mark_scheme);

      // Update all-time stats
      Preferences.get({ key: 'mulChoiceStats' }).then(({ value }) => {
        let stats = value ? JSON.parse(value) : { totalAnswered: 0, totalCorrect: 0 };
        stats.totalAnswered += 1/2;
        if (correct) stats.totalCorrect += 1/2;
        Preferences.set({ key: 'mulChoiceStats', value: JSON.stringify(stats) }); 
      });

      // Update session stats
      if (sessionStats) {
        setSessionStats(prev => {
          const newStats = { ...prev };
          newStats.mulChoice.totalAnswered += 1/2;
          if (correct) newStats.mulChoice.totalCorrect += 1/2;
          return newStats;
        });
      }

      if (correctIdx !== -1 && buttonRefs.current[correctIdx]) {
        buttonRefs.current[correctIdx].style.border = "0.15rem solid #00b179";
        buttonRefs.current[correctIdx].style.padding = "0.4rem 0.43rem";
      }
      if (idx !== correctIdx && buttonRefs.current[idx]) {
        buttonRefs.current[idx].style.border = "0.15rem solid #c1272d";
        buttonRefs.current[idx].style.padding = "0.4rem 0.43rem";
      }
      setHasAnswered(true);
    }
  }

  function handleNext() {
    alreadyAnswered.current = false;
    setHasAnswered(false);
    buttonRefs.current.forEach(btn => {
      if (btn) {
        btn.style.border = "";
        btn.style.padding = "";
      }
    });
    fetchQuestion();
  }

  if (!question) {
    if (resetAttempted) {
      return (
        <div className="Container">
            <p className='NoQuestionsText'>
              No multiple choice questions match the current filters.
            </p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className='Container'>
      <div className='Header'>
        <h1>{question.topic}</h1>
        <hr />
        <h2>{question.subtopic}</h2>
      </div>
      <div className='QuestionContainer'>
        <div className="Question">
          <p>{question.question}</p>
        </div>
        {choices.map((choice, idx) =>
          <button className="answerChoice"
            key={idx}
            onClick={() => handleChoice(idx)}
            ref={el => buttonRefs.current[idx] = el}
          >
            {choice}
          </button>
        )}
      </div>
      <div className='SubmitContainer'>
        <button className='Submit' onClick={handleNext} disabled={!hasAnswered}>Next</button>
      </div>
    </div>
  );
}

export default MulChoice;