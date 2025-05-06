import React, { useState } from "react";
import { FaSearch, FaCaretDown } from "react-icons/fa";
import "./SearchComponent.scss";

interface SearchComponentProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  showSearch?: boolean; // Показывать поиск (по умолчанию true)
  showFilter?: boolean; // Показывать фильтрацию (по умолчанию true)
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  onFilterChange,
  showSearch = true,
  showFilter = true,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Самые активные");

  const filterOptions = ["Самые активные", "Все проекты", "Завершённые"];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleFilterToggle = () => {
    setFilterOpen(!isFilterOpen);
  };

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    onFilterChange(filter);
    setFilterOpen(false);
  };

  return (
    <div className="search-container">
      {showSearch && (
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <FaSearch className="search-icon" />
        </div>
      )}
      {showFilter && (
        <div className="filter-wrapper">
          <button className="filter-button" onClick={handleFilterToggle}>
            <span>{selectedFilter}</span>
            <FaCaretDown className="dropdown-icon" />
          </button>
          {isFilterOpen && (
            <div className="filter-dropdown">
              {filterOptions.map((option) => (
                <div
                  key={option}
                  className="filter-option"
                  onClick={() => handleFilterSelect(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
