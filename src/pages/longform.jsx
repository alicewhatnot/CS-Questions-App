import '../App.css';
import './longform.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import tick from '/assets/tick.svg';

function Longform() {
  const [question, setQuestion] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [questionStage, setQuestionStage] = useState("typingAnswer");
  const [ticked, setTicked] = useState([]);
  const [ShowMS, setShowMS] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('http://localhost:3001/questions?type=longform');
      const question = res.data;
     
      setQuestion(question);
      
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  // Reset everything and fetch a new question
  const handleNextQuestion = async () => {
    setSubmitted(false);
    setQuestionStage("typingAnswer");
    setShowMS(false);
    setTicked([]);
    if (containerRef.current) {
      textareaRef.current.value = "";
      containerRef.current.style.flex = '1 1 auto';
      containerRef.current.style.height = 'auto';
    }
    await fetchQuestion();
  };

  // Handle submit/next logic
  const handleSubmit = () => {
    if (questionStage === "typingAnswer") {
      if (textareaRef.current && textareaRef.current.value.trim() !== "") {
        setQuestionStage("markingAnswer");
        setSubmitted(true);
        setShowMS(true);

        containerRef.current.style.flex = 'none';
        containerRef.current.style.height = 'auto';
        containerRef.current.style.height = containerRef.current.scrollHeight + 'px';
      }
    } else {
      handleNextQuestion();
    }
  };

  // Marking logic
  const handleMarkGiven = (idx) => {
    setTicked((prev) =>
      prev.includes(idx)
        ? prev.filter(i => i !== idx)
        : [...prev, idx]
    );
  };

  if (!question) return <div></div>;

  // Parse mark scheme
  let mark_scheme_array = [];
  try {
    mark_scheme_array = typeof question.mark_scheme === 'string'
      ? JSON.parse(question.mark_scheme)
      : question.mark_scheme || [];
  } catch {
    mark_scheme_array = [];
  }

  return (
    <div className="Container">
      <div className='Header'>
        <h1>{question.topic}</h1>
        <hr />
        <h2>{question.subtopic}</h2>
      </div>
      <div className='QuestionContainer' ref={containerRef}>
        <div className="Question">
          <p>{question.question} [{question.marks}]</p>
        </div>
        <div className='Response'>
          <textarea
            ref={textareaRef}
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
                  type="button"
                >
                  <img src={tick} alt="tickIcon" className={ticked.includes(idx) ? "Ticked" : ""} />
                </button>
              </div>
            )}
            <div className='MarksAchieved'>
              Marks Achieved: {Math.min(ticked.length, question.marks)}/{question.marks}
            </div>
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