import '../App.css';
import './mulChoice.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function MulChoice() {
  const [question, setQuestion] = useState(null);
  const buttonRefs = useRef([]); 
  const [choices, setChoices] = useState([]); 
  const alreadyAnswered = useRef(false);
  const [hasAnswered, setHasAnswered] = useState(false);

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
      const stored = localStorage.getItem('askedMulChoiceIds');
      let askedMulChoiceIds = stored ? JSON.parse(stored) : [];

      const res = await axios.post(
        'http://192.168.0.40:3001/questions?type=mul_choice',
        { excludeIds: askedMulChoiceIds }
      );
      const question = res.data;
      setQuestion(question);

      if (question.id && !askedMulChoiceIds.includes(question.id)) {
        askedMulChoiceIds.push(question.id);
        localStorage.setItem('askedMulChoiceIds', JSON.stringify(askedMulChoiceIds));
      }
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

    } catch (err) {
      if (err.response && err.response.status === 404) {
        localStorage.setItem('askedMulChoiceIds', JSON.stringify([]));
        fetchQuestion();
      } else {
        console.error('Error fetching questions:', err);
      }
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  if (!question) return <div></div>;

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