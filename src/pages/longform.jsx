import '../App.css'; 
import './longform.css'; 
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import tick from '/assets/tick.svg';


function Longform() {
  const [question, setQuestion] = useState(null);
  const [submitted, setSubmitted] = useState(false);
<<<<<<< Updated upstream
  const [servedIds, setServedIds] = useState([]);
=======
  const [questionStage, setQuestionStage] = useState("typingAnswer");
>>>>>>> Stashed changes
  const [ticked, setTicked] = useState([])
  const [ShowMS, setShowMS] = useState(false);
  const textareaRef = useRef(null);
  const answerBoxRef = useRef(null);
<<<<<<< Updated upstream
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

=======

  const fetchQuestion = async () => {
    try {
      const res = await axios.get('http://localhost:3001/questions?type=longform');
      const questions = res.data;
      if (questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestion(questions[randomIndex]);
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  }

>>>>>>> Stashed changes
  useEffect(() => {
    fetchQuestion();
  }, []);

<<<<<<< Updated upstream
=======
    const handleNextQuestion = async () => {
    setSubmitted(false);
    setQuestionStage("typingAnswer");
    setShowMS(false);
    setTicked([]);
    if (answerBoxRef.current) {
      answerBoxRef.current.value = "";
    }
    await fetchQuestion();
    if (textareaRef.current) {
      textareaRef.current.style.flex = '1 1 auto';
    }
  };

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    else {
      handleNextQuestion()
      }
=======
    } else {
      handleNextQuestion();
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
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