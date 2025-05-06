import React, { JSX, useEffect, useRef } from "react"

import "./ContextMenu.scss"

interface IMenuItem {
  icon: JSX.Element;
  text: string;
  action: string;
}

interface IContextMenuProps {
  items: IMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<IContextMenuProps> = ({ items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (action: string) => {
    console.log(`Выполняется действие: ${action}`);
    onClose();
  };

  return (
    <div className="context-menu-container" ref={menuRef}>
      <div className="action-menu open">
        {items.map((item, index) => (
          <div
            key={index}
            className="action-item"
            onClick={() => handleAction(item.action)}
          >
            {item.icon}
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContextMenu
