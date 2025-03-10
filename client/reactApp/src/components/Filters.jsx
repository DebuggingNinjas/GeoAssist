import { useState } from "react";

function Filters({ filterLabels = ["Popular", "Trending", "New"] }) {
  const [selectedFilter, setSelectedFilter] = useState("Popular");

  return (
    <div className="filters-container">
      {filterLabels.map((label, index) => (
        <button
          key={index}
          onClick={() => setSelectedFilter(label)}
          className={`filter-button ${selectedFilter === label ? 'filter-button-active' : ''}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default Filters;