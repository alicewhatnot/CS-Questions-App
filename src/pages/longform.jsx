import '../App.css';
import './longform.css';
import { useEffect, useState, useRef } from 'react';
import tick from '/assets/tick.svg';

import { Preferences } from '@capacitor/preferences';
import { useDatabase } from '../databaseContext';

function Longform() {
  const [question, setQuestion] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [questionStage, setQuestionStage] = useState("typingAnswer");
  const [ticked, setTicked] = useState([]);
  const [ShowMS, setShowMS] = useState(false);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const dbRef = useDatabase();

  const fetchQuestion = async () => {
    try {
      const db = dbRef.current;
      if (!db) return; // Wait for DB to be ready
      const { value } = await Preferences.get({ key: 'askedLongformIds' });
      const askedLongformIds = value ? JSON.parse(value) : [];

      // Build WHERE clause
      const where = askedLongformIds.length
        ? `WHERE id NOT IN (${askedLongformIds.join(',')}) AND type='longform'`
        : `WHERE type='longform'`;

      const res = await db.query(`SELECT * FROM questions ${where} LIMIT 1;`);
      const question = res.values && res.values.length > 0 ? res.values[0] : null;
      if (!question) {
        // No more questions, reset askedLongformIds and try again
        await Preferences.set({ key: 'askedLongformIds', value: JSON.stringify([]) });
        fetchQuestion();
        return;
      }
      setQuestion(question);

      if (question.id && !askedLongformIds.includes(question.id)) {
        askedLongformIds.push(question.id);
        await Preferences.set({
          key: 'askedLongformIds',
          value: JSON.stringify(askedLongformIds),
        });
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };


  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle submit/next logic
  const handleSubmit = () => {
    if (questionStage === "typingAnswer") {
      if (textareaRef.current && textareaRef.current.value.trim() !== "") {
        setQuestionStage("markingAnswer");
        setSubmitted(true);
        setShowMS(true);
        if (textareaRef.current) {
          textareaRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        containerRef.current.style.flex = 'none';
        containerRef.current.style.height = 'auto';
        containerRef.current.style.height = containerRef.current.scrollHeight + 'px';      }
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

  if (!question) return <div>aaaaaaaa</div>;

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
              <div className={`MarkingPoint${ticked.includes(idx) ? ' Ticked' : ''}`} 
              key={idx}
              onClick={() => handleMarkGiven(idx)}>
                {mark_point}
                <div
                  className={`TickBox${ticked.includes(idx) ? ' Ticked' : ''}`}
                  
                  type="button"
                >
                  <img src={tick} alt="tickIcon" className={ticked.includes(idx) ? "Ticked" : ""} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className='SubmitContainer'>
        {submitted && (
          <div className='MarksAchieved'>
            Marks Achieved: {Math.min(ticked.length, question.marks)}/{question.marks}
          </div>
        )}
        {!submitted && (
          <div></div>
        )}
        <button className='Submit' onClick={handleSubmit}>
          {submitted ? "Next" : "Submit"}
        </button>
      </div>
    </div>
  );
}

export default Longform;