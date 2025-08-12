import { useEffect, useState } from 'react';
import { useFilter } from '../filterContext';
import { useDatabase } from '../databaseContext'; // <-- import your db context

function Filters() {
  const [topics, setTopics] = useState([]);
  const { selectedTopics, setSelectedTopics } = useFilter();
  const { dbRef, isReady } = useDatabase(); // <-- get dbRef

  useEffect(() => {
    const fetchTopics = async () => {
      if (!isReady || !dbRef.current) return;
      const res = await dbRef.current.query('SELECT DISTINCT topic FROM questions');
      setTopics(res.values.map(row => row.topic));
    };
    fetchTopics();
  }, [isReady, dbRef]);

  function handleTopicClick(topic) {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  }

  return (
    <div className="TopicsContainer">
      {topics.map((topic, idx) => (
        <button
          className={`topicChoice${selectedTopics.includes(topic) ? ' selected' : ''}`}
          key={idx}
          onClick={() => handleTopicClick(topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}

export default Filters;