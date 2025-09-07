import '../App.css';
import './mulChoice.css';
import { useEffect, useState, useRef } from 'react';

import { Preferences } from '@capacitor/preferences';
import { useDatabase } from '../databaseContext';
import { useFilter } from '../filterContext';

function MulChoice() {
  const [question, setQuestion] = useState(null);
  const buttonRefs = useRef([]); 
  const [choices, setChoices] = useState([]); 
  const alreadyAnswered = useRef(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const { dbRef, isReady } = useDatabase();
  const { selectedTopics } = useFilter();

  // From stack overflow - Fisher–Yates (aka Knuth) Shuffle.
  function shuffle(array) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  const fetchQuestion = async () => {
    try {
      const db = dbRef.current;
      if (!db) return; // Wait for DB to be ready
      const { value } = await Preferences.get({ key: 'askedMulChoiceIds' });
      const askedMulChoiceIds = value ? JSON.parse(value) : [];

      // Build WHERE clause
      let where = askedMulChoiceIds.length
        ? `WHERE id NOT IN (${askedMulChoiceIds.join(',')}) AND question_type='mul_choice'`
        : `WHERE question_type='mul_choice'`;

      // Adds topic filter if relevant
      if (selectedTopics && selectedTopics.length > 0) {
        const topicList = selectedTopics.map(t => `'${t}'`).join(',');
        where += ` AND topic IN (${topicList})`;
      }

      const res = await db.query(`SELECT * FROM questions ${where} LIMIT 1;`);
      const question = res.values && res.values.length > 0 ? res.values[0] : null;
      if (!question) {
        // No more questions, reset askedMulChoiceIds and try again
        await Preferences.set({ key: 'askedMulChoiceIds', value: JSON.stringify([]) });
        await fetchQuestion();
        return;
      }
      setQuestion(question);

      // Parse and combine choices
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
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    fetchQuestion();
  }, [isReady]);

  if (!question) return <div>AAAAAAH</div>;

  function handleChoice(idx) {
  if (!alreadyAnswered.current) {
    const correctIdx = choices.findIndex(c => c === question.mark_scheme);
    if (correctIdx !== -1 && buttonRefs.current[correctIdx]) {
      buttonRefs.current[correctIdx].style.border = "0.15rem solid #00b179";
      buttonRefs.current[correctIdx].style.padding = "0.4rem 0.43rem";
    }
    if (idx !== correctIdx && buttonRefs.current[idx]) {
      buttonRefs.current[idx].style.border = "0.15rem solid #c1272d";
      buttonRefs.current[idx].style.padding = "0.4rem 0.43rem";
    }
    alreadyAnswered.current = true;
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
        <button className='Submit'onClick={handleNext} disabled={!hasAnswered}>Next 
        </button>
      </div>
    </div>
  );
};

export default MulChoice;