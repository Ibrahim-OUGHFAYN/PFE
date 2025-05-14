import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function MultiSelectDropdown({ options = [], selected = [], setSelected }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Ensure selected is always an array
  const safeSelected = Array.isArray(selected) ? selected : [];
  
  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.multi-select-container')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  const toggleOption = (option) => {
    // Create a new array based on the current selection
    const newSelected = [...safeSelected];
    
    if (newSelected.includes(option)) {
      // Remove the option if already selected
      const index = newSelected.indexOf(option);
      newSelected.splice(index, 1);
    } else {
      // Add the option if not already selected
      newSelected.push(option);
    }
    
    // Update the parent component's state
    setSelected(newSelected);
  };
  
  const toggleSelectAll = () => {
    if (safeSelected.length === options.length) {
      // If all are selected, clear the selection
      setSelected([]);
    } else {
      // If not all are selected, select all options
      setSelected([...options]);
    }
  };
  
  const isSelected = (option) => safeSelected.includes(option);
  
  return (
    <div className="relative w-full multi-select-container">
      <button
        type="button"
        className="w-full border rounded-lg px-3 py-2 bg-white flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {safeSelected.length ? safeSelected.join(", ") : "Select options"}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-y-auto">
          <div className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={safeSelected.length === options.length && options.length > 0}
              onChange={toggleSelectAll}
              id="select-all"
            />
            <label htmlFor="select-all" className="ml-2 text-sm cursor-pointer w-full">
              Select all
            </label>
          </div>
          {options.map((option) => (
            <div key={option} className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer">
              <input
                type="checkbox"
                id={`option-${option}`}
                checked={isSelected(option)}
                onChange={() => toggleOption(option)}
              />
              <label htmlFor={`option-${option}`} className="ml-2 text-sm cursor-pointer w-full">
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}