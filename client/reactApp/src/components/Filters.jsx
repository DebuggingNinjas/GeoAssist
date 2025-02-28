import { useState } from "react";

// eslint-disable-next-line react/prop-types
function Filters({ filterLabels = ["Popular", "Trending", "New"] }) {
  const [selectedFilter, setSelectedFilter] = useState("Popular");

  return (
    <div className="flex gap-2 p-2">
      {filterLabels.map((label, index) => (
        <button
          key={index}
          onClick={() => setSelectedFilter(label)}
          className={`px-4 py-2 rounded-full hover:cursor-pointer text-sm font-medium focus:outline-none transition-colors duration-200 ${
            selectedFilter === label
              ? "bg-blue-600 text-white border border-blue-600"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default Filters;
