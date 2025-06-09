import './App.css'; 
import { useEffect, useState } from 'react';
import axios from 'axios';

function Longform() {
  console.log('App component rendered'); 

  const [question, setQuestion] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/questions')
      .then(res => {
        const questions = res.data;
        if (questions.length > 0) {
          const randomIndex = Math.floor(Math.random() * questions.length);
          setQuestion(questions[randomIndex]);
        }
      })
      .catch(err => console.error('Error fetching questions:', err));
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
    <h1>Random Question</h1>
    <div className="Question">
      <p>{question.question}</p>
    </div>
  </div>
);
}
export default Longform;
