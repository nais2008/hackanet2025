import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import "./DropDown.scss";

interface Item {
  id: number;
  label: string;
}

const data: Item[] = [
  { id: 0, label: "Istanbul, TR (AHL)" },
  { id: 1, label: "Paris, FR (CDG)" },
  { id: 2, label: "Paris, FR (CDG)" },
  { id: 3, label: "Paris, FR (CDG)" },
  { id: 4, label: "Paris, FR (CDG)" },
];

const DropDown: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>(data);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/p/")) {
      setSelectedItem(null);
    }
  }, [location]);

  const toggleDropdown = () => setOpen(!isOpen);

  const handleItemClick = (id: number) => {
    setSelectedItem(id);
    navigate(`/p/${id}`);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {selectedItem !== null ? items.find(item => item.id === selectedItem)?.label : "Select your destination"}
        <i className={`fa fa-chevron-right icon ${isOpen && "open"}`}></i>
      </div>
      <div className={`dropdown-body ${isOpen && "open"}`}>
        {items.map((item) => (
          <div className="dropdown-item" onClick={() => handleItemClick(item.id)} key={item.id} id={item.id.toString()}>
            <span className={`dropdown-item-dot ${item.id === selectedItem && "selected"}`}>• </span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DropDown;
