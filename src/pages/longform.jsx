import '../App.css'; 
import './longform.css'; 
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import tick from '/assets/tick.svg';


function Longform() {
  const [question, setQuestion] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [servedIds, setServedIds] = useState([]);
  const [ticked, setTicked] = useState([])
  const [ShowMS, setShowMS] = useState(false);
  const textareaRef = useRef(null);
  const answerBoxRef = useRef(null);
  const [questionStage, setQuestionStage] = useState("typingAnswer");
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleNextQuestion = () => {
  if (servedIds.length >= totalQuestions && totalQuestions > 0) {
    setServedIds([]);
  }
  fetchQuestion();
};

    const fetchQuestion = async () => {
      try {
        const res = await axios.get('http://localhost:3001/questions', {
          params: {
            type: 'longform',
            servedIds: servedIds
          }
        });
        setQuestion(res.data);
        setServedIds(prev => [...prev, res.data.id]);
      } catch (err) {
        console.error('Error fetching questions:', err);
      }
    }

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleSubmit = () => {
    if (questionStage === "typingAnswer") {
      if (answerBoxRef.current && answerBoxRef.current.value.trim() !== "") {
        setQuestionStage("markingAnswer");
        setSubmitted(true);
        setShowMS(true);
        if (textareaRef.current) {
          textareaRef.current.style.flex = 'none';
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
      }
    else {
      handleNextQuestion()
      }
    }
  };

  if (!question) return <div></div>;

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

  console.log("Raw mark_scheme:", question.mark_scheme);
  var mark_scheme_array = question.mark_scheme;
  mark_scheme_array = JSON.parse(mark_scheme_array);


  const handleMarkGiven = (idx) => {
    setTicked((prev) =>
    prev.includes(idx)
      ? prev.filter(i => i !== idx)
      : [...prev, idx]
    );
  };

  return (
    <div className="Container">
      <div className='Header'>
        <h1>{question.topic}</h1>
        <hr />
        <h2>{question.subtopic}</h2>
      </div>
      <div className='QuestionContainer'ref={textareaRef}>
        <div className="Question">
          <p>{question.question} [{question.marks}]</p>
        </div>
        <div className='Response' >
          <textarea
            ref={answerBoxRef}
            className={`ResponseEntry${submitted ? ' shrink' : ''}`}
            placeholder='Type your answer here ...'
          /> 
        </div>
      </div>
      {ShowMS && (
        <div className="MSContainer">
          <h3>Did you say...</h3>
          <div className="MarkScheme">
            {mark_scheme_array.map((mark_point, idx) => 
              <div className={`MarkingPoint${ticked.includes(idx) ? ' Ticked' : ''}`} key={idx}>
                {mark_point}
                <button
                  className={`TickBox${ticked.includes(idx) ? ' Ticked' : ''}`}
                  onClick={() => handleMarkGiven(idx)}
                >
                  <img src={tick} alt="tickIcon" className={ticked.includes(idx) ? "Ticked" : ""}/>
                </button>
              </div>
            )}
            <div className='MarksAchieved'>Marks Achieved: {Math.min(ticked.length, question.marks)}/{question.marks}</div>  
          </div>
        </div>
      )}
      <div className='SubmitContainer'>
        <button className='Submit' onClick={handleSubmit}>
          {submitted ? "Next" : "Submit"}
        </button>    
      </div>
    </div>
  );
}

export default Longform;