import { useEffect, useState, useRef } from 'react';
import { useFilter } from '../filterContext';
import { useDatabase } from '../databaseContext';
import './filters.css';

function Filters() {
  const [topicMap, setTopicMap] = useState({}); 
  const { selectedTopics, setSelectedTopics } = useFilter();
  const { dbRef, isReady } = useDatabase();
  const selectAllRef = useRef(null);

  const makeKey = (topic, subtopic) => `${topic}:${subtopic}`;
  const allKeys = Object.entries(topicMap).flatMap(([topic, subs]) =>
    subs.map(sub => makeKey(topic, sub))
  );

  useEffect(() => {
    if (selectAllRef.current) {
      const allSelected = allKeys.length > 0 && allKeys.every(k => selectedTopics.includes(k));
      const someSelected = allKeys.some(k => selectedTopics.includes(k));
      selectAllRef.current.indeterminate = !allSelected && someSelected;
    }
  }, [selectedTopics, allKeys.length]);


  useEffect(() => {
    const fetchTopics = async () => {
      if (!isReady || !dbRef.current) return;
      const res = await dbRef.current.query(
        'SELECT DISTINCT topic, subtopic FROM questions'
      );

      // Group subtopics under each topic
      const map = {};
      res.values.forEach(row => {
        if (!map[row.topic]) {
          map[row.topic] = [];
        }
        if (row.subtopic && !map[row.topic].includes(row.subtopic)) {
          map[row.topic].push(row.subtopic);
        }
      });

      setTopicMap(map);
    };
    fetchTopics();
  }, [isReady, dbRef]);

  function handleCheckboxChange(topic, subtopic) {
    const key = makeKey(topic, subtopic);
    setSelectedTopics(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  }

  function handleSelectAllTopic(topic) {
    const subKeys = topicMap[topic].map(sub => makeKey(topic, sub));
    const allSelected = subKeys.every(k => selectedTopics.includes(k));
    setSelectedTopics(prev =>
      allSelected
        ? prev.filter(k => !subKeys.includes(k)) // unselect all
        : [...new Set([...prev, ...subKeys])] // add all
    );
  }

  function handleSelectAllTopics() {
    const allSelected = allKeys.every(k => selectedTopics.includes(k));
    setSelectedTopics(allSelected ? [] : allKeys);
  }

  return (
    <div className="FilterContainer">
      <div className='Header'>
        <h1>
          Filters
        </h1>
        <hr />
      </div>
      {/* Select all topics */}
      <label className="selectAllTopics">
        <input
          type="checkbox"
          ref={selectAllRef}
          checked={allKeys.length > 0 && allKeys.every(k => selectedTopics.includes(k))}
          onChange={handleSelectAllTopics}
        />
        <span>Select All Topics</span>
      </label>

      {Object.entries(topicMap).map(([topic, subtopics]) => {
        const subKeys = subtopics.map(sub => makeKey(topic, sub));
        const allSelected = subKeys.every(k => selectedTopics.includes(k));
        const someSelected = subKeys.some(k => selectedTopics.includes(k));

        return (
          <div key={topic} className="Topics">
            {/* Topic-level checkbox */}
            <label className="TopicSelect">
              <input
                type="checkbox"
                checked={allSelected}
                ref={el => {
                  if (el) el.indeterminate = !allSelected && someSelected;
                }}
                onChange={() => handleSelectAllTopic(topic)}
              />
              <span>{topic}</span>
            </label>

            {/* Subtopics */}
            <div className="SubtopicSelect">
              {subtopics.map((sub, idx) => {
                const key = makeKey(topic, sub);
                return (
                    <label key={idx} className="SubtopicOption">
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(key)}
                      onChange={() => handleCheckboxChange(topic, sub)}
                    />
                    <span className="SubtopicText">
                      {sub}
                    </span>
                  </label>                   
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Filters;
