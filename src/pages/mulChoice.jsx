import '../App.css';
import './mulChoice.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function MulChoice() {
  const [question, setQuestion] = useState(null);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('http://localhost:3001/questions?type=mul_choice');
      const question = res.data;
      
      setQuestion(question);
      
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  if (!question) return <div></div>;

  // Parse wrong answers
  let choices = [];
  try {
    choices = typeof question.wrong_choices === 'string'
      ? JSON.parse(question.wrong_choices)
      : question.wrong_choices || [];
  } catch {
    choices = [];
  }
  choices.push(question.mark_scheme); 

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

  shuffle(choices)

  
  
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
          <div className="answerChoice" key={idx}>
            {choice}
          </div>
        )}
      </div>
    </div>
  );
};

export default MulChoice;