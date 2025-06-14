import '../App.css'; 
import './longform.css'; 
import { useEffect, useState } from 'react';
import axios from 'axios';

function Longform() {
  console.log('App component rendered'); 
// Sets up questions array
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    //Fetch questions
  async function fetchQuestions() {
    try {
      //recieves database from backend, query for longform
      const res = await axios.get('http://localhost:3001/questions?type=longform');
      const questions = res.data;
      // Choose a random question
      if (questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestion(questions[randomIndex]);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  }
  fetchQuestions();
}, []);

  if (!question) return <div>Loading...</div>;

  let options = [];
try {
  if (question.options) {
    options = typeof question.options === 'string'
      ? JSON.parse(question.options)
      : question.options;
  } else {
    options = [];
  }
} catch {
  options = [];
}

console.log('question:', question);

return (
  <div className="Container">
    <div className='Header'>
      <h1>{question.topic}</h1>
      <hr></hr>
      <h2>{question.subtopic}</h2>
    </div>
    <div className='QuestionContainer'>
      <div className="Question">
        <p>{question.question}</p>
      </div>
      <div className='Response'>
        <textarea className='ResponseEntry' placeholder='Type your answer here ...'/> 
      </div>
    </div>
    <div className='SubmitContainer'>
      <button className='Submit'>Submit</button>
    </div>
  </div>
);
}
export default Longform;
