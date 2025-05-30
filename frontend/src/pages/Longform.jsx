import { useEffect, useState } from 'react';
import axios from 'axios';

function longform() {
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/questions')
      .then(res => {
        const questions = res.data;
        if (questions.length > 0) {
          // Pick a random index
          const randomIndex = Math.floor(Math.random() * questions.length);
          setQuestion(questions[randomIndex]);
        }
      })
      .catch(err => console.error('Error fetching questions:', err));
  }, []);

  if (!question) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Random Question</h1>
      <div className="mb-4 border-b pb-2">
        <p>{question.question}</p>
        <ul className="list-disc ml-4">
          {JSON.parse(question.options).map((opt, i) => (
            <li key={i}>{opt}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default longform;
