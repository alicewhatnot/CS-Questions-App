import { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [selectedTopics, setSelectedTopics] = useState([]);
  return (
    <FilterContext.Provider value={{ selectedTopics, setSelectedTopics }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  return useContext(FilterContext);
}